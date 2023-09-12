<script lang="ts">
	import { Amplify } from "aws-amplify";
	import config from "../config";

	import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte';
	import { page } from '$app/stores';
	import { snackbar } from '$lib/snackbar';

	Amplify.configure({
		Auth: {
			mandatorySignIn: true,
			region: config.cognito.REGION,
			userPoolId: config.cognito.USER_POOL_ID,
			identityPoolId: config.cognito.IDENTITY_POOL_ID,
			userPoolWebClientId: config.cognito.APP_CLIENT_ID
		},
		API: {
			endpoints: [
				{
					name: 'graphql',
					endpoint: config.apiGateway.URL,
					region: config.apiGateway.REGION
				}
			]
		}
	});

	initContextClient({
		url: import.meta.env.VITE_GRAPHQL_URL,
		exchanges: [cacheExchange, fetchExchange]
	});
</script>

<header class="fill">
	<nav>
		<a class="circle transparent" href="/">
			<i class="primary-text" title="Accueil" class:fill={$page.url.pathname === '/'}>favorite</i>
		</a>
		<!-- <h5 class="center-align">Notre Doc</h5> -->
		<div class="max" />
		<div class="max center-align">
			<a href="/rendez-vous">
				<button class="small-elevate primary-container" title="Prendre rendez-vous"
					><i class:fill={$page.url.pathname === '/rendez-vous'}>event</i><span class="large-text"
						>Prendre rendez-vous</span
					></button
				>
			</a>
		</div>
		<div class="max" />
		<a class="circle" title="Administration" href="/admin">
			<i class="primary-text" class:fill={$page.url.pathname === '/admin'}>key</i>
		</a>
	</nav>
</header>

<main>
	<h1 class="center-align">Notre Doc</h1>
	<nav>
		<div class="max l" />
		<slot />
		<div class="max l" />
	</nav>
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
