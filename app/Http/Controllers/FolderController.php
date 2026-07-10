<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Services\TenantStorageTransaction;
use App\Support\NameSanitizer;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FolderController extends Controller
{
    public function __construct(private TenantStorageTransaction $storageTransaction) {}

    public function store(Request $request)
    {
        $name = NameSanitizer::name((string) $request->input('name', ''), 'folder');

        if (Folder::where('name', $name)->whereNull('parent_id')->exists()) {
            throw ValidationException::withMessages(['name' => 'A folder with that name already exists.']);
        }

        $folder = Folder::create(['name' => $name]);

        return response()->json($folder, 201);
    }

    public function update(Request $request, Folder $folder)
    {
        $name = NameSanitizer::name((string) $request->input('name', ''), 'folder');

        if (Folder::where('name', $name)->whereNull('parent_id')->where('id', '!=', $folder->id)->exists()) {
            throw ValidationException::withMessages(['name' => 'A folder with that name already exists.']);
        }

        $folder->update(['name' => $name]);

        return response()->json($folder);
    }

    public function destroy(Folder $folder)
    {
        $documents = $folder->documents()->get();
        $directories = $documents
            ->map(fn ($document) => auth()->id().'/documents/'.$document->id)
            ->all();

        $this->storageTransaction->deleteDirectories($directories, function () use ($folder) {
            $folder->documents()->delete();

            return $folder->delete();
        });

        return response()->json(['ok' => true]);
    }
}
