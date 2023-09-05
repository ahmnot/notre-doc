<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;

	let inputClasses = 'field label border';

	let telephonemailFocus = false;
	let passwordFocus = false;

	let formStep = 1;
</script>

<article class="fill">
	<h5 class="center-align">Prise de rendez-vous</h5>
	<p class="center-align">
		<small style="opacity:0.45">Veuillez renseigner les champs suivants</small>
	</p>
	<form method="POST" novalidate>
		<div style:display={formStep === 1 ? '' : 'none'}>
			<div class={inputClasses} class:invalid={form?.errors?.telephonemail && !telephonemailFocus}>
				<input
					value={form?.data?.telephonemail ?? ''}
					name="telephonemail"
					type="text"
					disabled={loading}
					on:focus={() => (telephonemailFocus = true)}
				/>
				<label for="telephonemail">Saisissez votre e-mail ou n° de téléphone</label>
				<i>phone</i>
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
		<div style:display={formStep === 2 ? '' : 'none'}>
			<h6 class="center-align">Vous avez déjà utilisé ce service ?</h6>
			<div class={inputClasses} class:invalid={form?.errors?.telephonemail && !telephonemailFocus}>
				<input
					value={form?.data?.telephonemail ?? ''}
					name="telephonemail"
					type="text"
					disabled={loading}
					on:focus={() => (telephonemailFocus = true)}
				/>
				<label for="telephonemail">Saisissez votre e-mail ou n° de téléphone</label>
				<i>phone</i>
				{#if form?.errors?.telephonemail}
					<span class="error">
						{#if !telephonemailFocus}
							{form?.errors?.telephonemail}
						{/if}
					</span>
				{/if}
			</div>
			<div class={inputClasses} class:invalid={form?.errors?.password && !passwordFocus}>
				<input
					value={form?.data?.password ?? ''}
					name="password"
					type="password"
					disabled={loading}
					on:focus={() => (passwordFocus = true)}
				/>
				<label for="password">Saisissez votre mot de passe</label>
				<i>visibility</i>
				{#if form?.errors?.password}
					<span class="error">
						{#if !passwordFocus}
							{form?.errors?.password}
						{/if}
					</span>
				{/if}
			</div>
			<button class="responsive" formaction="?/connexion"> Connexion </button>
			<div class="small-space" />
			<p class="center-align">
				<a href="">Code confidentiel oublié ?</a>
			</p>
			<h6 class="center-align">C'est votre première visite ?</h6>
			<button class="responsive" formaction="?/signup"> Je crée mon compte </button>
		</div>
	</form>
</article>
