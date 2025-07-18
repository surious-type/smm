<?php

namespace App\Console\Commands;

use Database\Seeders\AdminSeeder;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Команда создаёт учетную запись администратора';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $seeder = new AdminSeeder();
        try {
            $seeder->run();
            $this->info('Admin user seeded successfully');
        } catch (QueryException $exception) {
            $this->error('An administrator account has already been created');
            $this->error($exception->getMessage());
        }
    }
}
