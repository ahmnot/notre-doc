import { fail, redirect } from '@sveltejs/kit'
import * as db from '$lib/server/database'
import { sleep } from '$lib/utils'
import type { Actions } from './$types'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { ulid } from "ulid"

export function load({ cookies }) {
    const id = cookies.get('userid')

    if (!id) cookies.set('userid', ulid(), { path: '/' })

    return {
        patients: db.getPatients(id!) ?? []
    }
}

const nomRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const telephoneRegex = /^\d{10}$/

export const actions: Actions = {
    submitPatient: async ({ cookies, request }) => {
        /* This "await sleep" is just to simulate a 
         loading to see the loading animation */
        await sleep(100)
        const formData = await request.formData()

        let userid = String(cookies.get('userid'))

        const zfdSchema = zfd.formData({
            nom: zfd.text(z.string({ required_error: "Nom obligatoire" }).trim().min(1, { message: "Nom trop court" }).max(55, { message: "Nom trop long" }).regex(nomRegex, { message: "Nom invalide" })),
            prenom: zfd.text(z.string({ required_error: "Prénom obligatoire" }).trim().min(1, { message: "Prénom trop court" }).max(14, { message: "Prénom trop long" }).regex(nomRegex, { message: "Prénom invalide" })),
            dateNaissance: zfd.text(z.string({ required_error: "Date obligatoire", invalid_type_error: "Date invalide" }).trim().pipe(z.coerce.date({ invalid_type_error: "Date invalide" })
                .min(new Date("1900-01-01"), { message: "Trop âgé" })
                .max(new Date(), { message: "Trop jeune" }))
            ),
            email: zfd.text(z.string({ required_error: "E-mail obligatoire" }).trim().email({ message: "E-mail invalide" })),
            telephone: zfd.text(z.string({ required_error: "N° de tél obligatoire" }).trim().regex(telephoneRegex, { message: "N° invalide" }))
        })

        // This validates the form.
        const validation = zfdSchema.safeParse(formData)

        const donnees = Object.fromEntries(formData)

        if (!validation.success) {
            const data = {
                data: donnees,
                errors: validation.error.flatten().fieldErrors
            }

            return fail(400, data)
        }

        // try {
        //     // db.createPatient(userid, donnees)
        // } catch (error: any) {
        //     return fail(422, error)
        // }

        return { success: true, data: donnees }
        // throw redirect(303, '/admin')
    },

    delete: async ({ cookies, request }) => {
        const data = await request.formData()
        db.deletePatient(cookies.get('userid') || '', data.get('id') as string)
    }
}

