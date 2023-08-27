<script lang="ts">
	import Button from '@smui/button';
	import { Label, Icon } from '@smui/common';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import CircularProgress from '@smui/circular-progress';
	import IconButton from '@smui/icon-button';
	import Paper, { Title, Subtitle, Content } from '@smui/paper';

	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types';

	import toast from 'svelte-french-toast';

	import { getContextClient } from '@urql/svelte';
	import type { OperationResultStore } from '@urql/svelte';
	import { typedMutationStore } from '@notre-doc/graphql/urql-svelte';

	export let form: ActionData;

	$: formStep = form?.step || 1;
	$: formSoFar = form?.data || {
		nom: '',
		prenom: '',
		dateNaissance: '',
		email: '',
		telephone: ''
	};

	let nomFocus = false;
	let prenomFocus = false;
	let dateNaissanceFocus = false;
	let emailFocus = false;
	let telephoneFocus = false;

	let loading = false;

	let colorError = 'color : #b71c1c';

	/**
	 * this does something when the form submits.
	 * It can be used to validate data before submission.
	 * For example to see if the numero de secu is already taken.
	 */
	const handleEnhance: SubmitFunction = ({ formData, action }) => {
		console.log('               ');
		console.log('---------------');
		// this does something before the form submits.
		const { search } = action;
		loading = true;

		console.log('formStep in client before = ' + formStep);
		console.log(search);
		console.log('form in client before = ');
		console.log(form);
		console.log('Object.fromEntries(formData) in client before = ');
		console.log(Object.fromEntries(formData));

		nomFocus = false;
		prenomFocus = false;
		dateNaissanceFocus = false;
		emailFocus = false;
		telephoneFocus = false;

		return async ({ result, update }) => {
			// this does something after the form submits.
			loading = false;

			switch (result.type) {
				case 'success':
					console.log('A');
					if (result.data && search === '?/final') {
						console.log('B');
						formSoFar = {
							nom: '',
							prenom: '',
							dateNaissance: '',
							email: '',
							telephone: ''
						};

						toast.success('Succès !', {
							position: 'bottom-center',
							style: 'border: 1px solid #6299D2; padding: 16px; color: #6299D2;',
							iconTheme: {
								primary: '#32CD32',
								secondary: '#fff'
							}
						});

						await update();
						console.log('C');
					}

					if (search !== '?/final') {
						console.log('D');
						formSoFar = Object.fromEntries(formData);
						if (search.includes('back')) {
							nomFocus = true;
							prenomFocus = true;
							dateNaissanceFocus = true;
							emailFocus = true;
							telephoneFocus = true;
							console.log('E');
							formStep--;
						} else {
							formStep++;
							console.log('F');
						}
					}

					break;
				case 'failure':
				case 'error':
					formSoFar = Object.fromEntries(formData);
					console.log('G');

					toast.error('Échec.', {
						position: 'bottom-right',
						style: 'border: 1px solid #6299D2; padding: 16px; color: #6299D2;',
						iconTheme: {
							primary: '#A52A2A',
							secondary: '#fff'
						}
					});

					await update();

					break;
				default:
					await update();
			}

			console.log('form in client after= ');
			console.log(form);
			console.log('Object.fromEntries(formData) in client after = ');
			console.log(Object.fromEntries(formData));
		};
	};
</script>

<h1 class="centered">Notre Doc</h1>
<p>{formStep}</p>
<p>{nomFocus}</p>
<p>{prenomFocus}</p>
<p>{dateNaissanceFocus}</p>
<p>{telephoneFocus}</p>
<p>{emailFocus}</p>
<p>{JSON.stringify(form)}</p>

<form method="POST" use:enhance={handleEnhance} novalidate>
	<div style:display={formStep === 1 ? '' : 'none'}>
		<input name="telephone" value={form?.data?.telephone ?? ''} type="tel" />
		{#if form?.errors?.telephone}
			<p style={colorError}>
				{#if !telephoneFocus}
					{form?.errors?.telephone}
				{/if}
			</p>
		{/if}
		<p />
		<input name="email" value={form?.data?.email ?? ''} type="email" />
		{#if form?.errors?.email}
			<p style={colorError}>
				{#if !emailFocus}
					{form?.errors?.email}
				{/if}
			</p>
		{/if}
		<button formaction="?/step1">Suivant</button>
	</div>
	<div style:display={formStep === 2 ? '' : 'none'}>
		<input name="nom" value={form?.data?.nom ?? ''} type="text" />
		{#if form?.errors?.nom}
			<p style={colorError}>
				{#if !nomFocus}
					{form?.errors?.nom}
				{/if}
			</p>
		{/if}
		<input name="prenom" value={form?.data?.prenom ?? ''} type="text" />
		{#if form?.errors?.prenom}
			<p style={colorError}>
				{#if !prenomFocus}
					{form?.errors?.prenom}
				{/if}
			</p>
		{/if}
		<input name="dateNaissance" value={form?.data?.dateNaissance ?? ''} type="date" />
		{#if form?.errors?.dateNaissance}
			<p style={colorError}>
				{#if !dateNaissanceFocus}
					{form?.errors?.dateNaissance}
				{/if}
			</p>
		{/if}
		<button type="button" on:click={() => (formStep = 1)}>Retour</button>

		<button type="submit" formaction="?/final">Envoyer</button>
	</div>
</form>

<style>
	.columns {
		display: flex;
		flex-wrap: wrap;
	}

	.centered {
		display: flex;
		justify-content: center;
	}

	.right {
		float: right;
	}

	.left {
		float: left;
	}
	/* .valid {
		color: greenyellow;
	} */
</style>
