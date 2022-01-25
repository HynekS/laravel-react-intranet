<?php

namespace App\Observers;

use App\Akce;
use App\Update;
use Illuminate\Http\Request;

class AkceObserver
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function saveEvent(Akce $akce, string $type)
    {
        $update = new Update();
        $update->akce_id = $this->request->id_akce;
        $update->user_id = $this->request->userId; // current user id
        $update->type = $type;
        $update->description = json_encode($akce->getDirty());
        $update->created_at = now();
        $update->save();

        $akce["update_id"] = $update->id;
    }

    /**
     * Handle the akce "created" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function created(Akce $akce)
    {
        $this->saveEvent($akce, 'created');
    }

    /**
     * Handle the akce "updated" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function updated(Akce $akce)
    {
        $this->saveEvent($akce, 'updated');
    }
    /**
     * Handle the akce "deleted" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function deleted(Akce $akce)
    {
        $this->saveEvent($akce, 'deleted');
    }

    /**
     * Handle the akce "restored" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function restored(Akce $akce)
    {
        $this->saveEvent($akce, 'restored');
    }

    /**
     * Handle the akce "force deleted" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function forceDeleted(Akce $akce)
    {
        $this->saveEvent($akce, 'force_deleted');
    }
}
