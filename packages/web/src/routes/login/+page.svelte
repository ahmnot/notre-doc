<script lang="ts">
    import type { PageData } from './$types';
    import Inscription from '$lib/components/Inscription.svelte';
    
	let isDialogActive = false;

    export let data: PageData;
</script>


<Inscription form {isDialogActive} 
on:clickoutside={() => (isDialogActive = false)}/>