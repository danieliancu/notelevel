<?php

namespace App\Services;

use App\Models\Document;
use App\Models\Folder;
use App\Support\NameSanitizer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class DocumentManager
{
    public function __construct(private TenantStorageTransaction $storageTransaction) {}

    public function rename(Document $document, string $rawTitle): Document
    {
        $title = NameSanitizer::name($rawTitle, 'untitled');
        $this->assertTitleAvailable($title, $document->folder_id, $document->id);
        $document->update(['title' => $title]);

        return $document->refresh();
    }

    public function move(Document $document, ?int $folderId): Document
    {
        $resolvedFolderId = $folderId === null ? null : Folder::findOrFail($folderId)->id;
        $this->assertTitleAvailable($document->title, $resolvedFolderId, $document->id);
        $document->update(['folder_id' => $resolvedFolderId]);

        return $document->refresh();
    }

    public function duplicate(Document $document): Document
    {
        $baseTitle = NameSanitizer::name($document->title.' copy', 'untitled');
        $title = $baseTitle;
        $suffix = 2;
        while (Document::where('title', $title)->where('folder_id', $document->folder_id)->exists()) {
            $title = NameSanitizer::name($baseTitle.' '.$suffix++, 'untitled');
        }

        DB::beginTransaction();
        $targetDirectory = null;

        try {
            $copy = $document->replicate(['version', 'created_at', 'updated_at']);
            $copy->title = $title;
            $copy->version = 1;
            $copy->save();

            $disk = Storage::disk('tenants');
            $sourceDirectory = auth()->id().'/documents/'.$document->id.'/pages';
            $targetDirectory = auth()->id().'/documents/'.$copy->id.'/pages';
            foreach ($disk->files($sourceDirectory) as $file) {
                if (! $disk->copy($file, $targetDirectory.'/'.basename($file))) {
                    throw new RuntimeException('Could not duplicate all document pages.');
                }
            }

            DB::commit();

            return $copy;
        } catch (Throwable $exception) {
            DB::rollBack();
            if ($targetDirectory !== null) {
                Storage::disk('tenants')->deleteDirectory($targetDirectory);
            }

            throw $exception;
        }
    }

    public function delete(Document $document): void
    {
        $this->storageTransaction->deleteDirectories(
            [auth()->id().'/documents/'.$document->id],
            fn () => $document->delete(),
        );
    }

    private function assertTitleAvailable(string $title, ?int $folderId, int $exceptId): void
    {
        if (Document::where('title', $title)->where('folder_id', $folderId)->where('id', '!=', $exceptId)->exists()) {
            throw ValidationException::withMessages(['title' => 'A document with that name already exists.']);
        }
    }
}
