<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class HealthController extends Controller
{
    public function ready(): JsonResponse
    {
        $checks = [
            'database' => fn () => DB::select('select 1'),
            'cache' => function () {
                $key = 'health:'.bin2hex(random_bytes(8));
                Cache::put($key, 'ok', 10);
                $value = Cache::get($key);
                Cache::forget($key);

                if ($value !== 'ok') {
                    throw new \RuntimeException('Cache read/write check failed.');
                }
            },
            'storage' => function () {
                $path = '.health/'.bin2hex(random_bytes(8));
                $disk = Storage::disk('tenants');
                $disk->put($path, 'ok');

                if (! $disk->exists($path)) {
                    throw new \RuntimeException('Storage read/write check failed.');
                }

                $disk->delete($path);
            },
        ];

        $status = [];
        foreach ($checks as $name => $check) {
            try {
                $check();
                $status[$name] = 'ok';
            } catch (Throwable) {
                $status[$name] = 'failed';
            }
        }

        $ready = ! in_array('failed', $status, true);

        return response()->json([
            'status' => $ready ? 'ready' : 'not_ready',
            'checks' => $status,
        ], $ready ? 200 : 503);
    }
}
