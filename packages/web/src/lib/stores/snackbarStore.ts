import type Snackbar from "@smui/snackbar"
import { writable } from "svelte/store"

export let snackbarLabel = writable('Résultat indéterminé.');
export let snackbarClass = writable('demo-warning');

