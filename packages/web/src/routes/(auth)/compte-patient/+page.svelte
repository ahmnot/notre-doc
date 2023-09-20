<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import type { SubmitFunction } from '@sveltejs/kit';
	import { clickoutside } from '@svelte-put/clickoutside';

	import { activateSnackbar } from '$lib/snackbar';

	import { typedQueryStore, typedMutation } from '@notre-doc/graphql/urql-svelte';

	import { getContextClient } from '@urql/svelte';

	import { fly, slide } from 'svelte/transition';
	import { ulid } from 'ulid';

	let loading = false;

	let client = getContextClient();

	let patientsMock: PatientFullForm[] = [
		{
			id: ulid(),
			nom: 'Titi',
			prenom: 'Tata',
			dateNaissance: '1999-06-21',
			email: 'titi-toto@gmail.com',
			telephone: '0606323232',
			numeroSecu: '154072A44809794'
		},
		{
			id: ulid(),
			nom: 'Toto',
			prenom: 'Tutu',
			dateNaissance: '2003-12-21',
			email: 'toto-tutu@hotmail.fr',
			telephone: '0665323240',
			numeroSecu: '125107969899450'
		},
		{
			id: ulid(),
			nom: 'Antoine',
			prenom: 'Pichard',
			dateNaissance: '1956-12-01',
			email: 'antoinepichard@yahoo.fr',
			telephone: '004964523240',
			numeroSecu: '183102A27593049'
		}
	];

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
						await typedMutation(client, deletePatientBuilder, { id: result.data.data.id }).then(
							(result) => {
								if (result.error) {
									activateSnackbar('Échec de la suppression.', 'error');
									console.error(result.error);
								} else {
									activateSnackbar('Patient supprimé.', 'success');
								}
							}
						);

						await update();
					}
					break;
				case 'failure':
				case 'error':
					console.error(result);
					activateSnackbar('Échec de la suppression.', 'error');
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
						).then((resultat) => {
							if (resultat.error) {
								activateSnackbar('Échec de la modification.', 'error');
								console.error(resultat.error);
							} else {
								activateSnackbar('Patient modifié.', 'success');
							}
						});

						await update();
					}
					break;
				case 'failure':
				case 'error':
					console.error(result);
					activateSnackbar('Échec de la modification.', 'error');

					await update();
					break;
				default:
					await update();
			}
		};
	};

	let patientUpdating: PatientFullForm = {
		id: '',
		nom: '',
		prenom: '',
		dateNaissance: '',
		email: '',
		telephone: '',
		numeroSecu: ''
	};
	let isDialogActive = false;

	function convertPatientGenql(patientGenql: any): PatientFullForm {
		return {
			id: patientGenql.id,
			nom: patientGenql.nom,
			prenom: patientGenql.prenom,
			dateNaissance: patientGenql.dateNaissance,
			email: patientGenql.email,
			telephone: patientGenql.telephone,
			numeroSecu: patientGenql.numeroSecu
		};
	}

	function openEdit(patient: PatientFullForm) {
		patientUpdating = patient;
		isDialogActive = true;
	}
</script>

<div class="small-space" />

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
								on:click|stopPropagation={() => openEdit(convertPatientGenql(patient))}
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
<div class="small-space" />

<dialog
	class="right"
	class:active={isDialogActive}
	use:clickoutside={{ event: 'mousedown' }}
	on:clickoutside|stopPropagation={() => (isDialogActive = false)}
>
	<h5>Édition Patient</h5>
	<small style="opacity:0.45">id : {patientUpdating.id}</small>
	<form method="POST" use:enhance={updateEnhance} novalidate>
		<input value={patientUpdating.id} name="id" style:display="none" />
		<div class={inputClasses} class:invalid={form?.errors?.nom && !nomFocus}>
			<input
				value={patientUpdating.nom}
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
				value={patientUpdating.prenom}
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
				value={patientUpdating.dateNaissance}
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
		<div class={inputClasses} class:invalid={form?.errors?.telephone && !telephoneFocus}>
			<input
				value={patientUpdating.telephone}
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
				value={patientUpdating.email}
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
		<div class={inputClasses} class:invalid={form?.errors?.numeroSecu && !numeroSecuFocus}>
			<input
				value={patientUpdating.numeroSecu}
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

<footer>
	<form method="POST" action="?/logout">
		<button class="secondary-container absolute right">
			Déconnexion
			<i>logout</i>
		</button>
	</form>
</footer>

<style>
</style>
