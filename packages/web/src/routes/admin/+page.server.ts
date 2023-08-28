import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { ulid } from "ulid"

const zodSchema = {
    id: zfd.text(z.string({ required_error: "Identifiant non fourni" })
        .ulid({ invalid_type_error: "ULID invalide" }))
}

export const actions: Actions = {
    deletePatient: async ({ request }) => {
        const formData = await request.formData()
        const fields = Object.fromEntries(formData)

        const zfdSchema = zfd.formData(zodSchema)

        // This validates the form.
        const validation = await zfdSchema.spa(formData)

        if (!validation.success) {

            const flatFieldErrors = validation.error.flatten().fieldErrors

            return fail(400, {
                data: fields,
                errors: flatFieldErrors
            })
        }

        return { success: true, ...fields }

    }
}