<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Demo guest accounts are meant to be short-lived; prune aggressively
// instead of daily, so abandoned storage doesn't linger for hours.
Schedule::command('guests:prune', ['--hours' => 3])->hourly();
