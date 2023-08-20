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

const regexNom = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const regexSecu = /[12][0-9]{2}(0[1-9]|1[0-2])(2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}([0-9]{2})/

export const actions: Actions = {
    submitPatient: async ({ cookies, request }) => {
        /* This "await sleep" is just to simulate a 
         loading to see the loading animation */
        await sleep(200)
        const formData = await request.formData()

        let userid = String(cookies.get('userid'))

        const zfdSchema = zfd.formData({
            nom: zfd.text(z.string({ required_error: "Nom obligatoire" }).min(1, { message: "Nom trop court" }).max(55, { message: "Nom trop long" }).regex(regexNom, { message: "Nom invalide" })),
            prenom: zfd.text(z.string({ required_error: "Prénom obligatoire" }).min(1, { message: "Prénom trop court" }).max(14, { message: "Prénom trop long" }).regex(regexNom, { message: "Prénom invalide" })),
            dateNaissance: zfd.text(z.string({ required_error: "Date obligatoire", invalid_type_error: "Date invalide" }).pipe(z.coerce.date({ invalid_type_error: "Date invalide" })
                .min(new Date("1900-01-01"), { message: "Trop âgé" })
                .max(new Date(), { message: "Trop jeune" }))
            ),
            email: zfd.text(z.string({ required_error: "E-mail obligatoire" }).email({ message: "E-mail invalide" })),
            numeroSecu: zfd.text(z.string({ required_error: "N° de sécu obligatoire" }).regex(regexSecu, { message: "N° invalide" }))
        })

        // This validates the form.
        const result = zfdSchema.safeParse(formData)

        const donnees = Object.fromEntries(formData)

        if (!result.success) {
            const data = {
                data: donnees,
                errors: result.error.flatten().fieldErrors
            }

            return fail(400, data)
        }

        try {
            db.createPatient(userid, donnees)
        } catch (error: any) {
            return fail(422, error)
        }

        throw redirect(303, '/admin')
    },

    delete: async ({ cookies, request }) => {
        const data = await request.formData()
        db.deletePatient(cookies.get('userid') || '', data.get('id') as string)
    }
}

