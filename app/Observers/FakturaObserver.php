<?php

namespace App\Observers;

use App\Faktura;
use App\Update;
use Illuminate\Http\Request;

class FakturaObserver
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function saveEvent(Faktura $faktura, string $type)
    {
        $update = new Update();
        $update->akce_id = $this->request->akce_id;
        $update->user_id = $this->request->userId; // current user id
        $update->update_type = $type;
        $update->update_scope = "info";
        $update->description = json_encode($faktura->getDirty());
        $update->created_at = now();
        $update->save();

        $faktura["update_id"] = $update->id;
    }

    /**
     * Handle the akce "created" event.
     *
     * @param  \App\Faktura  $faktura
     * @return void
     */
    public function created(Faktura $faktura)
    {
        $this->saveEvent($faktura, 'created');
    }

    /**
     * Handle the akce "updated" event.
     *
     * @param  \App\Faktura  $faktura
     * @return void
     */
    public function updated(Faktura $faktura)
    {
        $this->saveEvent($faktura, 'updated');
    }
    /**
     * Handle the akce "deleted" event.
     *
     * @param  \App\Faktura  $faktura
     * @return void
     */
    public function deleted(Faktura $faktura)
    {
        $this->saveEvent($faktura, 'deleted');
    }

    /**
     * Handle the akce "restored" event.
     *
     * @param  \App\Faktura  $faktura
     * @return void
     */
    public function restored(Faktura $faktura)
    {
        $this->saveEvent($faktura, 'restored');
    }

    /**
     * Handle the akce "force deleted" event.
     *
     * @param  \App\Faktura  $faktura
     * @return void
     */
    public function forceDeleted(Faktura $faktura)
    {
        $this->saveEvent($faktura, 'force_deleted');
    }
}

