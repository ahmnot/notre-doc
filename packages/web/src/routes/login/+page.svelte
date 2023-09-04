<script lang="ts">
    import type { PageData } from './$types';
    import type { ActionData } from './$types';

    export let form: ActionData;

	let loading = false;

	let inputClasses = 'field label border';

	let telephonemailFocus = false;

    let formStep = 1;

</script>
<article class="fill">
    <h5 class="center-align">Compte patient</h5>
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
				<label for="telephonemail">Saisissez votre e-mail ou téléphone</label>
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
				<button class="right-align" formaction="?/step1">
					Suivant
					<i>arrow_forward</i>
				</button>
			</nav>
		</div>
    </form>
</article>
