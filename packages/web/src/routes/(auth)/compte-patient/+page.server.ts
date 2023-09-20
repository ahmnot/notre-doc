import { redirect } from '@sveltejs/kit'

import { zodSchemaId, zodSchemaStep1, zodSchemaStep2, zodSchemaSecu, validate } from '$lib/validation'
import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
    deletePatient: validate(zodSchemaId),
    updatePatient: validate({
        ...zodSchemaId,
        ...zodSchemaStep1,
        ...zodSchemaStep2,
        ...zodSchemaSecu
    }),
    logout: async ({ cookies }) => {
        cookies.set('jwt', '', {
            path: '/',
            expires: new Date(0),
        })

        // redirect the user
        throw redirect(302, '/rendez-vous')
    }
}