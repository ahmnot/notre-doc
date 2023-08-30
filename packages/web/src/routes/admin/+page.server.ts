import { zodSchemaId, zodSchemaStep1, zodSchemaStep2, validate } from '$lib/validation'

export const actions: Actions = {
    deletePatient: validate(zodSchemaId),
    updatePatient: validate({ ...zodSchemaId, ...zodSchemaStep1, ...zodSchemaStep2 })
}