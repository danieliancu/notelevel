<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                Select::make('role')
                    ->options([
                        'user' => 'User',
                        'guest' => 'Guest',
                        'admin' => 'Admin',
                    ])
                    ->required()
                    ->default('user'),
                Select::make('plan_id')
                    ->relationship('plan', 'name')
                    ->default(null),
                TextInput::make('max_canvas_pages_override')
                    ->numeric()
                    ->default(null),
                TextInput::make('max_pdfs_override')
                    ->numeric()
                    ->default(null),
                TextInput::make('ai_monthly_cost_cap_gbp_override')
                    ->label('AI monthly spend cap override (£)')
                    ->numeric()
                    ->step(0.01)
                    ->prefix('£')
                    ->default(null),
                DateTimePicker::make('ai_usage_reset_at'),
            ]);
    }
}
