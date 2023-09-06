<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;

	let inputClasses = 'field label border medium-margin';

	let telephonemailFocus = false;
	let passwordFocus = false;
	let nomFocus = false;
	let prenomFocus = false;
	let dateNaissanceFocus = false;

	let formStep = 1;

	function stepBack() {
		formStep--;
		telephonemailFocus = true;
	}
</script>

<article class="max">
	<h4 class="center-align">Prendre rendez-vous</h4>
	<nav class="scroll">
		<button class="circle small" on:click={() => (formStep = 1)} disabled={false}>1</button>
		<div class="max divider" />

		<button class="circle small" disabled={formStep < 2}>2</button>
		<div class="max divider" />
		<button class="circle small" disabled={formStep < 3}>3</button>
	</nav>
	<div class="small-space" />
	<form method="POST" novalidate>
		<div class="page" class:active={formStep === 1}>
			<div
				class={inputClasses + ' max'}
				class:invalid={form?.errors?.telephonemail && !telephonemailFocus}
			>
				<input
					value={form?.data?.telephonemail ?? ''}
					name="telephonemail"
					type="text"
					disabled={loading}
					on:focus={() => (telephonemailFocus = true)}
				/>
				<label for="telephonemail">Adresse e-mail ou n° de téléphone</label>
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
				<button type="button" class="right-align" on:click={() => formStep++}>
					Suivant
					<i>arrow_forward</i>
				</button>
			</nav>
		</div>

		<div class="page right" class:active={formStep === 2}>
			<h6 class="center-align">Vous avez déjà un compte ?</h6>
			<div class={inputClasses} class:invalid={form?.errors?.telephonemail && !telephonemailFocus}>
				<input
					value={form?.data?.telephonemail ?? ''}
					name="telephonemail"
					type="text"
					disabled={loading}
					on:focus={() => (telephonemailFocus = true)}
				/>
				<label for="telephonemail">Adresse e-mail ou n° de téléphone</label>
				{#if form?.errors?.telephonemail}
					<span class="error">
						{#if !telephonemailFocus}
							{form?.errors?.telephonemail}
						{/if}
					</span>
				{/if}
			</div>
			<div class={inputClasses + ''} class:invalid={form?.errors?.password && !passwordFocus}>
				<input
					value={form?.data?.password ?? ''}
					name="password"
					type="password"
					disabled={loading}
					on:focus={() => (passwordFocus = true)}
				/>
				<label for="password">Mot de passe</label>
				<i>visibility</i>
				{#if form?.errors?.password}
					<span class="error">
						{#if !passwordFocus}
							{form?.errors?.password}
						{/if}
					</span>
				{/if}
			</div>
			<label class="checkbox medium-margin no-margin-top">
				<input type="checkbox" />
				<span>Se souvenir de moi</span>
			</label>
			<button class="responsive" formaction="?/connexion"
				><p class="large-text">Connexion</p></button
			>
			<p class="center-align">
				<a class="link" href="">Code confidentiel oublié ?</a>
			</p>
			<h6 class="center-align">Première visite ?</h6>
			<button type="button" class="responsive" on:click={() => formStep++}
				><p class="large-text">S'inscrire</p>
			</button>
			<div class="small-space" />
		</div>
		<div style:display={formStep === 3 ? '' : 'none'}>
			<p class="medium-margin large-text">Sexe à l'état civil</p>
			<nav class="medium-margin">
				<label class="radio">
					<input type="radio" name="genre" />
					<span>Homme</span>
				</label>
				<label class="radio">
					<input type="radio" name="genre" />
					<span>Femme</span>
				</label>
			</nav>
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
				<button type="button" class="circle transparent" title="Retour" on:click={stepBack}>
					<i>arrow_back</i>
				</button>
				<div class="max" />
				<button class="right-align" formaction="?/final" type="submit">
					Suivant
					<i>arrow_forward</i>
				</button>
			</nav>
		</div>
	</form>
</article>

<style>
	.no-margin-top {
		margin-top: 0 !important;
	}
</style>
