<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

	import {
		initContextClient,
		cacheExchange,
		fetchExchange,
		getContextClient
	} from '@urql/svelte';
	

	import type { OperationResultStore } from '@urql/svelte';
	import { typedMutationStore, typedQueryStore } from '@notre-doc/graphql/urql-svelte';

	initContextClient({
		url: import.meta.env.VITE_GRAPHQL_URL,
		exchanges: [cacheExchange, fetchExchange]
	});

	let client = getContextClient();

	const patientsTQS = typedQueryStore({
		client: getContextClient(),
		query: {
			patients: {
				id: true,
				email: true,
				numeroSecu: true
			}
		}
	});

	let resultStore: OperationResultStore;

	interface PatientForm {
		email: string;
		numeroSecu: string;
	}

	const createPatientBuilder = (vars: PatientForm) => {
		return {
			createPatient: {
				__args: {
					...vars
				},
				id: true,
				email: true,
				numeroSecu: true
			}
		};
	};

	const executeCreatePatientMutation = typedMutationStore(client, createPatientBuilder);

	const createPatient = async (email: string, numeroSecu: string) => {
		resultStore = await executeCreatePatientMutation({ email, numeroSecu });
	};

</script>

<div>&nbsp;</div>

<button on:click={() => createPatient('tototatatutu@gmail.com', '666666666666666')}>Create Patient</button>
{#if $resultStore && $resultStore.fetching}
	<p>Loading...</p>
{:else if $resultStore && $resultStore.data}
	<p>Patient Created: {$resultStore.data.createPatient.email}</p>
{:else if $resultStore && $resultStore.error}
	<p>Error: {$resultStore.error.message}</p>
{/if}

{#if $patientsTQS.fetching}
	<p>Loading...</p>
{:else if $patientsTQS.error}
	<p>Oh no... {$patientsTQS.error.message}</p>
{:else if $patientsTQS.data && $patientsTQS.data.patients}
	<DataTable table$aria-label="Liste des patients" style="max-width: 100%;">
		<Head>
			<Row>
				<Cell>id</Cell>
				<!-- <Cell>Nom</Cell>
			<Cell>Prénom</Cell>
			<Cell>Date de naissance</Cell> -->
				<Cell>E-mail</Cell>
				<Cell>Numéro de sécurité sociale</Cell>
			</Row>
		</Head>
		<Body>
			{#each $patientsTQS.data.patients as patient}
				<Row>
					<Cell>{patient.id}</Cell>
					<!-- <Cell>{patient.nom}</Cell>
				<Cell>{patient.prenom}</Cell>
				<Cell>{patient.dateNaissance}</Cell> -->
					<Cell>{patient.email}</Cell>
					<Cell>{patient.numeroSecu}</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
{/if}

<style>
</style>
