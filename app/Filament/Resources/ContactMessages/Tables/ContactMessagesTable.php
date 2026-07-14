<?php

namespace App\Filament\Resources\ContactMessages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ContactMessagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('first_name')
                    ->label('First name')
                    ->searchable(),
                TextColumn::make('last_name')
                    ->label('Last name')
                    ->searchable(),
                TextColumn::make('email')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('phone')
                    ->placeholder('—'),
                TextColumn::make('message')
                    ->placeholder('—')
                    ->wrap()
                    ->limit(200),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
