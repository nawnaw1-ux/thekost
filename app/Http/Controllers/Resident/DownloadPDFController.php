<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BoardingBranch;
use App\Models\ContactAdmin;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use LaravelDaily\Invoices\Invoice;
use LaravelDaily\Invoices\Classes\Party;
use LaravelDaily\Invoices\Classes\InvoiceItem;
use Barryvdh\DomPDF\Facade\Pdf;

class DownloadPDFController extends Controller
{
    public function download(Request $request)
    {
        $Bill = Bill::with(['detailBills', 'payment', 'resident.user'])->where('id', $request->id)->first();
        $boardingBranch = BoardingBranch::where('id', $Bill->boarding_branch_id)->first();
        $bill = [
            'invoice' => $Bill->invoice,
            'date_payment' => Carbon::parse($Bill->date_pay)->translatedFormat('d F Y'),
        ];

        $user = [
            'name' => $Bill->resident->user->name,
            'email' => $Bill->resident->user->email,
        ];

        $items = $Bill->detailBills->map(function ($item, $index) {
            return [
                'no' => $index + 1,
                'name' => $item->name,
                'price' => number_format($item->price, 0, ',', '.'),
            ];
        })->toArray();

        if ($Bill->penalty > 0) {
            $items[] = [
                'no' => count($items) + 1,
                'name' => "Denda " . $Bill->penalty_day . " Hari",
                'price' => number_format($Bill->penalty, 0, ',', '.'),
            ];
        }

        $format = $Bill->amount + $Bill->penalty;
        $subtotal = number_format($format, 0, ',', '.');

        $pdf = Pdf::loadView('pdf', [
            'user' => $user,
            'bill' => $bill,
            'items' => $items,
            'subtotal' => $subtotal,
            'boardingBranch' => $boardingBranch,
        ]);

        return $pdf->stream('invoice.pdf');
    }
}
