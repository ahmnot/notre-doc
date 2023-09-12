<script lang="ts">
	import { Auth } from 'aws-amplify';

	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { activateSnackbar } from '$lib/snackbar';

	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;

	let inputClasses = 'field label border large-margin';

	let formStep = 2;

	let emailOrPhone = 'e-mail';

	let transitionType = 'right';

	let passwordOrText = 'password';
	let eyeIcon = 'visibility';

	$: passwordOrText = eyeIcon === 'visibility' ? 'password' : 'text';

	let telephonemailFocus = false;
	let telephonemail2Focus = false;
	let passwordFocus = false;
	let genreFocus = false;
	let nomFocus = false;
	let prenomFocus = false;
	let dateNaissanceFocus = false;
	let emailFocus = false;
	let telephoneFocus = false;
	let chosenPasswordFocus = false;
	let fournumberscodeFocus = false;

	let isAccountKnown = true;

	let chosenPassword: FormDataEntryValue;

	$: chosenPassword = form?.data?.chosenPassword ?? '';

	let isChosenPasswordOk = false;

	$: isChosenPasswordOk =
		hasMinuscule && hasMajuscule && hasChiffre && hasSpecialCharacter && hasTwelveCharacter;

	let hasMinuscule = false;
	let hasMajuscule = false;
	let hasChiffre = false;
	let hasSpecialCharacter = false;
	let hasTwelveCharacter = false;

	const handleChosenPasswordInput = (event: any) => {
		const input = event.target.value;
		hasMinuscule = /[a-z]+/.test(input);
		hasMajuscule = /[A-Z]+/.test(input);
		hasChiffre = /\d/.test(input);
		hasSpecialCharacter = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(input);
		hasTwelveCharacter = input.length >= 12;
	};

	function checkAccountKnown() {
		if (isAccountKnown) {
			stepForward();
		} else {
			choseStep(3);
		}
	}

	function choseStep(goingTo: number) {
		const comingFrom = parseInt(form?.data?.step as string);
		if (goingTo + 1 === comingFrom) {
			transitionType = 'left';
		} else if (goingTo > comingFrom) {
			transitionType = 'right';
		} else {
			transitionType = '';
		}
		resetFocus(true);
		formStep = goingTo;
	}

	function stepBack() {
		resetFocus(true);
		transitionType = 'left';
		formStep--;
	}

	function stepForward() {
		resetFocus(true);
		transitionType = 'right';
		formStep++;
	}

	function resetFocus(isNotHere: boolean) {
		telephonemailFocus = isNotHere;
		telephonemail2Focus = isNotHere;
		passwordFocus = isNotHere;
		genreFocus = isNotHere;
		nomFocus = isNotHere;
		prenomFocus = isNotHere;
		dateNaissanceFocus = isNotHere;
		emailFocus = isNotHere;
		telephoneFocus = isNotHere;
		chosenPasswordFocus = isNotHere;
		fournumberscodeFocus = isNotHere;
	}

	/**
	 * this does something when the form submits.
	 */
	const createAccountEnhance: SubmitFunction = ({ action }) => {
		// this does something before the form submits.
		const { search } = action;
		loading = true;

		return async ({ result, update }) => {
			// this does something after the form submits.
			resetFocus(false);
			loading = false;

			switch (result.type) {
				case 'success':
					if (result.data && search === '?/connexion') {
						try {
							await Auth.signIn(result.data.data.telephonemail2, result.data.data.password);
							alert('Logged in');
						} catch (error) {
							console.error(error);
							if (error instanceof Error) {
								alert(error.message);
							} else {
								alert(String(error));
							}
						}
						break;
					}

					if (result.data && search === '?/step6') {
						// await createPatient(result.data.data as PatientForm);
						activateSnackbar('Succès !', 'success');
						await update();
					}

					switch (search) {
						case '?/step1':
							checkAccountKnown();
							break;

						case '?/step2':
							stepForward();
							break;

						case '?/step3':
							stepForward();
							break;

						case '?/step4':
							stepForward();
							break;

						case '?/step5':
							stepForward();
							break;

						default:
							break;
					}

					break;
				case 'failure':
				case 'error':
					console.error(result);
					activateSnackbar('Échec.', 'error');
					await update();
					break;
				default:
					await update();
			}
		};
	};
</script>

<article class="max fill">
	<h4 class="center-align">Prendre rendez-vous</h4>
	<form method="POST" use:enhance={createAccountEnhance} novalidate>
		<input name="step" type="number" style:display="none" bind:value={formStep} />
		<div class="page" class:active={formStep === 1}>
			<div
				class={inputClasses + ' max'}
				class:invalid={form?.errors?.telephonemail && !telephonemailFocus}
			>
				<input
					value={form?.data?.telephonemail ?? ''}
					id="telephonemail"
					name="telephonemail"
					type="text"
					disabled={loading}
					on:focus={() => (telephonemailFocus = true)}
				/>
				<label for="telephonemail">Saisissez votre adresse e-mail ou n° de téléphone</label>
				{#if form?.errors?.telephonemail}
					<span class="error">
						{#if !telephonemailFocus}
							{form?.errors?.telephonemail}
						{/if}
					</span>
				{/if}
			</div>
			<nav>
				<div class="max" />
				<button formaction="?/step1" class="right-align">
					Suivant
					<i>arrow_forward</i>
				</button>
			</nav>
		</div>
		<div class="page {transitionType}" class:active={formStep === 2}>
			<h6 class="h6-margin-top center-align">Vous avez déjà un compte ?</h6>
			<div
				class={inputClasses}
				class:invalid={form?.errors?.telephonemail2 && !telephonemail2Focus}
			>
				<input
					value={form?.data?.telephonemail ?? form?.data?.telephonemail2 ?? ''}
					id="telephonemail2"
					name="telephonemail2"
					type="text"
					disabled={loading}
					on:focus={() => (telephonemail2Focus = true)}
				/>
				<label for="telephonemail2">Adresse e-mail ou n° de téléphone</label>
				{#if form?.errors?.telephonemail2}
					<span class="error">
						{#if !telephonemail2Focus}
							{form?.errors?.telephonemail2}
						{/if}
					</span>
				{/if}
			</div>
			<div class={inputClasses + ''} class:invalid={form?.errors?.password && !passwordFocus}>
				<input
					value={form?.data?.password ?? ''}
					id="password"
					name="password"
					type={passwordOrText}
					disabled={loading}
					on:focus={() => (passwordFocus = true)}
				/>
				<label for="password">Mot de passe</label>
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a
					type="button"
					href=""
					aria-label="show-password"
					on:mousedown={() => (eyeIcon = 'visibility_off')}
					on:mouseup={() => (eyeIcon = 'visibility')}
				>
					<i class="front">{eyeIcon}</i>
				</a>
				{#if form?.errors?.password}
					<span class="error">
						{#if !passwordFocus}
							{form?.errors?.password}
						{/if}
					</span>
				{/if}
			</div>
			<label class="checkbox large-margin no-margin-top">
				<input name="rememberMe" type="checkbox" />
				<span>Se souvenir de moi</span>
			</label>
			<button formaction="?/connexion" class="responsive"><p class="large-text">Connexion</p></button>
			<p class="center-align">
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a class="link" href="">Code confidentiel oublié ?</a>
			</p>
			<h6 class="center-align">Première visite ?</h6>
			<button formaction="?/step2" class="responsive primary-container"
				><p class="large-text">Créer un compte</p>
			</button>
			<div class="small-space" />
		</div>
		<div class="page h6-margin-top" class:active={formStep >= 3}>
			<nav class="scroll" style:display={formStep >= 3 ? '' : 'none'}>
				<button type="button" class="circle small" on:click={() => choseStep(3)} disabled={false}
					>1</button
				>
				<div class="max divider" />

				<button
					type="button"
					class="circle small"
					on:click={() => choseStep(4)}
					disabled={formStep < 4}>2</button
				>
				<div class="max divider" />
				<button
					type="button"
					class="circle small"
					on:click={() => choseStep(5)}
					disabled={formStep < 5}>3</button
				>
				<div class="max divider" />
				<button
					type="button"
					class="circle small"
					on:click={() => choseStep(6)}
					disabled={formStep < 6}>4</button
				>
			</nav>
			<div class="page h6-margin-top {transitionType}" class:active={formStep === 3}>
				<h6 class="center-align">Création d'un compte</h6>
				<div
					class={'field border large-margin' + ' small-margin-bottom'}
					class:invalid={form?.errors?.genre && !genreFocus}
				>
					<p class="medium-margin no-margin-bottom no-margin-left large-text">
						Sexe à l'état civil :
					</p>
					<nav class="no-padding small-margin-top small-margin-bottom">
						<label class="radio">
							<input type="radio" name="genre" on:focus={() => (genreFocus = true)} />
							<span>Homme</span>
						</label>
						<label class="radio">
							<input type="radio" name="genre" on:focus={() => (genreFocus = true)} />
							<span>Femme</span>
						</label>
					</nav>
					{#if form?.errors?.genre}
						<span class="error small-margin-top">
							{#if !genreFocus}
								{form?.errors?.genre}
							{/if}
						</span>
					{/if}
				</div>
				<div class={inputClasses} class:invalid={form?.errors?.nom && !nomFocus}>
					<input
						value={form?.data?.nom ?? ''}
						id="nom"
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
						id="prenom"
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
					class={inputClasses + ' prefix'}
					class:invalid={form?.errors?.dateNaissance && !dateNaissanceFocus}
				>
					<i>today</i>
					<input
						value={form?.data?.dateNaissance ?? ''}
						id="dateNaissance"
						name="dateNaissance"
						type="date"
						disabled={loading}
						on:focus={() => (dateNaissanceFocus = true)}
					/>
					<label for="dateNaissance">Date de naissance</label>
					{#if form?.errors?.dateNaissance}
						<span class="error">
							{#if !dateNaissanceFocus}
								{form?.errors?.dateNaissance}
							{/if}
						</span>
					{/if}
				</div>
				<label class="checkbox large-margin no-margin-top">
					<input name="termsOfUse" type="checkbox" />
					<span>J'accepte les&nbsp;<a class="link" href="">conditions d'utilisation.</a></span>
				</label>
				<nav>
					<button type="button" class="circle transparent" title="Retour" on:click={stepBack}>
						<i>arrow_back</i>
					</button>
					<div class="max" />
					<button formaction="?/step3" class="right-align"> Suivant </button>
				</nav>
			</div>
			<div class="page h6-margin-top {transitionType}" class:active={formStep === 4}>
				<h6 class="center-align">Informations de contact</h6>
				<p class="large-margin large-text">Comment vous contacter ?</p>
				<div
					class={inputClasses + ' prefix'}
					class:invalid={form?.errors?.telephone && !telephoneFocus}
				>
					<i>phone</i>
					<input
						value={form?.data?.telephone ?? ''}
						id="telephone"
						name="telephone"
						type="tel"
						minlength={5}
						maxlength={18}
						disabled={loading}
						on:focus={() => (telephoneFocus = true)}
					/>
					<label for="telephone">Par téléphone</label>
					{#if form?.errors?.telephone}
						<span class="error">
							{#if !telephoneFocus}
								{form?.errors?.telephone}
							{/if}
						</span>
					{/if}
				</div>
				<div class={inputClasses + ' prefix'} class:invalid={form?.errors?.email && !emailFocus}>
					<i>email</i>
					<input
						value={form?.data?.email ?? ''}
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						disabled={loading}
						on:focus={() => (emailFocus = true)}
					/>
					<label for="email">Par e-mail</label>
					{#if form?.errors?.email}
						<span class="error">
							{#if !emailFocus}
								{form?.errors?.email}
							{/if}
						</span>
					{/if}
				</div>
				<nav>
					<button type="button" class="circle transparent" title="Retour" on:click={stepBack}>
						<i>arrow_back</i>
					</button>
					<div class="max" />
					<button formaction="?/step4" class="right-align"> Suivant </button>
				</nav>
			</div>
			<div class="page h6-margin-top {transitionType}" class:active={formStep === 5}>
				<h6 class="center-align">Mot de passe sécurisé</h6>
				<p class="large-margin large-text">Choisissez un mot de passe :</p>
				<div
					class={inputClasses}
					class:invalid={form?.errors?.chosenPassword && !chosenPasswordFocus}
				>
					<input
						value={chosenPassword}
						id="chosenPassword"
						name="chosenPassword"
						type={passwordOrText}
						disabled={loading}
						on:focus={() => (chosenPasswordFocus = true)}
						on:input={handleChosenPasswordInput}
					/>
					<label for="chosenPassword">Mot de passe choisi</label>
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a
						href=""
						aria-label="show-password"
						on:mousedown={() => (eyeIcon = 'visibility_off')}
						on:mouseup={() => (eyeIcon = 'visibility')}
					>
						<i class="front">{eyeIcon}</i>
					</a>
					{#if form?.errors?.chosenPassword}
						<span class="error">
							{#if !chosenPasswordFocus}
								{form?.errors?.chosenPassword}
							{/if}
						</span>
					{/if}
				</div>
				<nav>
					<div class="max" />
					<div
						class={(isChosenPasswordOk ? 'primary-container' : 'error-container') + ' max round'}
					>
						<div class="small-space" />
						<div class="center-align">
							{#if isChosenPasswordOk}<i class="primary-text">check_circle</i>{:else}<i>error</i
								>{/if}
							<p>Ce mot de passe doit contenir au moins :</p>
							<p class="no-margin">
								Une lettre minuscule{#if hasMinuscule}<i class="primary-text">done</i>{:else}<i
										>close</i
									>{/if}
							</p>
							<p class="no-margin">
								Une lettre majuscule{#if hasMajuscule}<i class="primary-text">done</i>{:else}<i
										>close</i
									>{/if}
							</p>
							<p class="no-margin">
								Un chiffre{#if hasChiffre}<i class="primary-text">done</i>{:else}<i>close</i>{/if}
							</p>
							<p class="no-margin">
								Un caractère spécial{#if hasSpecialCharacter}<i class="primary-text">done</i
									>{:else}<i>close</i>{/if}
							</p>
							<p class="no-margin">
								12 caractères{#if hasTwelveCharacter}<i class="primary-text">done</i>{:else}<i
										>close</i
									>{/if}
							</p>
						</div>
						<div class="small-space" />
					</div>
					<div class="max" />
				</nav>
				<nav>
					<div class="max" />
					<div class="tertiary-container max round">
						<div class="small-space" />
						<div class="center-align">
							<i>info</i>
							<p>Ce mot de passe vous permettra de gérer<br /> vos rendez-vous par internet.</p>
						</div>
						<div class="small-space" />
					</div>
					<div class="max" />
				</nav>
				<nav>
					<button type="button" class="circle transparent" title="Retour" on:click={stepBack}>
						<i>arrow_back</i>
					</button>
					<div class="max" />
					<button formaction="?/step5" class="right-align"> Suivant </button>
				</nav>
			</div>
			<div class="page h6-margin-top {transitionType}" class:active={formStep === 6}>
				<h6 class="center-align">Vérification</h6>
				<nav>
					<div class="max" />
					<div class="tertiary-container max round">
						<div class="small-space" />
						<div class="center-align">
							<i>info</i>
							<p>Vous allez recevoir un code par {emailOrPhone}.</p>
						</div>
						<div class="small-space" />
					</div>
					<div class="max" />
				</nav>
				<nav>
					<div class="max" />
					<div
						class={inputClasses + ' max'}
						class:invalid={form?.errors?.fournumberscode && !fournumberscodeFocus}
					>
						<input
							value={form?.data?.fournumberscode ?? ''}
							id="fournumberscode"
							name="fournumberscode"
							type="text"
							minlength="4"
							maxlength="4"
							disabled={loading}
							on:focus={() => (fournumberscodeFocus = true)}
						/>
						<label for="fournumberscode"
							><div class="l m">Saisissez ici le code de vérification</div>
							<div class="s">Code de vérification</div></label
						>
						<i>vpn_key</i>
						{#if form?.errors?.fournumberscode}
							<span class="error">
								{#if !fournumberscodeFocus}
									{form?.errors?.fournumberscode}
								{/if}
							</span>
						{/if}
					</div>
					<div class="max" />
				</nav>
				<div class="small-space" />
				<button formaction="?/step6" class="responsive primary-container"
					><p class="large-text">Valider la création du compte</p>
				</button>
			</div>
		</div>
	</form>
</article>

<style>
	.no-margin-top {
		margin-top: 0 !important;
	}

	.no-margin-left {
		margin-left: 0 !important;
	}

	.no-padding {
		padding: 0 0 !important;
	}

	.small-margin-top {
		margin-top: 0.5rem !important;
	}

	.small-margin-bottom {
		margin-bottom: 0.5rem !important;
	}

	.no-margin-bottom {
		margin-bottom: 0 !important;
	}

	.page.active {
		animation: var(--speed2) to-page ease;
	}

	.h6-margin-top {
		margin-top: 1rem !important;
	}
</style>
