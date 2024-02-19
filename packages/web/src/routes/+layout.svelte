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

<main>
	<h1 class="center-align">Notre Doc</h1>
	<slot />
</main>

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
</style>
