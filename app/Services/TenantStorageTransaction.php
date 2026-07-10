<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class TenantStorageTransaction
{
    public function createWithUpload(
        UploadedFile $upload,
        callable $createModel,
        callable $directoryForModel,
        string $filename = 'source.pdf',
    ): Model {
        $disk = Storage::disk('tenants');
        $directory = null;

        DB::beginTransaction();

        try {
            $model = $createModel();
            $directory = $directoryForModel($model);
            $path = $disk->putFileAs($directory, $upload, $filename);

            if ($path === false || ! $disk->exists($directory.'/'.$filename)) {
                throw new RuntimeException('The uploaded file could not be persisted.');
            }

            DB::commit();

            Log::info('tenant_storage.upload_committed', [
                'model' => $model::class,
                'model_id' => $model->getKey(),
                'directory' => $directory,
            ]);

            return $model;
        } catch (Throwable $exception) {
            DB::rollBack();

            if ($directory !== null) {
                $disk->deleteDirectory($directory);
            }

            throw $exception;
        }
    }

    /**
     * Replace a flat directory while retaining enough data to restore the
     * previous version if either filesystem promotion or the DB commit fails.
     *
     * @param  array<string, string>  $files
     */
    public function replaceDirectory(string $directory, array $files, callable $commitDatabase): mixed
    {
        $disk = Storage::disk('tenants');
        $suffix = bin2hex(random_bytes(8));
        $temporary = $directory.'.tmp-'.$suffix;
        $backup = $directory.'.bak-'.$suffix;
        $hadPreviousDirectory = $disk->directoryExists($directory);

        try {
            foreach ($files as $filename => $contents) {
                if (! $disk->put($temporary.'/'.$filename, $contents)) {
                    throw new RuntimeException("Could not stage tenant file: {$filename}");
                }
            }

            foreach (array_keys($files) as $filename) {
                if (! $disk->exists($temporary.'/'.$filename)) {
                    throw new RuntimeException("Staged tenant file is missing: {$filename}");
                }
            }

            if ($hadPreviousDirectory) {
                foreach ($disk->files($directory) as $existingFile) {
                    $relative = basename($existingFile);
                    if (! $disk->copy($existingFile, $backup.'/'.$relative)) {
                        throw new RuntimeException("Could not back up tenant file: {$relative}");
                    }
                }
            }

            if ($disk->directoryExists($directory) && ! $disk->deleteDirectory($directory)) {
                throw new RuntimeException('Could not remove the previous tenant directory.');
            }

            foreach (array_keys($files) as $filename) {
                if (! $disk->move($temporary.'/'.$filename, $directory.'/'.$filename)) {
                    throw new RuntimeException("Could not promote tenant file: {$filename}");
                }
            }

            $result = DB::transaction($commitDatabase);
            Log::info('tenant_storage.directory_replaced', ['directory' => $directory]);
            $disk->deleteDirectory($temporary);
            $disk->deleteDirectory($backup);

            return $result;
        } catch (Throwable $exception) {
            $disk->deleteDirectory($directory);

            if ($hadPreviousDirectory && $disk->directoryExists($backup)) {
                foreach ($disk->files($backup) as $backupFile) {
                    $disk->copy($backupFile, $directory.'/'.basename($backupFile));
                }
            }

            $disk->deleteDirectory($temporary);
            $disk->deleteDirectory($backup);

            throw $exception;
        }
    }

    /** @param  list<string>  $directories */
    public function deleteDirectories(array $directories, callable $commitDatabase): mixed
    {
        $disk = Storage::disk('tenants');
        $suffix = bin2hex(random_bytes(8));
        $backups = [];

        try {
            foreach (array_unique($directories) as $directory) {
                if (! $disk->directoryExists($directory)) {
                    continue;
                }

                $backup = $directory.'.bak-'.$suffix;
                $backups[$directory] = $backup;

                foreach ($disk->allFiles($directory) as $existingFile) {
                    $relative = substr($existingFile, strlen($directory) + 1);
                    if (! $disk->copy($existingFile, $backup.'/'.$relative)) {
                        throw new RuntimeException("Could not back up tenant file: {$relative}");
                    }
                }

                if (! $disk->deleteDirectory($directory)) {
                    throw new RuntimeException("Could not delete tenant directory: {$directory}");
                }
            }

            $result = DB::transaction($commitDatabase);
            Log::info('tenant_storage.directories_deleted', ['count' => count($backups)]);

            foreach ($backups as $backup) {
                $disk->deleteDirectory($backup);
            }

            return $result;
        } catch (Throwable $exception) {
            foreach ($backups as $directory => $backup) {
                $disk->deleteDirectory($directory);

                if ($disk->directoryExists($backup)) {
                    foreach ($disk->allFiles($backup) as $backupFile) {
                        $relative = substr($backupFile, strlen($backup) + 1);
                        $disk->copy($backupFile, $directory.'/'.$relative);
                    }
                }

                $disk->deleteDirectory($backup);
            }

            throw $exception;
        }
    }
}
