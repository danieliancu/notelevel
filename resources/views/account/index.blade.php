<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Account') }}
        </h2>
    </x-slot>

    @php
        $planName = $user->plan?->display_name ?? 'Free';
        $planSlug = $user->plan?->name ?? 'free';
        $isPremium = $planSlug === 'premium';

        $costPct = $costCap ? min(100, round(($costThisMonth / max($costCap, 0.0001)) * 100)) : null;
        $pagesPct = $pagesCap ? min(100, round(($pagesUsed / max($pagesCap, 1)) * 100)) : null;
        $pdfsPct = $pdfsCap ? min(100, round(($pdfsUsed / max($pdfsCap, 1)) * 100)) : null;

        $barColor = function (?int $pct) {
            if ($pct === null) return 'bg-emerald-500';
            if ($pct >= 100) return 'bg-red-500';
            if ($pct >= 80) return 'bg-amber-500';
            return 'bg-indigo-500';
        };
    @endphp

    <div class="py-10">
        <div class="max-w-[800px] mx-auto sm:px-6 lg:px-8 space-y-8">

            @if(session('status'))
                <div class="rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium px-4 py-3">
                    {{ session('status') }}
                </div>
            @endif

            <div class="flex justify-end">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
                        Sign out
                    </button>
                </form>
            </div>

            {{-- Top row: account details + plan --}}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="sm:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Account details</h3>
                    <div class="flex items-center gap-4">
                        <div class="h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
                            {{ strtoupper(substr($user->name, 0, 1)) }}
                        </div>
                        <div>
                            <div class="text-lg font-semibold text-gray-900">{{ $user->name }}</div>
                            <div class="text-sm text-gray-500">{{ $user->email }}</div>
                        </div>
                    </div>
                    <dl class="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt class="text-gray-400">Member since</dt>
                            <dd class="text-gray-800 font-medium">{{ $user->created_at->format('d M Y') }}</dd>
                        </div>
                        <div>
                            <dt class="text-gray-400">Role</dt>
                            <dd class="text-gray-800 font-medium capitalize">{{ $user->role }}</dd>
                        </div>
                    </dl>

                    <div class="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                        @if(!$isPremium)
                            <a href="{{ route('profile.edit') }}"
                                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                Update Account
                            </a>
                        @endif

                        <x-danger-button
                            type="button"
                            x-data=""
                            x-on:click.prevent="$dispatch('open-modal', 'confirm-account-deletion')"
                        >
                            Delete Account
                        </x-danger-button>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current plan</h3>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            {{ $isPremium ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600' }}">
                            {{ $planName }}
                        </span>
                    </div>
                    <p class="text-3xl font-bold text-gray-900">
                        @if($user->plan && $user->plan->price_cents > 0)
                            {{ $planPrice['symbol'] }}{{ number_format($planPrice['amount'], 2) }}<span class="text-base font-normal text-gray-400">/{{ $user->plan->billing_interval }}</span>
                        @else
                            {{ $planPrice['symbol'] }}0
                        @endif
                    </p>
                    <div class="mt-4 flex-1"></div>
                    @if(!$isPremium)
                        <form method="POST" action="{{ route('billing.checkout') }}">
                            @csrf
                            <button type="submit"
                                class="w-full inline-flex justify-center items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition">
                                Upgrade to Premium
                            </button>
                        </form>
                    @else
                        <div class="text-xs text-gray-400 text-center">Thank you for being Premium.</div>
                    @endif
                </div>
            </div>

            {{-- AI usage --}}
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-1">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">AI usage this month</h3>
                    <span class="text-xs text-gray-400">Resets {{ $user->nextAiUsageResetAt()->format('d M') }}</span>
                </div>

                <div class="mt-3">
                    @if($costCap === null)
                        <div class="flex items-end justify-between mb-1.5">
                            <span class="text-2xl font-bold text-gray-900">Unlimited</span>
                        </div>
                        <div class="w-full h-2.5 rounded-full bg-emerald-500"></div>
                    @else
                        <div class="flex items-end justify-between mb-1.5">
                            <span class="text-2xl font-bold text-gray-900">{{ number_format($tokensUsed) }}</span>
                            <span class="text-sm text-gray-400">tokens used</span>
                        </div>
                        <div class="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                            <div class="h-full rounded-full {{ $barColor($costPct) }} transition-all"
                                 style="width: {{ $costPct ?? 6 }}%"></div>
                        </div>
                        @if($costPct !== null && $costPct >= 80)
                            <p class="mt-2 text-xs {{ $costPct >= 100 ? 'text-red-600' : 'text-amber-600' }} font-medium">
                                {{ $costPct >= 100 ? 'You have reached your monthly usage limit.' : 'You are approaching your monthly usage limit.' }}
                            </p>
                        @endif
                    @endif
                </div>

                <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    @foreach(['translate' => 'Translate', 'chat' => 'AI Chat', 'read' => 'Read aloud'] as $action => $label)
                        @php $row = $usageByAction->get($action); @endphp
                        <div class="rounded-xl bg-gray-50 border border-gray-100 p-4">
                            <div class="text-xs text-gray-400 uppercase tracking-wide">{{ $label }}</div>
                            <div class="mt-1 text-xl font-semibold text-gray-900">{{ $row->calls ?? 0 }}</div>
                            <div class="text-xs text-gray-400">{{ number_format($row->tokens ?? 0) }} tokens</div>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Canvas / PDF quota --}}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Canvas pages</h3>
                    <div class="flex items-end justify-between mb-1.5">
                        <span class="text-2xl font-bold text-gray-900">{{ $pagesUsed }}</span>
                        <span class="text-sm text-gray-400">{{ $pagesCap ? 'of '.$pagesCap : 'unlimited' }}</span>
                    </div>
                    <div class="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full rounded-full {{ $barColor($pagesPct) }}" style="width: {{ $pagesPct ?? 6 }}%"></div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Imported PDFs</h3>
                    <div class="flex items-end justify-between mb-1.5">
                        <span class="text-2xl font-bold text-gray-900">{{ $pdfsUsed }}</span>
                        <span class="text-sm text-gray-400">{{ $pdfsCap ? 'of '.$pdfsCap : 'unlimited' }}</span>
                    </div>
                    <div class="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full rounded-full {{ $barColor($pdfsPct) }}" style="width: {{ $pdfsPct ?? 6 }}%"></div>
                    </div>
                    @if($pdfSizeCapBytes)
                        <p class="mt-2 text-xs text-gray-400">Max {{ round($pdfSizeCapBytes / (1024 * 1024), 1) }}MB per file</p>
                    @endif
                </div>
            </div>

        </div>
    </div>

    <x-modal name="confirm-account-deletion" :show="$errors->userDeletion->isNotEmpty()" focusable>
        <form method="post" action="{{ route('profile.destroy') }}" class="p-6">
            @csrf
            @method('delete')

            <h2 class="text-lg font-medium text-gray-900">
                {{ __('Are you sure you want to delete your account?') }}
            </h2>

            <p class="mt-1 text-sm text-gray-600">
                {{ __('Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.') }}
            </p>

            <div class="mt-6">
                <x-input-label for="password" value="{{ __('Password') }}" class="sr-only" />

                <x-text-input
                    id="password"
                    name="password"
                    type="password"
                    class="mt-1 block w-3/4"
                    placeholder="{{ __('Password') }}"
                />

                <x-input-error :messages="$errors->userDeletion->get('password')" class="mt-2" />
            </div>

            <div class="mt-6 flex justify-end">
                <x-secondary-button x-on:click="$dispatch('close')">
                    {{ __('Cancel') }}
                </x-secondary-button>

                <x-danger-button class="ms-3">
                    {{ __('Delete Account') }}
                </x-danger-button>
            </div>
        </form>
    </x-modal>
</x-app-layout>
