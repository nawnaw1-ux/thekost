<?php

use App\Http\Controllers\Admin\BillController;
use App\Http\Controllers\Admin\BoardingBranchesController;
use App\Http\Controllers\Admin\ContactAdminController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DownloadMonthlyDataController;
use App\Http\Controllers\Admin\InputPunishmentReportController;
use App\Http\Controllers\Admin\inputReportController;
use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\Admin\OutputReportController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\PromoController;
use App\Http\Controllers\Admin\PunishmentController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\ResidentController;
use App\Http\Controllers\Admin\RoomController as AdminRoomController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SetupController;
use App\Http\Controllers\Admin\UserNeedController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OwnerPaymentConfirmationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Resident\AgrementFormController;
use App\Http\Controllers\Resident\BillController as ResidentBillController;
use App\Http\Controllers\Resident\BranchInfoController;
use App\Http\Controllers\Resident\DashboardController;
use App\Http\Controllers\Resident\DownloadPDFController;
use App\Http\Controllers\Resident\PaymentController;
use App\Http\Controllers\Resident\PaymentHistory;
use App\Http\Controllers\Resident\PaymentHistoryController;
use App\Http\Controllers\Resident\ProfileController as ResidentProfileController;
use App\Http\Controllers\RoomController;
use Illuminate\Foundation\Application;
use Illuminate\Routing\Router;
use Illuminate\Routing\RouteRegistrar;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/kos-agreement', [AgrementFormController::class, 'index'])->name('kos.agreement');
Route::post('/kos-agreement', [AgrementFormController::class, 'store'])->name('kos.agreement.store');
Route::get('/konfirmasi-pembayaran-owner/{token}/{action}', [OwnerPaymentConfirmationController::class, 'show'])
    ->whereIn('action', ['received', 'not-received'])
    ->name('owner.payment-confirmation.show');
Route::post('/konfirmasi-pembayaran-owner/{token}/{action}', [OwnerPaymentConfirmationController::class, 'confirm'])
    ->whereIn('action', ['received', 'not-received'])
    ->name('owner.payment-confirmation.confirm');

Route::middleware(['auth', "role:resident", 'verified', 'kos'])->group(function () {
    Route::resource('dashboard', DashboardController::class)->names('resident.dashboard');
    Route::resource('riwayat', PaymentHistoryController::class)->names('resident.paymenthistory');
    Route::resource('tagihan', ResidentBillController::class)->names('resident.bill');
    Route::resource('info-cabang', BranchInfoController::class)->names('resident.branchinfo');
    Route::resource('profile', ResidentProfileController::class)->names('resident.profile');
    Route::post('pembayaran', [PaymentController::class, 'payment'])->name('resident.payment.post');
    Route::get('download', [DownloadPDFController::class, 'download'])->name('resident.donwload.pdf');
});
Route::prefix('admin')->middleware(['auth', "role:admin", 'verified'])->group(function () {
    Route::get('download-bulanan', [DownloadMonthlyDataController::class, 'download'])->name('admin.download.monthly');
    Route::resource('setup', SetupController::class)->names('admin.setup');
    Route::resource('dashboard', AdminDashboardController::class)->names('admin.dashboard');
    Route::resource('item', ItemController::class)->names('admin.item');
    Route::post('update-item', [ItemController::class, 'updateItem'])->name('admin.item.update-item');

    Route::resource('penghuni', ResidentController::class)->names('admin.resident');
    Route::resource('keperluan-penghuni', UserNeedController::class)->names('admin.userneed');
    Route::resource('promosi', PromoController::class)->names('admin.promo');
    Route::resource('tagihan', BillController::class)->names('admin.bill');
    Route::resource('denda', PunishmentController::class)->names('admin.punishment');
    Route::resource('profile', AdminProfileController::class)->names('admin.profile');
    Route::post('dashboard/update-branch', [AdminDashboardController::class, 'updateStatusBranch'])->name('admin.dashboard.update-branch');

    Route::post('/penghuni/store', [ResidentController::class, 'storeResident'])->name('admin.resident.storeResident');
    Route::post('/penghuni/update', [ResidentController::class, 'updateResident'])->name('admin.resident.updateResident');
    Route::resource('pengaturan', SettingController::class)->names('admin.setting');
    Route::resource('laporan', AdminReportController::class)->except('show')->names('admin.report');
    Route::resource('laporan/pemasukkan', inputReportController::class)->except('show')->names('admin.inputreport');
    Route::resource('laporan/pemasukkan-denda', InputPunishmentReportController::class)->except('show')->names('admin.inputpunishmentreport');
    Route::resource('laporan/pengeluaran', OutputReportController::class)->names('admin.outputreport');
    Route::resource('kamar', AdminRoomController::class)->names('admin.room');
    Route::resource('cabang-kos', BoardingBranchesController::class)->except('update')->names('admin.boardingbranch');

    Route::post('pemasukkan/update', [inputReportController::class, 'updateRecord'])->name('admin.inputreport-update.update');
    Route::post('pemasukkan-denda/update', [InputPunishmentReportController::class, 'updateRecord'])->name('admin.inputreportpunishment-update.update');
    Route::post('pengeluaran/update', [OutputReportController::class, 'updateRecord'])->name('admin.outputreport-update.update');

    Route::post('laporan/bulanan', [AdminReportController::class, 'monthlyReport'])->name('admin.report.monthlyReport');
    Route::post('laporan/okupansi-penghuni', [AdminReportController::class, 'okupansiResident'])->name('admin.report.okupansiResident');

    Route::post('laporan/download-excel-bulanan', [AdminReportController::class, 'downloadExcelMonthly'])->name('admin.report.downloadExcelMonthly');
    Route::post('cabang-kos/update', [BoardingBranchesController::class, 'update'])->name('admin.boardingbranch.update');
    Route::post('keperluan/update', [UserNeedController::class, 'updateNeedResident'])->name('admin.updateNeedResident.update');
    Route::post('tambah-kamar', [AdminRoomController::class, 'addRoom'])->name('admin.room.addRoom');
    Route::post('hapus-penghuni', [AdminRoomController::class, 'deleteUserInRoom'])->name('admin.room.deleteUserInRoom');
    Route::post('tambah-penghuni', [AdminRoomController::class, 'addUserInRoom'])->name('admin.room.addUserInRoom');
    Route::post('edit-kamar', [AdminRoomController::class, 'editRoom'])->name('admin.room.editRoom');
    Route::post('edit-bank-account', [SettingController::class, 'updateBankAccount'])->name('admin.setting.updateBankAccount');
});

Route::get('/test', function () {


    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.fonnte.com/send',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => array(
            'target' => '08123456789|Fonnte|Admin,08987654321|Lily|Client',
            'message' => 'test message to {name} as {var1}',
            'delay' => '2',
            'countryCode' => '62', //optional
        ),
        CURLOPT_HTTPHEADER => array(
            'Authorization: eKiTBsZysH8oC732Egbq' //change TOKEN to your actual token
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    echo $response;
});
require __DIR__ . '/auth.php';
