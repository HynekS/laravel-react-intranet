<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

use App\Update;

class UploadObserver
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function saveEvent(Model $model, string $type)
    {
        if ($type === "deleted") {
            $update = new Update();
            $update->akce_id = $this->request->projectId;
            $update->user_id = $this->request->userId;
        } else {
            $data = json_decode($this->request->data);
            $update = new Update();
            $update->akce_id = $data->projectId;
            $update->user_id = $data->userId;
        }

        $update->type = $type;
        $update->description = json_encode($model->getDirty());
        $update->created_at = now();
        $update->save();

        $model["update_id"] = $update->id;
    }

    /**
     * Handle the task "created" event.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function created(Model $model)
    {
        $this->saveEvent($model, 'created');
    }

    /**
     * Handle the task "updated" event.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function updated(Model $model)
    {
        $this->saveEvent($model, 'updated');
    }

    /**
     * Handle the task "deleted" event.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function deleted(Model $model)
    {
        $this->saveEvent($model, 'deleted');
    }

    /**
     * Handle the task "restored" event.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function restored(Model $model)
    {
        $this->saveEvent($model, 'restored');
    }

    /**
     * Handle the task "force deleted" event.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function forceDeleted(Model $model)
    {
        $this->saveEvent($model, 'forceDeleted');
    }
}
