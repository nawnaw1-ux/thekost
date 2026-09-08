<?php

use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Resident\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('notification', [PaymentController::class, 'notification'])->name('notification');
Route::get('laporan/download-excel-tahunan', [ReportController::class, 'downloadExcel'])->name('admin.report.downloadExcel');
