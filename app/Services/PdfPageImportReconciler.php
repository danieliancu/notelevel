<?php

namespace App\Services;

use App\Models\Document;
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
     */
    public function reconcile(Document $document, ?array $content): void
    {
        $wantedPairs = $this->extractSourcePdfPairs($content);
        $wantedKeys = array_map(fn (array $pair) => $pair[0].':'.$pair[1], $wantedPairs);

        $existingRows = PdfPageImport::where('document_id', $document->id)->get();

        foreach ($existingRows as $row) {
            $key = $row->pdf_id.':'.$row->page_index;
            if (! in_array($key, $wantedKeys, true)) {
                $row->delete();
            }
        }

        foreach ($wantedPairs as [$pdfId, $pageIndex]) {
            $existing = PdfPageImport::where('pdf_id', $pdfId)->where('page_index', $pageIndex)->first();

            if ($existing) {
                if ($existing->document_id !== $document->id) {
                    Log::info('canvas.pdf_page_import_conflict', [
                        'pdf_id' => $pdfId,
                        'page_index' => $pageIndex,
                        'existing_document_id' => $existing->document_id,
                        'attempted_document_id' => $document->id,
                    ]);
                }

                continue;
            }

            PdfPageImport::create([
                'pdf_id' => $pdfId,
                'page_index' => $pageIndex,
                'document_id' => $document->id,
            ]);
        }
    }

    /**
     * @return array<int, array{0: int, 1: int}>
     */
    private function extractSourcePdfPairs(?array $content): array
    {
        $pages = $content['pages'] ?? [];
        $pairs = [];

        foreach ($pages as $page) {
            $source = $page['sourcePdf'] ?? null;
            if (is_array($source) && isset($source['pdfId'], $source['pageIndex'])) {
                $pairs[(int) $source['pdfId'].':'.(int) $source['pageIndex']] = [
                    (int) $source['pdfId'],
                    (int) $source['pageIndex'],
                ];
            }
        }

        return array_values($pairs);
    }
}
