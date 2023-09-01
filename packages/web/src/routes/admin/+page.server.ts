import { zodSchemaId, zodSchemaStep1, zodSchemaStep2, zodSchemaSecu, validate } from '$lib/validation'
import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
    deletePatient: validate(zodSchemaId),
    updatePatient: validate({
        ...zodSchemaId,
        ...zodSchemaStep1,
        ...zodSchemaStep2,
        ...zodSchemaSecu
    })
}