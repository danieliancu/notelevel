<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PruneGuestAccounts extends Command
{
    protected $signature = 'guests:prune {--hours=24 : Delete guest accounts older than this many hours}';

    protected $description = 'Delete ephemeral "Try demo" guest accounts (and their tenant storage) older than the given age';

    public function handle(): int
    {
        $cutoff = now()->subHours((int) $this->option('hours'));

        $guests = User::where('role', 'guest')
            ->where('created_at', '<', $cutoff)
            ->get();

        foreach ($guests as $guest) {
            Storage::disk('tenants')->deleteDirectory((string) $guest->id);
            $guest->delete();
        }

        $this->info("Pruned {$guests->count()} guest account(s).");

        return self::SUCCESS;
    }
}
