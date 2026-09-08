<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\ResidentNeed;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $auth = Auth::user()->resident;
        $billPay = Bill::with('payment')->where('resident_id', $auth->id)->whereHas('payment', function ($query) {
            $query->where('id', '!=', null);
        })->count();

        $need = ResidentNeed::with('item')->where('resident_id', $auth->id)->get();

        $billActive2 = $auth->bills()->where('status', '!=', 'lunas')->count();
        return inertia(
            'Resident/Dashboard/Index',
            [
                'billsPay' => $billPay,
                'needs' => $need,
                'billActive2' => $billActive2,
            ]
        );
    }
}
