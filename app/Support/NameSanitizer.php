<?php

namespace App\Support;

class NameSanitizer
{
    public static function name(string $name, string $fallbackPrefix = 'untitled'): string
    {
        $name = trim($name);
        $name = preg_replace('/\.[a-z0-9]+$/i', '', $name) ?? '';
        $name = preg_replace('/[:*?"<>|\x00-\x1F]+/', ' ', $name) ?? '';
        $name = preg_replace('/\s+/', ' ', $name) ?? '';
        $name = trim($name, " .\t\n\r\0\x0B");

        if ($name === '') {
            $name = $fallbackPrefix.'-'.now()->format('Y-m-d-H-i-s');
        }

        return substr($name, 0, 80);
    }
}
