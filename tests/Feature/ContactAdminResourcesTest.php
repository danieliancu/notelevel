<?php

namespace Tests\Feature;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use App\Filament\Resources\ContactMessages\Pages\ListContactMessages;
use App\Filament\Resources\NewsletterSubscribers\Pages\ListNewsletterSubscribers;
use App\Filament\Widgets\DashboardStats;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ContactAdminResourcesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_contact_messages_list(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        ContactMessage::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'phone' => '0712345678',
            'message' => 'Interested in a school plan.',
        ]);

        $this->actingAs($admin);

        Livewire::test(ListContactMessages::class)
            ->assertOk()
            ->assertCanSeeTableRecords(ContactMessage::all());
    }

    public function test_admin_can_view_newsletter_subscribers_list(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        NewsletterSubscriber::create(['email' => 'reader@example.com']);

        $this->actingAs($admin);

        Livewire::test(ListNewsletterSubscribers::class)
            ->assertOk()
            ->assertCanSeeTableRecords(NewsletterSubscriber::all());
    }

    public function test_non_admin_cannot_access_contact_messages_route(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)
            ->get('/admin/contact-messages')
            ->assertForbidden();
    }

    public function test_non_admin_cannot_access_newsletter_subscribers_route(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)
            ->get('/admin/newsletter-subscribers')
            ->assertForbidden();
    }

    public function test_contact_messages_navigation_badge_reflects_count(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $this->assertSame('0', ContactMessageResource::getNavigationBadge());

        ContactMessage::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
        ]);
        ContactMessage::create([
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'john@example.com',
        ]);

        $this->assertSame('2', ContactMessageResource::getNavigationBadge());
        $this->assertSame('danger', ContactMessageResource::getNavigationBadgeColor());
    }

    public function test_dashboard_shows_newsletter_subscriber_count(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        NewsletterSubscriber::create(['email' => 'reader1@example.com']);
        NewsletterSubscriber::create(['email' => 'reader2@example.com']);

        Livewire::test(DashboardStats::class)
            ->assertOk()
            ->assertSee('Newsletter subscribers')
            ->assertSee('2');
    }
}
