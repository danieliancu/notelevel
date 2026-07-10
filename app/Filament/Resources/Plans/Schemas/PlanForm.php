<?php

namespace App\Filament\Resources\Plans\Schemas;

use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PlanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('display_name')
                    ->required(),
                TextInput::make('price_cents')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('billing_interval')
                    ->default(null),
                TextInput::make('max_canvas_pages')
                    ->numeric()
                    ->default(null),
                TextInput::make('max_pdfs')
                    ->numeric()
                    ->default(null),
                TextInput::make('max_pdf_size_bytes')
                    ->label('Max PDF size (MB)')
                    ->helperText('Leave empty for unlimited.')
                    ->numeric()
                    ->step(0.1)
                    ->suffix('MB')
                    ->default(null)
                    ->afterStateHydrated(function (TextInput $component, $state) {
                        $component->state($state === null ? null : round($state / (1024 * 1024), 2));
                    })
                    ->dehydrateStateUsing(fn ($state) => ($state === null || $state === '') ? null : (int) round($state * 1024 * 1024)),
                Toggle::make('pdf_export_allowed')
                    ->label('PDF export allowed')
                    ->default(true),
                TextInput::make('max_favourites')
                    ->numeric()
                    ->default(null),
                TagsInput::make('ai_actions_allowed')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('ai_monthly_cost_cap_gbp')
                    ->label('AI monthly spend cap (£)')
                    ->helperText('Leave empty for unlimited.')
                    ->numeric()
                    ->step(0.01)
                    ->prefix('£')
                    ->default(null),
                Toggle::make('is_default')
                    ->required(),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
