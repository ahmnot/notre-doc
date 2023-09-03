import { fail, type RequestEvent } from '@sveltejs/kit'
import { z, type ZodRawShape } from 'zod'

const nomRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const telephoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
const numeroSecuRegex = /[12][0-9]{2}(0[1-9]|1[0-2])(2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}([0-9]{2})/

export const zodSchemaId = {
    id: z.string({ required_error: "Identifiant non fourni" })
        .trim()
        .ulid({ message: "ULID invalide" })
}

export const zodSchemaStep1 = {
    email: z.string({ required_error: "E-mail obligatoire" })
        .trim()
        .email({ message: "E-mail invalide" }),
    telephone: z.string({ required_error: "N° obligatoire" })
        .trim()
        .min(9, { message: "N° trop court" })
        .max(18, { message: "N° trop long" })
        .regex(telephoneRegex, { message: "N° invalide" })
}

export const zodSchemaStep2 = {
    nom: z.string({ required_error: "Nom obligatoire" })
        .trim()
        .min(1, { message: "Nom trop court" })
        .max(55, { message: "Nom trop long" })
        .regex(nomRegex, { message: "Nom invalide" }),
    prenom: z.string({ required_error: "Prénom obligatoire" })
        .trim()
        .min(1, { message: "Prénom trop court" })
        .max(14, { message: "Prénom trop long" })
        .regex(nomRegex, { message: "Prénom invalide" }),
    dateNaissance: z.string({ required_error: "Date obligatoire", invalid_type_error: "Date invalide" })
        .trim()
        .pipe(z.coerce.date({ invalid_type_error: "Date invalide" })
            .min(new Date("1900-01-01"), { message: "Trop âgé" })
            .max(new Date(), { message: "Trop jeune" }))
}

export const zodSchemaSecu = {
    id: z.string({ required_error: "Identifiant non fourni" })
        .trim()
        .min(15, { message: "N° trop long" })
        .max(15, { message: "N° trop court" })
        .regex(numeroSecuRegex, { message: "N° invalide" }).nullish()
        .or(z.literal("")),
}

export function validate(zodSchema: ZodRawShape) {
    return async ({ request }: RequestEvent) => {

        const formData = await request.formData()
        const fields = Object.fromEntries(formData)

        const zodSchemaObject = z.object(zodSchema)

        // This validates the form.
        const validation = await zodSchemaObject.spa(fields)

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