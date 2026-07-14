<?php

namespace App\Services;

use App\Models\Document;
use App\Models\Pdf;
use App\Models\PdfPageImport;
use Illuminate\Support\Facades\Log;

class PdfPageImportReconciler
{
    /**
     * Sync pdf_page_imports against a document's freshly-saved content, so a
     * PDF page becomes "locked" the moment a document that references it is
     * saved, and unlocked automatically the moment it no longer is (page
     * removed, document deleted via FK cascade). Self-healing: safe to call
     * after every content-bearing save, regardless of how content changed.
     *
     * A page duplicated in the source PDF's page_order can be imported once
     * per occurrence, so locks are counted per (pdf_id, page_index) pair
     * rather than tracked as a single yes/no lock — a document referencing
     * the same source page twice needs two lock rows, not one.
     */
    public function reconcile(Document $document, ?array $content): void
    {
        $wantedCounts = $this->extractSourcePdfPairCounts($content);

        $existingForDoc = PdfPageImport::where('document_id', $document->id)->get()
            ->groupBy(fn ($row) => $row->pdf_id.':'.$row->page_index);

        // Release rows this document no longer wants (or wants fewer of).
        foreach ($existingForDoc as $key => $rows) {
            $excess = $rows->count() - ($wantedCounts[$key] ?? 0);
            if ($excess > 0) {
                $rows->take($excess)->each->delete();
            }
        }

        foreach ($wantedCounts as $key => $wantedCount) {
            [$pdfId, $pageIndex] = array_map('intval', explode(':', $key));
            $ownedByDoc = PdfPageImport::where('document_id', $document->id)
                ->where('pdf_id', $pdfId)->where('page_index', $pageIndex)->count();

            for ($i = $ownedByDoc; $i < $wantedCount; $i++) {
                // Claim a lock taken immediately by lockPdfPage() at insert
                // time, before this document had ever been saved.
                $pending = PdfPageImport::where('pdf_id', $pdfId)->where('page_index', $pageIndex)
                    ->whereNull('document_id')->first();

                if ($pending) {
                    $pending->update(['document_id' => $document->id]);

                    continue;
                }

                $totalLocked = PdfPageImport::where('pdf_id', $pdfId)->where('page_index', $pageIndex)->count();
                if ($totalLocked >= $this->pageOccurrenceCount($pdfId, $pageIndex)) {
                    Log::info('canvas.pdf_page_import_conflict', [
                        'pdf_id' => $pdfId,
                        'page_index' => $pageIndex,
                        'attempted_document_id' => $document->id,
                    ]);

                    break;
                }

                PdfPageImport::create([
                    'pdf_id' => $pdfId,
                    'page_index' => $pageIndex,
                    'document_id' => $document->id,
                ]);
            }
        }
    }

    /**
     * How many times $pageIndex appears in the source PDF's page_order
     * (i.e. how many independent imports of it are allowed). Falls back to
     * 1 if the PDF or its page_order is unavailable.
     */
    private function pageOccurrenceCount(int $pdfId, int $pageIndex): int
    {
        $pageOrder = Pdf::find($pdfId)?->page_order ?? [];

        $count = collect($pageOrder)->filter(fn ($index) => (int) $index === $pageIndex)->count();

        return max(1, $count);
    }

    /**
     * @return array<string, int> keyed by "pdfId:pageIndex" => occurrence count in $content
     */
    private function extractSourcePdfPairCounts(?array $content): array
    {
        $pages = $content['pages'] ?? [];
        $counts = [];

        foreach ($pages as $page) {
            $source = $page['sourcePdf'] ?? null;
            if (is_array($source) && isset($source['pdfId'], $source['pageIndex'])) {
                $key = ((int) $source['pdfId']).':'.((int) $source['pageIndex']);
                $counts[$key] = ($counts[$key] ?? 0) + 1;
            }
        }

        return $counts;
    }
}
