<script lang="ts">


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
						await createPatient(result.data.data as PatientForm);

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

<div class="centered">
	<Paper style="width: 940px; height: 600px;">
		<Title>Prise de rendez-vous</Title>
		<Subtitle><small style="opacity:0.45">Veuillez renseigner les champs suivants.</small></Subtitle
		>
		<Content>
			<form method="POST" 
			use:enhance={handleEnhance} 
			novalidate>
				<div>
					<div style:display={formStep === 1 ? '' : 'none'}>
						<div class="columns">
							<div>
								<Textfield
									value={form?.data?.telephone ?? ''}
									label="Téléphone"
									input$name="telephone"
									input$maxlength={18}
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

						<div>&nbsp;</div>

						<span class="right">
							<Button
								formaction="?/step1"
								variant="raised"
								color="secondary"
								style="display: flex; justify-content: stretch;"
							>
								{#if !loading}
									<Label>Suivant</Label>
									<Icon
										class="material-symbols-outlined"
										style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 40"
										>arrow_forward</Icon
									>
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

					<div style:display={formStep === 2 ? '' : 'none'}>
						<div class="columns">
							<div>
								<Textfield
									value={form?.data?.nom ?? ''}
									label="Nom"
									input$name="nom"
									disabled={loading}
									on:focusin={() => (nomFocus = true)}
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
									on:focusin={() => (prenomFocus = true)}
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
									on:focusin={() => (dateNaissanceFocus = true)}
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

						<div>&nbsp;</div>

						<div>
							<span class="left">
								<IconButton
									type="button"
									variant="outlined"
									color="secondary"
									style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 40"
									class="material-symbols-outlined"
									size="button"
									touch
									on:click={() => (formStep = 1)}
								>
									arrow_back
								</IconButton>
							</span>
							<span class="right">
								<Button
									formaction="?/final"
									type="submit"
									variant="raised"
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
					</div>
				</div>
			</form>
		</Content>
	</Paper>
</div>

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
