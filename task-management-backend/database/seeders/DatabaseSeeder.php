<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        // Create categories
        $categories = [
            ['name' => 'Work', 'color' => '#3B82F6'],
            ['name' => 'Personal', 'color' => '#EF4444'],
            ['name' => 'Study', 'color' => '#10B981'],
            ['name' => 'Health', 'color' => '#8B5CF6'],
        ];

        foreach ($categories as $categoryData) {
            Category::create([
                'user_id' => $user->id,
                'name' => $categoryData['name'],
                'color' => $categoryData['color'],
            ]);
        }

        // Create sample tasks
        $tasks = [
            [
                'title' => 'Complete Laravel project setup',
                'description' => 'Finish setting up the task management system with Sanctum authentication',
                'priority' => 'high',
                'status' => 'in_progress',
                'due_date' => now()->addDays(3),
            ],
            [
                'title' => 'Review Vue.js frontend code',
                'description' => 'Perform thorough code review of the Vue.js frontend components',
                'priority' => 'medium',
                'status' => 'pending',
                'due_date' => now()->addDays(1),
            ],
            [
                'title' => 'Write API documentation',
                'description' => 'Create comprehensive REST API documentation using Postman or similar',
                'priority' => 'low',
                'status' => 'pending',
                'due_date' => now()->addWeek(),
            ],
            [
                'title' => 'Deploy to production',
                'description' => 'Deploy the application to a production server using Docker',
                'priority' => 'high',
                'status' => 'pending',
                'due_date' => now()->addDays(7),
            ],
            [
                'title' => 'Setup CI/CD pipeline',
                'description' => 'Configure automated testing and deployment pipeline',
                'priority' => 'medium',
                'status' => 'completed',
                'due_date' => now()->subDays(2),
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create([
                'user_id' => $user->id,
                'title' => $taskData['title'],
                'description' => $taskData['description'],
                'priority' => $taskData['priority'],
                'status' => $taskData['status'],
                'due_date' => $taskData['due_date'],
            ]);
        }

        // Create another user for testing
        $user2 = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);

        // Create some tasks for the second user
        Task::create([
            'user_id' => $user2->id,
            'title' => 'Plan weekend trip',
            'description' => 'Research and plan a weekend getaway',
            'priority' => 'low',
            'status' => 'pending',
            'due_date' => now()->addDays(5),
        ]);
    }
}