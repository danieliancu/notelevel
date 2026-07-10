<?php

namespace App\Http\Controllers;

use App\Services\SitemapService;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(SitemapService $sitemap): Response
    {
        return response($sitemap->cached(), 200)->header('Content-Type', 'text/xml');
    }
}
