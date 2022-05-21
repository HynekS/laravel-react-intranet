<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Eloquent::unguard();

        $dir = env("PATH_TO_DB_DUMPS");

        if (!(new \FilesystemIterator($dir))->valid()) dd("Error: No database dumps found!");

        $fileData = collect();

        $files = new DirectoryIterator($dir);
        foreach ($files as $fileinfo) {
            if (!$fileinfo->isDot()) {
                $fileData->push([
                    'filename' => $fileinfo->getFilename(),
                    'extension' => $fileinfo->getExtension(),
                    'mtime' => $fileinfo->getMTime()
                ]);
            }
        }

        $newest = $fileData->sortByDesc('mtime')->first();

        if (!in_array($newest["extension"], ["sql", "gz"])) dd("Error: Can handle only .sql or .gz files.");

        $final_path = ($newest["extension"] === "gz") ? gzdecode(file_get_contents($dir . "/" . $newest["filename"])) : file_get_contents($dir . "/" . $newest["filename"]);
        
        DB::unprepared($final_path);

        $this->command->info('DB was succesfully seeded!');
    }
}
