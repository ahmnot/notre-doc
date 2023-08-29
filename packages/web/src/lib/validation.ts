import { fail } from '@sveltejs/kit'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { ulid } from "ulid"

const nomRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const telephoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g

export const zodSchemaId = {
    id: zfd.text(z.string({ required_error: "Identifiant non fourni" })
        .ulid({ invalid_type_error: "ULID invalide" }))
}

export const zodSchemaStep1 = {
    email: zfd.text(z.string({ required_error: "E-mail obligatoire" })
        .trim()
        .email({ message: "E-mail invalide" })),
    telephone: zfd.text(z.string({ required_error: "N° de tél obligatoire" })
        .trim()
        .min(9, { message: "N° de tél trop court" })
        .max(18, { message: "N° de tél trop long" })
        .regex(telephoneRegex, { message: "N° invalide" }))
}

export const zodSchemaStep2 = {
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

export function validate(zodSchema: any) {
    return async ({ request }) => {

        const formData = await request.formData()

        const zfdSchema = zfd.formData(zodSchema)

        // This validates the form.
        const validation = await zfdSchema.spa(formData)
        
        const fields = Object.fromEntries(formData)

        if (!validation.success) {
            const flatFieldErrors = validation.error.flatten().fieldErrors

            return fail(400, {
                data: fields,
                errors: flatFieldErrors
            })
        }

        return { success: true, data: fields }

    }
}