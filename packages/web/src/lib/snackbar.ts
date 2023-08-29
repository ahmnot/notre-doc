import { writable } from 'svelte/store'

export let snackbar = writable({ message: '', type: '', active: false })

export function activateSnackbar(message: string, type: string) {
    snackbar.set({ message: message, type: type, active: true })

    setTimeout(() => snackbar.set({ message: message, type: type, active: false }), 2500)
}