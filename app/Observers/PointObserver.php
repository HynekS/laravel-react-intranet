<?php

namespace App\Observers;

use App\Point;
use App\Update;
use Illuminate\Http\Request;

class PointObserver
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function saveEvent(Point $point, string $type)
    {
        $update = new Update();
        $update->akce_id = $this->request->akce_id;
        $update->user_id = $this->request->userId; // current user id
        $update->update_type = $type;
        $update->update_scope = "point";
        $update->description = json_encode($point->getDirty());
        $update->created_at = now();
        $update->save();

        $point["update_id"] = $update->id;
    }

    /**
     * Handle the akce "created" event.
     *
     * @param  \App\Point  $point
     * @return void
     */
    public function created(Point $point)
    {
        $this->saveEvent($point, 'created');
    }

    /**
     * Handle the akce "updated" event.
     *
     * @param  \App\Point  $point
     * @return void
     */
    public function updated(Point $point)
    {
        $this->saveEvent($point, 'updated');
    }
    /**
     * Handle the akce "deleted" event.
     *
     * @param  \App\Point  $point
     * @return void
     */
    public function deleted(Point $point)
    {
        $this->saveEvent($point, 'deleted');
    }

    /**
     * Handle the akce "restored" event.
     *
     * @param  \App\Point  $point
     * @return void
     */
    public function restored(Point $point)
    {
        $this->saveEvent($point, 'restored');
    }

    /**
     * Handle the akce "force deleted" event.
     *
     * @param  \App\Point  $point
     * @return void
     */
    public function forceDeleted(Point $point)
    {
        $this->saveEvent($point, 'force_deleted');
    }
}
