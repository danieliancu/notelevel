<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CanvasAiController;
use App\Http\Controllers\CanvasApiController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FavouriteController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\MarketingController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\PdfFolderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/health/ready', [HealthController::class, 'ready'])
    ->middleware('throttle:30,1')
    ->name('health.ready');

Route::domain(config('domains.marketing'))->group(function () {
    // Marketing, SEO-first, indexable.
    Route::get('/', [MarketingController::class, 'home'])->name('home');

    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/blog/category/{category:slug}', [BlogController::class, 'category'])->name('blog.category');
    Route::get('/blog/tag/{tag:slug}', [BlogController::class, 'tag'])->name('blog.tag');
    Route::get('/blog/{post:slug}', [BlogController::class, 'show'])->name('blog.show');

    Route::get('/privacy', [LegalController::class, 'privacy'])->name('privacy');
    Route::get('/terms', [LegalController::class, 'terms'])->name('terms');
    Route::get('/cookies', [LegalController::class, 'cookies'])->name('cookies');

    Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

    Route::get('/robots.txt', function () {
        return response("User-agent: *\nAllow: /\n\nSitemap: ".route('sitemap')."\n")
            ->header('Content-Type', 'text/plain');
    });

    require __DIR__.'/auth.php';

    // Everything below used to live on a separate app.notelevel.com subdomain;
    // it's now consolidated onto the single domain, kept out of search results
    // via the `noindex` middleware instead of a domain-level split.
    Route::middleware(['noindex'])->group(function () {
        Route::get('/demo', [DemoController::class, 'show'])->name('demo');
        Route::get('/demo/register', [DemoController::class, 'bounceToRegister'])->name('demo.register');

        Route::middleware('auth')->group(function () {
            Route::get('/dashboard', function () {
                return view('canvas.show', ['isDemo' => false]);
            })->name('dashboard');
        });

        Route::middleware('auth')->group(function () {
            Route::get('/account', [AccountController::class, 'index'])->name('account');
            Route::get('/account/summary', [AccountController::class, 'summary'])->name('account.summary');

            Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

            Route::resource('folders', FolderController::class)->only(['store', 'update', 'destroy']);
            Route::resource('pdf-folders', PdfFolderController::class)->only(['store', 'destroy']);
            Route::resource('favourites', FavouriteController::class)->only(['index', 'store', 'destroy']);
            Route::resource('pdfs', PdfController::class)->only(['index', 'store', 'destroy']);
            Route::patch('pdfs/{pdf}/page-order', [PdfController::class, 'updatePageOrder']);

            Route::resource('documents', DocumentController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::patch('documents/{document}/rename', [DocumentController::class, 'rename']);
            Route::post('documents/{document}/duplicate', [DocumentController::class, 'duplicate']);
            Route::patch('documents/{document}/move', [DocumentController::class, 'move']);
            Route::post('documents/{document}/autosave', [DocumentController::class, 'autosave']);

            // Legacy compatibility: GET is strictly read-only; mutations remain CSRF-protected POSTs.
            Route::get('/canvas/api', [CanvasApiController::class, 'handleRead'])->middleware('legacy.deprecated');
            Route::post('/canvas/api', [CanvasApiController::class, 'handle'])->middleware('legacy.deprecated');
            Route::post('/canvas/ai', [CanvasAiController::class, 'handle'])->middleware('throttle:ai');

            // Admin (Filament) mounted here in a later step.
        });
    });
});
