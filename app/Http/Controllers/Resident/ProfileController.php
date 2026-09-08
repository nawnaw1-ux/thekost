<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{

    public function index()
    {
        $auth = Auth::user();
        $resident = Resident::with('user')->where('user_id', $auth->id)->first();
        return inertia('Resident/Profile/Index', [
            'resident' => $resident
        ]);
    }
}
