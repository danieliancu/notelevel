<?php

namespace App\Http\Controllers;

use App\Models\PdfFolder;
use App\Support\NameSanitizer;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PdfFolderController extends Controller
{
    public function store(Request $request)
    {
        $name = NameSanitizer::name((string) $request->input('name', ''), 'folder');

        if (PdfFolder::where('name', $name)->exists()) {
            throw ValidationException::withMessages(['name' => 'A folder with that name already exists.']);
        }

        $pdfFolder = PdfFolder::create(['name' => $name]);

        return response()->json($pdfFolder, 201);
    }

    public function destroy(PdfFolder $pdfFolder)
    {
        $pdfFolder->favourites()->update(['pdf_folder_id' => null]);
        $pdfFolder->delete();

        return response()->json(['ok' => true]);
    }
}
