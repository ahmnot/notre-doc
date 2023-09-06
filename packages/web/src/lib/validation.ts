import { fail, type RequestEvent } from '@sveltejs/kit'
import { z, type ZodRawShape } from 'zod'

const nomRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const telephoneRegex = /^\+?0?0?[0-9][0-9]{5,15}$/g
const numeroSecuRegex = /[12][0-9]{2}(0[1-9]|1[0-2])(2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}([0-9]{2})/

export const zodSchemaId = {
    id: z.string({ required_error: "Identifiant non fourni" })
        .trim()
        .nonempty({ message: "Identifiant non fourni" })
        .ulid({ message: "ULID invalide" })
}

export const zodSchemaTel = {
    telephone: z.string({ required_error: "N° obligatoire" })
        .trim()
        .nonempty({ message: "N° obligatoire" })
        .min(9, { message: "Trop court" })
        .max(18, { message: "Trop long" })
        .regex(telephoneRegex, { message: "N° invalide" }),
}

export const zodSchemaEmail = {
    email: z.string({ required_error: "E-mail obligatoire" })
        .trim()
        .nonempty({ message: "E-mail obligatoire" })
        .email({ message: "E-mail invalide" }),
}

export const zodSchemaStep1 = {
    ...zodSchemaTel,
    ...zodSchemaEmail,
}

export const zodSchemaStep2 = {
    nom: z.string({ required_error: "Nom obligatoire" })
        .trim()
        .nonempty({ message: "Nom obligatoire" })
        .min(1, { message: "Trop court" })
        .max(55, { message: "Trop long" })
        .regex(nomRegex, { message: "Nom invalide" }),
    prenom: z.string({ required_error: "Prénom obligatoire" })
        .trim()
        .nonempty({ message: "Prénom obligatoire" })
        .min(1, { message: "Trop court" })
        .max(14, { message: "Trop long" })
        .regex(nomRegex, { message: "Prénom invalide" }),
    dateNaissance: z.string({ required_error: "Date obligatoire", invalid_type_error: "Date invalide" })
        .trim()
        .nonempty({ message: "Date obligatoire" })
        .pipe(z.coerce.date({ invalid_type_error: "Date invalide" })
            .min(new Date("1900-01-01"), { message: "Trop âgé" })
            .max(new Date(), { message: "Trop jeune" }))
}

export const zodSchemaSecu = {
    numeroSecu: z.string({ required_error: "N° de sécurité sociale non fourni" })
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

        // This validates the form.
        const validation = await z.object(zodSchema).spa(fields)

        if (!validation.success) {
            const flatFieldErrors = adjustErrors(validation.error.flatten().fieldErrors)

            return fail(400, {
                data: fields,
                errors: flatFieldErrors
            })
        }

        return { success: true, data: fields }
    }
}

/**
 * This formats the final error messages
 * @param input 
 * @returns 
 */
const adjustErrors = (input: object) =>
    Object.fromEntries(
        Object.entries(input).map(
            ([key, messages]) => [key, messages.slice(0, 1)]
        )
    );