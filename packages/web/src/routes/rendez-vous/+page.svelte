<script lang="ts">
	import Button from '@smui/button';
	import { Label, Icon } from '@smui/common';
	import CharacterCounter from '@smui/textfield/character-counter';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import CircularProgress from '@smui/circular-progress';

	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types';

	import toast from 'svelte-french-toast';

	import { getContextClient } from '@urql/svelte';
	import type { OperationResultStore } from '@urql/svelte';
	import { typedMutationStore } from '@notre-doc/graphql/urql-svelte';

	let client = getContextClient();

	let resultStore: OperationResultStore;

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
		resultStore = await executeCreatePatientMutation(vars);
	};


	export let form: ActionData;

	let loading = false;

	let nomFocus = false;
	let prenomFocus = false;
	let dateNaissanceFocus = false;
	let emailFocus = false;
	let telephoneFocus = false;

	let colorError = 'color : #b71c1c';


	/**
	 * this does something when the form submits.
	 * It can be used to validate data before submission.
	 * For example to see if the numero de secu is already taken.
	 */
	const submitPatient: SubmitFunction = (input) => {
		// this does something before the form submits.
		loading = true;

		return async ({ result, update }) => {
			// this does something after the form submits.
			loading = false;

			switch (result.type) {
				case 'success':
					if (result.data) {
						await createPatient(result.data.data as PatientForm);

						toast.success('Succès !', {
							position: 'bottom-center',
							style: 'border: 1px solid #6299D2; padding: 16px; color: #6299D2;',
							iconTheme: {
								primary: '#A52A2A',
								secondary: '#fff'
							}
						});
					}

					await update();
					break;
				case 'failure':
				case 'error':
					nomFocus = false;
					prenomFocus = false;
					dateNaissanceFocus = false;
					emailFocus = false;
					telephoneFocus = false;

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
		};
	};
</script>

<h1 class="centered">Notre Doc</h1>

<form
	class="centered"
	method="POST"
	action="?/submitPatient"
	use:enhance={submitPatient}
	novalidate
>
	<div class="conteneurForm">
		<div class="columns">
			<div>
				<Textfield
					value={form?.data?.nom ?? ''}
					label="Nom"
					input$name="nom"
					disabled={loading}
					on:focus={() => (nomFocus = true)}
				>
					<svelte:fragment slot="helper">
						{#if form?.errors?.nom}
							<HelperText persistent style={colorError}>
								{#if !nomFocus}
									{form?.errors?.nom}
								{/if}
							</HelperText>
						{:else}
							<HelperText>Nom de naissance</HelperText>
						{/if}
					</svelte:fragment>
				</Textfield>
			</div>
		</div>

		<div class="columns">
			<div>
				<Textfield
					value={form?.data?.prenom ?? ''}
					label="Prénom"
					input$name="prenom"
					disabled={loading}
					on:focus={() => (prenomFocus = true)}
				>
					<svelte:fragment slot="helper">
						{#if form?.errors?.prenom}
							<HelperText persistent style={colorError}>
								{#if !prenomFocus}
									{form?.errors?.prenom}
								{/if}
							</HelperText>
						{:else}
							<HelperText />
						{/if}
					</svelte:fragment>
				</Textfield>
			</div>
		</div>

		<div class="columns">
			<div style="width: 182px">
				<Textfield
					value={form?.data?.dateNaissance ?? ''}
					label="Date de naissance"
					input$name="dateNaissance"
					style="width: 100%"
					helperLine$style="width: 100%"
					type="date"
					disabled={loading}
					on:focus={() => (dateNaissanceFocus = true)}
				>
					<svelte:fragment slot="helper">
						{#if form?.errors?.dateNaissance}
							<HelperText persistent style={colorError}>
								{#if !dateNaissanceFocus}
									{form?.errors?.dateNaissance}
								{/if}
							</HelperText>
						{:else}
							<HelperText />
						{/if}
					</svelte:fragment>
				</Textfield>
			</div>
		</div>

		<div class="columns">
			<div>
				<Textfield
					value={form?.data?.email ?? ''}
					label="E-mail"
					input$name="email"
					type="email"
					disabled={loading}
					on:focus={() => (emailFocus = true)}
				>
					<svelte:fragment slot="helper">
						{#if form?.errors?.email}
							<HelperText persistent style={colorError}>
								{#if !emailFocus}
									{form?.errors?.email}
								{/if}
							</HelperText>
						{:else}
							<HelperText />
						{/if}
					</svelte:fragment>
				</Textfield>
			</div>
		</div>

		<div class="columns">
			<div>
				<Textfield
					value={form?.data?.telephone ?? ''}
					label="Téléphone"
					input$name="telephone"
					input$maxlength={10}
					disabled={loading}
					type="tel"
					on:focus={() => (telephoneFocus = true)}
				>
					<svelte:fragment slot="helper">
						{#if form?.errors?.telephone}
							<HelperText persistent style={colorError}>
								{#if !telephoneFocus}
									{form?.errors?.telephone}
								{/if}
							</HelperText>
							<CharacterCounter>0/10</CharacterCounter>
						{:else}
							<CharacterCounter>0/10</CharacterCounter>
						{/if}
					</svelte:fragment>
				</Textfield>
			</div>
		</div>
		&nbsp;
		<span class="centered">
			<Button
				type="submit"
				variant="raised"
				formaction="?/submitPatient"
				aria-busy={loading}
				color="secondary"
				style="display: flex; justify-content: stretch;"
			>
				{#if !loading}
					<Icon
						class="material-symbols-outlined"
						style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 40"
						>send</Icon
					>
					<Label>Envoyer</Label>
				{:else}
					<CircularProgress
						class="my-colored-circle"
						style="height: 24px; width: 92.15px;"
						indeterminate
					/>
				{/if}
			</Button>
		</span>
	</div>
</form>

<br />

<style>
	.columns {
		display: flex;
		flex-wrap: wrap;
	}

	.centered {
		display: flex;
		justify-content: center;
	}

	/* .valid {
		color: greenyellow;
	} */
</style>
