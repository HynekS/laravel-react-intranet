<?php

namespace App\Http\Controllers;

use App\Faktura;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public $rules = [
        'castka' => 'required|numeric',
        'c_faktury' => 'required|numeric',
        'typ_castky' => 'required|in:"0","1"',
    ];

    public function store(Request $request)
    {
        $request->validate($this->rules);
        $invoice = Faktura::create($request->all());
        $invoice->save();
        $update_id = $invoice->update_id;
        
        $record = $invoice->refresh();
        $record->update_id = $update_id;

        return $record;
    }

    public function update(Request $request, $id)
    {
        $request->validate($this->rules);
        $invoice = Faktura::find($id);
        $invoice->update([
            'castka' => (int) $request->castka,
            'c_faktury' => (int) $request->c_faktury,
            'typ_castky' => (int) $request->typ_castky
        ]);
        return $invoice;
    }

    public function delete($id)
    {
        $invoice = Faktura::find($id);
        $invoice->delete();
        return $invoice;
    }
}
