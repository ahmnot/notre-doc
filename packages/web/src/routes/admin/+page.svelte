<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import { typedQueryStore } from '@notre-doc/graphql/urql-svelte';

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

<!-- <button
	on:click={() =>
		createPatient({
			nom: 'toto',
			prenom: 'tutu',
			dateNaissance: '1990-07-25',
			email: 'tototutu@gmail.com',
			telephone: '0610530496'
		})}>Create Patient</button
>

{#if $resultStore && $resultStore.fetching}
	<p>Loading...</p>
{:else if $resultStore && $resultStore.data}
	<p>Patient Created: {$resultStore.data.createPatient.id}</p>
{:else if $resultStore && $resultStore.error}
	<p>Error: {$resultStore.error.message}</p>
{/if} -->

{#if $patientsTQS.fetching}
	<p>Loading...</p>
{:else if $patientsTQS.error}
	<p>Oh no... {$patientsTQS.error.message}</p>
{:else if $patientsTQS.data && $patientsTQS.data.patients}
	<DataTable table$aria-label="Liste des patients" style="max-width: 100%;">
		<Head>
			<Row>
				<Cell>id</Cell>
				<Cell>Nom</Cell>
				<Cell>Prénom</Cell>
				<Cell>Date naissance</Cell>
				<Cell>E-mail</Cell>
				<Cell>Téléphone</Cell>
				<Cell>N° de sécu</Cell>
			</Row>
		</Head>
		<Body>
			{#each $patientsTQS.data.patients as patient}
				<Row>
					<Cell>{patient.id}</Cell>
					<Cell>{patient.nom}</Cell>
					<Cell>{patient.prenom}</Cell>
					<Cell>{patient.dateNaissance}</Cell>
					<Cell>{patient.email}</Cell>
					<Cell>{patient.telephone}</Cell>
					<Cell>{patient.numeroSecu}</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
{/if}

<style>
</style>
