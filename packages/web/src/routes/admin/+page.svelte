<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import {
		typedQueryStore,
		typedMutationStore,
		typedMutation
	} from '@notre-doc/graphql/urql-svelte';

	import { getContextClient } from '@urql/svelte';

	import { fly, slide } from 'svelte/transition';

	let loading = false;

	let client = getContextClient();

	interface IdForm {
		id: string;
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

	let snackbarClass = 'snackbar error';
	let snackbarMessage = 'Échec.';

	const enhanceDelete: SubmitFunction = ({}) => {
		loading = true;

		return async ({ result, update }) => {
			// this does something after the form submits.
			loading = false;
			switch (result.type) {
				case 'success':
					if (result.data) {
						await typedMutation(client, deletePatientBuilder, 
						{ id: result.data.id }).then(
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
							<a>
								<i>edit</i>
							</a>

							<form method="POST" action="?/deletePatient" use:enhance={enhanceDelete}>
								<button class="circle transparent">
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

<div class={snackbarClass}>{snackbarMessage}</div>

<style>
</style>
