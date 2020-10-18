<?php

namespace App\Http\Controllers;

use App\Faktura;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'castka' => 'required|numeric',
            'c_faktury' => 'required|numeric',
            'typ_castky' => 'required|in:"0","1"',
        ]);
        $invoice = Faktura::find($id);
        $invoice->update([
            'castka' => $request->castka,
            'c_faktury' => $request->c_faktury,
            'typ_castky' => (int) $request->typ_castky
        ]);
        return $invoice;
    }
    
    public function destroy($id)
    {
        //
    }
}
