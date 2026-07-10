<?php

namespace App\Services;

use App\Models\Post;

class SeoAnalyzer
{
    /**
     * @return array{score: int, checks: array<string, bool>}
     */
    public function analyze(Post $post): array
    {
        $keyword = trim((string) $post->focus_keyword);
        $title = (string) $post->title;
        $slug = (string) $post->slug;
        $metaTitle = (string) ($post->meta_title ?: $post->title);
        $metaDescription = (string) $post->meta_description;
        $bodyHtml = (string) $post->body;
        $bodyText = trim(strip_tags($bodyHtml));
        $wordCount = $bodyText === '' ? 0 : str_word_count($bodyText);
        $firstWords = implode(' ', array_slice(preg_split('/\s+/', $bodyText) ?: [], 0, 100));

        $checks = [
            'focus_keyword_set' => $keyword !== '',
            'keyword_in_title' => $keyword !== '' && $this->contains($title, $keyword),
            'keyword_in_slug' => $keyword !== '' && $this->contains(str_replace(['-', '_'], ' ', $slug), $keyword),
            'keyword_in_meta_description' => $keyword !== '' && $this->contains($metaDescription, $keyword),
            'keyword_in_intro' => $keyword !== '' && $this->contains($firstWords, $keyword),
            'keyword_density_ok' => $keyword !== '' && $this->keywordDensityOk($bodyText, $keyword, $wordCount),
            'meta_title_length_ok' => $this->between(mb_strlen($metaTitle), 40, 65),
            'meta_description_length_ok' => $this->between(mb_strlen($metaDescription), 100, 160),
            'content_length_ok' => $wordCount >= 300,
            'has_subheading' => (bool) preg_match('/<h[23][ >]/i', $bodyHtml),
            'has_image_with_alt' => (bool) preg_match('/<img[^>]+alt=["\'][^"\']+["\']/i', $bodyHtml),
            'has_outbound_link' => (bool) preg_match('/<a[^>]+href=["\']https?:\/\//i', $bodyHtml),
        ];

        $weights = [
            'keyword_in_title' => 15,
            'keyword_in_slug' => 10,
            'keyword_in_meta_description' => 10,
            'keyword_in_intro' => 10,
            'keyword_density_ok' => 10,
            'meta_title_length_ok' => 10,
            'meta_description_length_ok' => 10,
            'content_length_ok' => 10,
            'has_subheading' => 5,
            'has_image_with_alt' => 5,
            'has_outbound_link' => 5,
        ];

        $score = 0;
        foreach ($weights as $key => $weight) {
            if ($checks[$key]) {
                $score += $weight;
            }
        }

        return [
            'score' => $score,
            'checks' => $checks,
        ];
    }

    public static function scoreColor(?int $score): string
    {
        return match (true) {
            $score === null => 'gray',
            $score >= 80 => 'success',
            $score >= 50 => 'warning',
            default => 'danger',
        };
    }

    private function contains(string $haystack, string $needle): bool
    {
        return $needle !== '' && mb_stripos($haystack, $needle) !== false;
    }

    private function between(int $value, int $min, int $max): bool
    {
        return $value >= $min && $value <= $max;
    }

    private function keywordDensityOk(string $bodyText, string $keyword, int $wordCount): bool
    {
        if ($wordCount === 0) {
            return false;
        }

        $occurrences = substr_count(mb_strtolower($bodyText), mb_strtolower($keyword));
        $density = ($occurrences / $wordCount) * 100;

        return $density >= 0.3 && $density <= 3.0;
    }
}
