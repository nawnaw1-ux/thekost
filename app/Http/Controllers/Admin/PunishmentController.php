<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Punishment;
use Illuminate\Http\Request;

class PunishmentController extends Controller
{
    public function index()
    {
        $punishment = Punishment::first();
        return inertia(
            'Admin/Punishment/Index',
            [
                'punishment' => $punishment
            ]
        );
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'price' => 'required',
            'max_day' => 'required'
        ], [
            'price.required' => 'Denda wajib diisi',
            'max_day.required' => 'Maksimal hari wajib diisi'
        ]);

        // Temukan ContactCenter berdasarkan ID
        $punishment = Punishment::find($id);

        if (!$punishment) {
            return redirect()->back()->withErrors(['contact_center_not_found' => 'Contact Center tidak ditemukan']);
        }
        $punishment->update($validated);
        return redirect()->back()->with('success', 'Denda telah diperbarui!');
    }
}
