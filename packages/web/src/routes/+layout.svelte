<script lang="ts">
	import { page } from '$app/stores';
	import { snackbar } from '$lib/snackbar';
	import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

	let innerWidth = 0;
	let innerHeight = 0;

	initContextClient({
		url: import.meta.env.VITE_GRAPHQL_URL,
		exchanges: [cacheExchange, fetchExchange]
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<header class="fill">
	<nav>
		<a class="circle transparent" href="/">
			<i class="primary-text" title="Accueil" class:fill={$page.url.pathname === '/'}>favorite</i>
		</a>

		<div class="absolute middle center">
			<a href="/rendez-vous">
				<button class="small-elevate primary-container" title="Prendre rendez-vous"
					><i class:fill={$page.url.pathname === '/rendez-vous'}>event</i>
					
					{#if innerWidth > 400}
					<span class="large-text">
						{#if innerWidth > 510}
							Prendre rendez-vous
						{:else if innerWidth > 400}
							Prendre rdv
						{/if}
					</span>
					{/if}
					</button
				>
			</a>
		</div>

		<a class="absolute middle right" href="/compte-patient">
			<button class="secondary-container" title="Connexion">
				<i class:fill={$page.url.pathname === '/compte-patient'}>account_circle</i>
				{#if innerWidth > 580}
					<span class="large-text">
						{#if !$page.data.userId}
							Connexion
						{:else}
							Compte patient
						{/if}
					</span>
				{/if}
			</button>
		</a>
	</nav>
</header>

<main >
	<h1 class="center-align">Notre Doc</h1>
	<slot />
</main>

<footer>
	<div class="background-pattern"></div>
</footer>

<div
	class="snackbar"
	class:error={$snackbar.type === 'error'}
	class:green={$snackbar.type === 'success'}
	class:primary={$snackbar.type === 'primary'}
	class:active={$snackbar.active}
>
	{$snackbar.message}
</div>

<style>
	/* Hide everything above this component. */
	:global(body),
	:global(html) {
		display: block !important;
		height: auto !important;
		width: auto !important;
		position: static !important;
	}

	footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		z-index: -1;
	}

	.background-pattern::before {
    content: "";
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: 
        radial-gradient(circle at right, transparent, white 25%),
		linear-gradient(to top, transparent, white);
    z-index: 1;
  }

  .background-pattern::after {
    content: "";
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    z-index: 0;

    --s: 40px;
    --_c: #0000 75%,#cde7ed 0;
    --_g1: conic-gradient(at 10% 50%,var(--_c));
    --_g2: conic-gradient(at 50% 10%,var(--_c));
    background:
        var(--_g1),
        var(--_g1) calc(1*var(--s)) calc(3*var(--s)),
        var(--_g1) calc(2*var(--s)) calc(1*var(--s)),
        var(--_g1) calc(3*var(--s)) calc(4*var(--s)),
        var(--_g1) calc(4*var(--s)) calc(2*var(--s)),
        var(--_g2) 0                calc(4*var(--s)),
        var(--_g2) calc(1*var(--s)) calc(2*var(--s)),
        var(--_g2) calc(2*var(--s)) 0,
        var(--_g2) calc(3*var(--s)) calc(3*var(--s)),
        var(--_g2) calc(4*var(--s)) calc(1*var(--s)),
        #ffffff;
    background-size: calc(5*var(--s)) calc(5*var(--s));
  }


</style>
