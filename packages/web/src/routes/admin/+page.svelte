<script lang="ts">
	import { fly, slide } from 'svelte/transition';

	import { enhance } from '$app/forms';

	import { typedQueryStore } from '@notre-doc/graphql/urql-svelte';

	import { getContextClient } from '@urql/svelte';

	const patientsTQS = typedQueryStore({
		client: getContextClient(),
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

							<form method="POST" action="?/deletePatient" use:enhance>
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

<style>
</style>
