<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { page } from '$app/stores';

	import { Toaster } from 'svelte-french-toast';

	import { tweened, type Tweened } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import { interpolateNumber } from 'd3-interpolate';

	import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

	initContextClient({
		url: import.meta.env.VITE_GRAPHQL_URL,
		exchanges: [cacheExchange, fetchExchange]
	});

	let topAppBar: TopAppBar;

	let barWidth = 1800;

	let maxTailleBoutons;

	function fillIcon(node: any, fillingIcon: Tweened<number>) {
		node.addEventListener('click', () => fillingIcon.set(1));
	}

	let icon = 'material-symbols-outlined';
	let fillDuration = 40;
	let tweenParams = {
		duration: fillDuration,
		easing: expoOut,
		interpolate: interpolateNumber
	};

	const fillingHome = tweened(0, tweenParams);
	const fillingRdv = tweened(0, tweenParams);
	const fillingAbout = tweened(0, tweenParams);
	const fillingAdmin = tweened(0, tweenParams);
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<div bind:clientWidth={barWidth}>
		<Row>
			<Section style="width:{barWidth / 3}px">
				<!-- <div style="display: flex; align-content:center;" use:fillIcon={fillingHeart}> -->
				<Icon class="red-icon {icon}" style="font-variation-settings: 'FILL' 1">favorite</Icon>
				<!-- </div> -->
				<Title tag="a" style="color:beige" align="middle" href="/">Notre Doc</Title>
			</Section>

			<Section style="width:{barWidth / 3}px; z-index:2;">
				<div style="display: flex; margin-left: auto; margin-right: auto; align-content:center;">
					<!-- This is used to fill the icon of the page we are on. -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						style="font-variation-settings: 'FILL' {$page.url.pathname === '/' ? $fillingHome : 0}"
						use:fillIcon={fillingHome}
					>
						{#if barWidth > 570}
							<Button tag="a" variant="unelevated" color="primary" href="/">
								<Icon class={icon}>home</Icon>
								<Label>Accueil</Label>
							</Button>
						{:else}
							<IconButton class={icon} color="secondary" href="/">home</IconButton>
						{/if}
					</div>

					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						style="font-variation-settings: 'FILL' 
						{$page.url.pathname === '/rendez-vous' ? $fillingRdv : 0}"
						use:fillIcon={fillingRdv}
						class="centeredContent"
					>
						{#if barWidth > 470}
							<div bind:clientWidth={maxTailleBoutons} style="z-index:2;">
								<Button
									tag="a"
									variant="raised"
									style="z-index:2;"
									color="secondary"
									href="/rendez-vous"
								>
									<Icon class={icon}>event</Icon>
									<Label>Rendez&#8209vous</Label>
								</Button>
							</div>
						{:else}
							<IconButton tag="a" class={icon} color="secondary" href="/rendez-vous"
								>event</IconButton
							>
						{/if}
					</div>
				</div>
			</Section>
			<Section style="width:{barWidth / 3}px; z-index:1;" align="end">
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					style="font-variation-settings: 'FILL' {$page.url.pathname === '/about'
						? $fillingAbout
						: 0}"
					use:fillIcon={fillingAbout}
				>
					{#if barWidth > 812}
						<Button tag="a" variant="unelevated" href="/about">
							<Icon class={icon}>help</Icon>
							<Label>À&nbsp;propos</Label>
						</Button>
					{:else}
						<IconButton class={icon} href="/about">help</IconButton>
					{/if}
				</div>
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					style="font-variation-settings: 'FILL' {$page.url.pathname === '/admin'
						? $fillingAdmin
						: 0}"
					use:fillIcon={fillingAdmin}
				>
					{#if barWidth > 712}
						<Button tag="a" variant="unelevated" href="/admin">
							<Icon class={icon}>key</Icon>
							<Label>Admin</Label>
						</Button>
					{:else}
						<IconButton tag="a" class={icon} href="/admin">key</IconButton>
					{/if}
				</div>
			</Section>
		</Row>
	</div>
</TopAppBar>

<AutoAdjust {topAppBar}>
	<slot />
</AutoAdjust>

<Toaster />

<style>
	/* Hide everything above this component. */
	:global(#smui-app),
	:global(body),
	:global(html) {
		display: block !important;
		height: auto !important;
		width: auto !important;
		position: static !important;
	}

	.centeredContent {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
