<?php

namespace App\Filament\Resources\Posts\Schemas;

use App\Services\SeoAnalyzer;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Post')
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('Content')
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function (string $context, $state, callable $set) {
                                        if ($context === 'create') {
                                            $set('slug', Str::slug($state));
                                        }
                                    }),
                                TextInput::make('slug')
                                    ->required()
                                    ->unique(ignoreRecord: true),
                                Textarea::make('excerpt')
                                    ->rows(2)
                                    ->columnSpanFull(),
                                RichEditor::make('body')
                                    ->required()
                                    ->columnSpanFull(),
                                FileUpload::make('cover_image_path')
                                    ->label('Cover image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('blog-covers'),
                                Select::make('status')
                                    ->options([
                                        'draft' => 'Draft',
                                        'published' => 'Published',
                                    ])
                                    ->required()
                                    ->default('draft'),
                                DateTimePicker::make('published_at'),
                                Select::make('user_id')
                                    ->label('Author')
                                    ->relationship('user', 'name')
                                    ->default(fn () => auth()->id())
                                    ->searchable(),
                                Select::make('categories')
                                    ->relationship('categories', 'name')
                                    ->multiple()
                                    ->preload(),
                                Select::make('tags')
                                    ->relationship('tags', 'name')
                                    ->multiple()
                                    ->preload(),
                            ])
                            ->columns(2),

                        Tab::make('SEO')
                            ->schema([
                                Placeholder::make('seo_score')
                                    ->label('SEO score')
                                    ->content(function ($record) {
                                        if (! $record || $record->seo_score === null) {
                                            return new HtmlString('<span style="color:#9ca3af">Save the post to calculate the SEO score.</span>');
                                        }

                                        $color = match (SeoAnalyzer::scoreColor($record->seo_score)) {
                                            'success' => '#16a34a',
                                            'warning' => '#d97706',
                                            'danger' => '#dc2626',
                                            default => '#9ca3af',
                                        };

                                        return new HtmlString(
                                            "<span style=\"font-weight:800;color:{$color}\">{$record->seo_score}/100</span>"
                                        );
                                    })
                                    ->columnSpanFull(),
                                TextInput::make('focus_keyword')
                                    ->helperText('The main phrase you want this post to rank for.'),
                                TextInput::make('meta_title')
                                    ->helperText('Ideal length: 50-60 characters. Falls back to the title if left empty.')
                                    ->maxLength(70),
                                Textarea::make('meta_description')
                                    ->rows(2)
                                    ->helperText('Ideal length: 120-155 characters.')
                                    ->maxLength(180)
                                    ->columnSpanFull(),
                                TextInput::make('canonical_url')
                                    ->url()
                                    ->helperText('Leave empty to use this post\'s own URL.')
                                    ->columnSpanFull(),
                                TextInput::make('og_title')
                                    ->label('Social share title')
                                    ->helperText('Falls back to the meta title, then the post title.'),
                                TextInput::make('og_description')
                                    ->label('Social share description')
                                    ->helperText('Falls back to the meta description, then the excerpt.'),
                                FileUpload::make('og_image_path')
                                    ->label('Social share image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('blog-og-images')
                                    ->helperText('Falls back to the cover image.'),
                                Toggle::make('noindex')
                                    ->label('Hide from search engines (noindex)')
                                    ->columnSpanFull(),
                            ])
                            ->columns(2),
                    ]),
            ]);
    }
}
