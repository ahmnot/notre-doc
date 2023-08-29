<script lang="ts">
	import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte';
	import { page } from '$app/stores';
	import { snackbar } from '$lib/snackbar';

	initContextClient({
		url: import.meta.env.VITE_GRAPHQL_URL,
		exchanges: [cacheExchange, fetchExchange]
	});
</script>

<header class="fill">
	<nav>
		<a class="circle transparent" href="/">
			<i class="primary-text" class:fill={$page.url.pathname === '/'}>favorite</i>
		</a>
		<!-- <h5 class="center-align">Notre Doc</h5> -->
		<div class="max" />
		<div class="max center-align">
			<a href="/rendez-vous"
				><button class="small-elevate"
					><i class:fill={$page.url.pathname === '/rendez-vous'}>event</i><span
						>Prendre rendez-vous</span
					></button
				></a
			>
		</div>
		<div class="max" />
		<a class="circle" href="/admin">
			<i class="primary-text" class:fill={$page.url.pathname === '/admin'}>key</i>
		</a>
	</nav>
</header>

<h1 class="center-align">Notre Doc</h1>

<slot />

<div
	class="snackbar"
	class:error={$snackbar.type === 'error'}
	class:green={$snackbar.type !== 'error'}
	class:primary={$snackbar.type !== 'error'}
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
