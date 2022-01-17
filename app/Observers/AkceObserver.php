<?php

namespace App\Observers;

use App\Akce;
use App\Update;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AkceObserver
{
    protected $request;

    public function __construct(Request $request, Response $response)
    {
        $this->request = $request;
        $this->response = $response;
    }

    /**
     * Handle the akce "created" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function created(Akce $akce)
    {
        $update = new Update();
        $update->akce_id = $this->request->id_akce;
        $update->user_id = $this->request->user_id;
        $update->type = 'created';
        $update->description = "test create";
        $update->created_at = now();
        $update->save();

    }

    /**
     * Handle the akce "updated" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function updated(Akce $akce)
    {
        $update = new Update();
        $update->akce_id = $this->request->id_akce;
        $update->user_id = $this->request->user_id;
        $update->type = 'updated';
        $update->description = json_encode($akce->getDirty());
        $update->created_at = now();
        $update->save();
        
        $akce["update_id"] = $update->id;
    }
    /**
     * Handle the akce "deleted" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function deleted(Akce $akce)
    {
        //
    }

    /**
     * Handle the akce "restored" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function restored(Akce $akce)
    {
        //
    }

    /**
     * Handle the akce "force deleted" event.
     *
     * @param  \App\Akce  $akce
     * @return void
     */
    public function forceDeleted(Akce $akce)
    {
        //
    }
}
