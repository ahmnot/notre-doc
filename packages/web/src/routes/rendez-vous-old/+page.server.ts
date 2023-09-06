import { zodSchemaStep1, zodSchemaStep2, validate } from '$lib/validation'
import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
    step1: validate(zodSchemaStep1),
    final: validate({ ...zodSchemaStep1, ...zodSchemaStep2 }),
}

