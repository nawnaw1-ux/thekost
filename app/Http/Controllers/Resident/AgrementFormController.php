<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgrementFormController extends Controller
{
    public function index()
    {
        $configGoogleForm = config("app.link_google_form");
        return Inertia::render(
            'Resident/AgrementForm/Index',
            [
                'link_google_form' => $configGoogleForm
            ]
        );
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $user->agreed_kos_rules = true;
        $user->save();

        return redirect()->route('resident.dashboard.index'); // atau tujuan setelah login
    }
}
