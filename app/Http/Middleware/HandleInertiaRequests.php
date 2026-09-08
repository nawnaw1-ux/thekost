<?php

namespace App\Http\Middleware;

use App\Models\Bill;
use App\Models\BoardingBranch;
use App\Models\BoardingService;
use App\Models\ContactAdmin;
use App\Models\Item;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $resident = $user ? $user->resident : null;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'error' => fn() => $request->session()->get('error'),
                'success' => fn() => $request->session()->get('success'),
            ],
        ]) + ($user ? [
            'items' => fn() => Item::whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })->get(),
            'residents' => fn() => \App\Models\Resident::with('user')
                ->whereDoesntHave('bills')
                ->get(),
            'residentBoardingBranch' => fn() => BoardingBranch::with([
                'residents' => fn($query) => $query->where('status_active', 1)->with('user')
            ])
                ->where('is_activated', true)
                ->first()
                ?->residents,
            'promos' => fn() => \App\Models\Promo::all(),
            'boarding_branch' => fn() => \App\Models\BoardingBranch::all(),
            'monthNow' => fn() => Carbon::now()->translatedFormat('F'),
            'active_boarding_branch' => fn() => \App\Models\BoardingBranch::where('is_activated', true)->first(),
            'billActive' => fn() => $resident
                ? $resident->bills()
                ->where('status', '!=', 'lunas')
                ->whereDate('date_invoice', '<=', Carbon::today())
                ->get()
                : collect(),
            'room_qty' => fn() => BoardingService::first(),
            'resident_no_room' => fn() => \App\Models\Resident::with('user')
                ->whereDoesntHave('room')
                ->where('status_active', 1)
                ->whereHas('boardingBranch', fn($query) => $query->where('is_activated', 1))
                ->get(),
        ] : []);
    }
}
