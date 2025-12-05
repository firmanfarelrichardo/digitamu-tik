<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default Admin
        User::create([
            'name' => 'Kepala UPA TIK',
            'email' => 'admin@tik.unila.ac.id',
            'nip' => '198501012010011001',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create sample Staff
        User::create([
            'name' => 'Staff Front Office',
            'email' => 'staff@tik.unila.ac.id',
            'nip' => '199001012015011001',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Teknisi Jaringan',
            'email' => 'teknisi@tik.unila.ac.id',
            'nip' => '199203032018011001',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        // Seed kunjungan data
        $this->call(KunjunganSeeder::class);
    }
}
