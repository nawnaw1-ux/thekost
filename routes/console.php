<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;


// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();


Schedule::command('app:generate-bills')->dailyAt('00:00');
Schedule::command('app:penalty')->dailyAt('00:03');
Schedule::command('app:reminder')->dailyAt('00:06');
Schedule::command('app:reminder-h')->dailyAt('00:09');


// Schedule::command('app:calculate-penalties')->everyMinute();
