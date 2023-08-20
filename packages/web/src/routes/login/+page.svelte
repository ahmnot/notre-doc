<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form:ActionData;
</script>

<form method="POST" use:enhance>
	<input type="text" name="user" value={form?.data?.user ?? ''}/>

	<input type="password" name="password"/>
	<button type="submit">Login</button>
</form>
