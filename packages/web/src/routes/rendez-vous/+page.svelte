<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types';

	import { getContextClient } from '@urql/svelte';
	import type { OperationResultStore } from '@urql/svelte';
	import { typedMutationStore } from '@notre-doc/graphql/urql-svelte';

	import { activateSnackbar } from '$lib/snackbar';

	export let form: ActionData;

	$: formStep = form?.step || 1;

	let client = getContextClient();

	let resultatCreation: OperationResultStore;

	interface PatientForm {
		nom: string;
		prenom: string;
		dateNaissance: string;
		email: string;
		telephone: string;
	}

	const createPatientBuilder = (vars: PatientForm) => {
		return {
			createPatient: {
				__args: {
					...vars
				},
				id: true
			}
		};
	};

	const executeCreatePatientMutation = typedMutationStore(client, createPatientBuilder);

	const createPatient = async (vars: PatientForm) => {
		resultatCreation = await executeCreatePatientMutation(vars);
	};

	let nomFocus = false;
	let prenomFocus = false;
	let dateNaissanceFocus = false;
	let emailFocus = false;
	let telephoneFocus = false;

	let loading = false;

	let inputClasses = 'field label border';
	let snackbarClass = 'snackbar error';
	let snackbarMessage = 'Échec.';

	/**
	 * this does something when the form submits.
	 * It can be used to validate data before submission.
	 * For example to see if the numero de secu is already taken.
	 */
	const handleEnhance: SubmitFunction = ({ action }) => {
		// this does something before the form submits.
		const { search } = action;
		loading = true;

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
					if (result.data && search === '?/final') {
						await createPatient(result.data.data as PatientForm);
						activateSnackbar('Succès !', 'success');
						await update();
					}

					if (search !== '?/final') {
						formStep++;
					}

					break;
				case 'failure':
				case 'error':
					activateSnackbar('Échec.', 'error');
					await update();
					break;
				default:
					await update();
			}
		};
	};

	function stepBack() {
		formStep = 1;
		emailFocus = true;
		telephoneFocus = true;
	}
</script>

<article class="fill">
	<h5 class="center-align">Prise de rendez-vous</h5>
	<p class="center-align">
		<small style="opacity:0.45"> Veuillez renseigner les champs suivants</small>
	</p>
	<form method="POST" use:enhance={handleEnhance} novalidate>
		<div style:display={formStep === 1 ? '' : 'none'}>
			<div class={inputClasses} class:invalid={form?.errors?.telephone && !telephoneFocus}>
				<input
					value={form?.data?.telephone ?? ''}
					name="telephone"
					type="tel"
					minlength={5}
					maxlength={18}
					disabled={loading}
					on:focus={() => (telephoneFocus = true)}
				/>
				<label for="telephone">Téléphone</label>
				<i>phone</i>
				{#if form?.errors?.telephone}
					<span class="error">
						{#if !telephoneFocus}
							{form?.errors?.telephone}
						{/if}
					</span>
				{/if}
			</div>
			<div class={inputClasses} class:invalid={form?.errors?.email && !emailFocus}>
				<input
					value={form?.data?.email ?? ''}
					name="email"
					type="email"
					disabled={loading}
					on:focus={() => (emailFocus = true)}
				/>
				<label for="email">E-mail</label>
				{#if form?.errors?.email}
					<span class="error">
						{#if !emailFocus}
							{form?.errors?.email}
						{/if}
					</span>
				{/if}
			</div>
			<div class="large-space" />
			<div class="small-space" />
			<nav>
				<div class="max" />
				<button class="right-align" formaction="?/step1">
					Suivant
					<i>arrow_forward</i>
				</button>
			</nav>
		</div>
		<div style:display={formStep === 2 ? '' : 'none'}>
			<div class={inputClasses} class:invalid={form?.errors?.nom && !nomFocus}>
				<input
					value={form?.data?.nom ?? ''}
					name="nom"
					type="text"
					disabled={loading}
					on:focus={() => (nomFocus = true)}
				/>
				<label for="nom">Nom</label>
				{#if form?.errors?.nom}
					<span class="error">
						{#if !nomFocus}
							{form?.errors?.nom}
						{/if}
					</span>
				{/if}
			</div>
			<div class={inputClasses} class:invalid={form?.errors?.prenom && !prenomFocus}>
				<input
					value={form?.data?.prenom ?? ''}
					name="prenom"
					type="text"
					disabled={loading}
					on:focus={() => (prenomFocus = true)}
				/>
				<label for="prenom">Prénom</label>
				{#if form?.errors?.prenom}
					<span class="error">
						{#if !prenomFocus}
							{form?.errors?.prenom}
						{/if}
					</span>
				{/if}
			</div>
			<div class={inputClasses} class:invalid={form?.errors?.dateNaissance && !dateNaissanceFocus}>
				<input
					value={form?.data?.dateNaissance ?? ''}
					name="dateNaissance"
					type="date"
					disabled={loading}
					on:focus={() => (dateNaissanceFocus = true)}
				/>
				<label for="dateNaissance">Date de naissance</label>
				<i>today</i>
				{#if form?.errors?.dateNaissance}
					<span class="error">
						{#if !dateNaissanceFocus}
							{form?.errors?.dateNaissance}
						{/if}
					</span>
				{/if}
			</div>
			<nav>
				<button type="button" class="circle transparent" on:click={stepBack}>
					<i>arrow_back</i>
				</button>
				<div class="max" />
				<button class="right-align" formaction="?/final" type="submit">
					Envoyer
					<i>send</i>
				</button>
			</nav>
		</div>
	</form>
</article>

<style>
</style>
