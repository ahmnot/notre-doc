import { zodSchemaStep1, zodSchemaStep2, validate } from '$lib/validation'

export const actions: Actions = {
    step1: validate(zodSchemaStep1),
    final: validate({ ...zodSchemaStep1, ...zodSchemaStep2 }),
}

