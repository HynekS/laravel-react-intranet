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
        // The types are not properly casted when using $request->all()
        // However, they are casted when saving into DB (strings->numbers, timestamp)
        // refresh() metod retrieves saved, properly casted record  from DB
        $record = $invoice->refresh();
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

    public function destroy($id)
    {
        $invoice = Faktura::find($id);
        $invoice->delete();
        return $invoice;
    }
}
