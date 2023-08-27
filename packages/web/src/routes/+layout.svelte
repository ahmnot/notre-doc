<script lang="ts">
	import { Toaster } from 'svelte-french-toast';

	import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

	initContextClient({
		url: import.meta.env.VITE_GRAPHQL_URL,
		exchanges: [cacheExchange, fetchExchange]
	});

	let barWidth = 1800;
</script>

<header class="fill">
	<nav bind:clientWidth={barWidth}>
		<a class="circle transparent" href="/">
			<i class="primary-text">favorite</i>
		</a>
		<div class="max center-align">
			<a href="/rendez-vous"
				><button class="small-elevate"><i>event</i><span>Prendre rendez-vous</span></button></a
			>
		</div>
		<a class="circle transparent" href="/admin">
			<i class="primary-text">key</i>
		</a>
	</nav>
</header>

<h1 class="center-align">Notre Doc</h1>

<slot />

<Toaster />

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
