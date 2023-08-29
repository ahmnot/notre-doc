<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import type { SubmitFunction } from '@sveltejs/kit';
	import { clickoutside } from '@svelte-put/clickoutside';

	import {
		typedQueryStore,
		typedMutationStore,
		typedMutation
	} from '@notre-doc/graphql/urql-svelte';

	import { getContextClient } from '@urql/svelte';

	import { fly, slide } from 'svelte/transition';

	let classDialog = 'right';

	let loading = false;

	let client = getContextClient();

	export let form: ActionData;

	interface IdForm {
		id: string;
	}

	interface PatientFullForm {
		id: string;
		nom: string;
		prenom: string;
		dateNaissance: string;
		email: string;
		telephone: string;
		numeroSecu: string;
	}

	const deletePatientBuilder = (vars: IdForm) => {
		return {
			deletePatient: {
				__args: {
					...vars
				},
				id: true
			}
		};
	};

	const updatePatientBuilder = (vars: PatientFullForm) => {
		return {
			updatePatient: {
				__args: {
					...vars
				},
				id: true
			}
		};
	};

	const patientsTQS = typedQueryStore({
		client: client,
		query: {
			patients: {
				id: true,
				nom: true,
				prenom: true,
				dateNaissance: true,
				email: true,
				telephone: true,
				numeroSecu: true
			}
		}
	});

	let inputClasses = 'field label border';
	let snackbarClass = 'snackbar error';
	let snackbarMessage = 'Échec.';

	let nomFocus = false;
	let prenomFocus = false;
	let dateNaissanceFocus = false;
	let emailFocus = false;
	let telephoneFocus = false;
	let numeroSecuFocus = false;

	const deleteEnhance: SubmitFunction = ({}) => {
		loading = true;

		return async ({ result, update }) => {
			// this does something after the form submits.
			loading = false;
			switch (result.type) {
				case 'success':
					if (result.data) {
						await typedMutation(client, deletePatientBuilder, { id: result.data.id }).then(
							(result) => {
								if (result.error) {
									snackbarClass = 'snackbar error active';
									snackbarMessage = 'Échec de la suppression.';
									console.error(result.error);
								} else {
									snackbarClass = 'snackbar success primary active';
									snackbarMessage = 'Patient supprimé.';
								}
							}
						);

						await update();
					}
					break;
				case 'failure':
				case 'error':
					snackbarClass = 'snackbar error active';
					snackbarMessage = 'Échec de la suppression.';

					await update();
					break;
				default:
					await update();
			}
		};
	};

	const updateEnhance: SubmitFunction = ({}) => {
		loading = true;

		nomFocus = false;
		prenomFocus = false;
		dateNaissanceFocus = false;
		emailFocus = false;
		telephoneFocus = false;
		numeroSecuFocus = false;

		return async ({ result, update }) => {
			// this does something after the form submits.
			loading = false;
			switch (result.type) {
				case 'success':
					if (result.data) {
						await typedMutation(
							client,
							updatePatientBuilder,
							result.data.data as PatientFullForm
						).then((result) => {
							if (result.error) {
								snackbarClass = 'snackbar error active';
								snackbarMessage = 'Échec de la mise à jour.';
								console.error(result.error);
							} else {
								snackbarClass = 'snackbar success primary active';
								snackbarMessage = 'Patient mis à jour.';
							}
						});

						await update();
					}
					break;
				case 'failure':
				case 'error':
					snackbarClass = 'snackbar error active';
					snackbarMessage = 'Échec de la mise à jour.';

					await update();
					break;
				default:
					await update();
			}
		};
	};

	let idPatientUpdating = '';

	function openEdit(patientID: string) {
		idPatientUpdating = patientID;
		toggleDialog();
	}

	function toggleDialog() {
		classDialog.includes('active')
			? (classDialog = classDialog.replace(' active', ''))
			: (classDialog += ' active');
	}
</script>

<div>&nbsp;</div>

{#if $patientsTQS.fetching}
	<p>Loading...</p>
{:else if $patientsTQS.error}
	<p>Oh no... {$patientsTQS.error.message}</p>
{:else if $patientsTQS.data && $patientsTQS.data.patients}
	<table class="border" aria-label="Liste des patients">
		<thead>
			<tr>
				<th />
				<th>id</th>
				<th>Nom</th>
				<th>Prénom</th>
				<th>Date naissance</th>
				<th>E-mail</th>
				<th>Téléphone</th>
				<th>N° sécu</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each $patientsTQS.data.patients as patient}
				<tr in:fly={{ y: 20 }} out:slide>
					<td>
						<label class="checkbox">
							<input type="checkbox" />
							<span />
						</label>
					</td>
					<td>{patient.id}</td>
					<td>{patient.nom}</td>
					<td>{patient.prenom}</td>
					<td>{patient.dateNaissance}</td>
					<td>{patient.email}</td>
					<td>{patient.telephone}</td>
					<td>{patient.numeroSecu}</td>
					<td>
						<nav class="right-align">
							<button
								class="circle transparent"
								on:click|stopPropagation={() => openEdit(patient.id)}
							>
								<i>edit</i>
							</button>

							<form method="POST" action="?/deletePatient" use:enhance={deleteEnhance}>
								<button class="circle transparent" on:click|stopPropagation>
									<i>delete</i>
								</button>
								<input type="hidden" name="id" value={patient.id} />
							</form>
						</nav>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<dialog
	class={classDialog}
	use:clickoutside
	on:clickoutside|stopPropagation={() => (classDialog = classDialog.replace(' active', ''))}
>
	<h5>Édition Patient</h5>
	<small style="opacity:0.45">id : {idPatientUpdating}</small>
	<form method="POST" use:enhance={updateEnhance} novalidate>
		<input value={idPatientUpdating} name="id" style:display="none" />
		<div class={form?.errors?.nom && !nomFocus ? inputClasses + ' invalid' : inputClasses}>
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
		<div class={form?.errors?.prenom && !prenomFocus ? inputClasses + ' invalid' : inputClasses}>
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
		<div
			class={form?.errors?.dateNaissance && !dateNaissanceFocus
				? inputClasses + ' invalid'
				: inputClasses}
		>
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
		<div
			class={form?.errors?.telephone && !telephoneFocus ? inputClasses + ' invalid' : inputClasses}
		>
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
		<div class={form?.errors?.email && !emailFocus ? inputClasses + ' invalid' : inputClasses}>
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
		<div
			class={form?.errors?.numeroSecu && !numeroSecuFocus
				? inputClasses + ' invalid'
				: inputClasses}
		>
			<input
				value={form?.data?.numeroSecu ?? ''}
				name="numeroSecu"
				type="number"
				minlength={15}
				maxlength={15}
				disabled={loading}
				on:focus={() => (numeroSecuFocus = true)}
			/>
			<label for="numeroSecu">N° sécu</label>
			{#if form?.errors?.numeroSecu}
				<span class="error">
					{#if !numeroSecuFocus}
						{form?.errors?.numeroSecu}
					{/if}
				</span>
			{/if}
		</div>

		<nav>
			<div class="max" />
			<button class="right-align" formaction="?/updatePatient" type="submit">
				Envoyer
				<i>send</i>
			</button>
		</nav>
	</form>
</dialog>

<div class={snackbarClass}>{snackbarMessage}</div>

<style>
</style>
