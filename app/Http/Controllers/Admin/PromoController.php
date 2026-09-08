<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PromoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $promos = Promo::all();
        return inertia(
            'Admin/Promo/Index',
            [
                'promos' => $promos
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'image|mimes:jpeg,png,jpg',
        ], [
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Gambar harus memiliki format jpeg, png, jpg',
        ]);

        $foto = $request->file('image');
        $filename = time() . '.' . $foto->getClientOriginalExtension();
        $path = 'promo/' . $filename;
        Storage::disk('public')->put($path, file_get_contents($foto));

        $color = Promo::create([
            'image' => $path
        ]);

        if ($color) {
            return back()->with('success', 'Promo ditambahkan');
        } else {
            return back()->with('error', 'Promo gagal ditambahkan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'image' => 'image|mimes:jpeg,png,jpg',
        ], [
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Gambar harus memiliki format jpeg, png, jpg',
        ]);

        $promo = Promo::find($id);

        if (!$promo) {
            return back()->with('error', 'Promo tidak ditemukan');
        }

        if ($request->hasFile('image')) {
            if ($promo->image) {
                Storage::disk('public')->delete($promo->image);
            }

            $foto = $request->file('image');
            $filename = time() . '.' . $foto->getClientOriginalExtension();
            $path = 'promo/' . $filename;
            Storage::disk('public')->put($path, file_get_contents($foto));

            $promo->update(['image' => $path]);
        }
        return back()->with('success', 'Promo berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return back()->with('error', 'Promo tidak ditemukan');
        } else {
            if ($promo->image) {
                Storage::disk('public')->delete($promo->image);
            }
            $promo->delete();
            return back()->with('success', 'Promo di hapus');
        }
    }
}
