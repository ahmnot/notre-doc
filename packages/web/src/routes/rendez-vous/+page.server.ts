import { fail, redirect } from '@sveltejs/kit'
import * as db from '$lib/server/database'
import { sleep } from '$lib/utils'
import type { Actions } from './$types'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { ulid } from "ulid"

export function load({}) {
    return {}
}

const nomRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const telephoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g

const zodStep1 = {
    email: zfd.text(z.string({ required_error: "E-mail obligatoire" })
        .trim()
        .email({ message: "E-mail invalide" })),
    telephone: zfd.text(z.string({ required_error: "N° de tél obligatoire" })
        .trim()
        .min(9, { message: "N° de tél trop court" })
        .max(18, { message: "N° de tél trop long" })
        .regex(telephoneRegex, { message: "N° invalide" }))
}

const zodStep2 = {
    nom: zfd.text(z.string({ required_error: "Nom obligatoire" })
        .trim()
        .min(1, { message: "Nom trop court" })
        .max(55, { message: "Nom trop long" })
        .regex(nomRegex, { message: "Nom invalide" })),
    prenom: zfd.text(z.string({ required_error: "Prénom obligatoire" })
        .trim()
        .min(1, { message: "Prénom trop court" })
        .max(14, { message: "Prénom trop long" })
        .regex(nomRegex, { message: "Prénom invalide" })),
    dateNaissance: zfd.text(z.string({ required_error: "Date obligatoire", invalid_type_error: "Date invalide" })
        .trim()
        .pipe(z.coerce.date({ invalid_type_error: "Date invalide" })
            .min(new Date("1900-01-01"), { message: "Trop âgé" })
            .max(new Date(), { message: "Trop jeune" }))
    ),
}

const finalStep = 2;

function goToStep(target: number, zodSchema?: {}): {} {
    return async ({ request }) => {

        const formData = await request.formData()
        const fields = Object.fromEntries(formData)


        if (zodSchema) {
            const zfdSchema = zfd.formData(zodSchema)

            // This validates the form.
            const validation = zfdSchema.safeParse(formData)

            if (!validation.success) {

                const flatFieldErrors = validation.error.flatten().fieldErrors

                return fail(400, {
                    step: target === -1 ? target : (target - 1),
                    data: fields,
                    errors: flatFieldErrors
                })
            }
        }

        return { step: target, success: true, data: fields }

    }
}

export const actions: Actions = {
    step1: goToStep(finalStep, zodStep1),
    final: goToStep(-1, { ...zodStep1, ...zodStep2 }),
}

