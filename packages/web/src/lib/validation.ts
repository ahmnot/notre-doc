import { fail, type RequestEvent } from '@sveltejs/kit'
import { z, type ZodRawShape } from 'zod'

const nomRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const telephoneRegex = /^\+?0?0?[0-9][0-9]{9,18}$/g
const numeroSecuRegex = /[12][0-9]{2}(0[1-9]|1[0-2])(2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}([0-9]{2})/
const lowercaseRegex = /[a-z]+/
const uppercaseRegex = /[A-Z]+/
const numberRegex = /\d/
const specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

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
    .email({ message: "E-mail invalide" })
}

export const zodSchemaTelephoneEmail = {
    telephonemail: z.string({ required_error: "E-mail ou n° obligatoire" })
    .trim()
    .nonempty({ message: "E-mail ou n° obligatoire" })
    .email({ message: "E-mail invalide" })
    .or(z.string({ required_error: "N° ou e-mail obligatoire" })
    .trim()
    .nonempty({ message: "N° ou e-mail obligatoire" })
    .min(9, { message: "Trop court" })
    .max(18, { message: "Trop long" })
    .regex(telephoneRegex, { message: "N° invalide" }))
}

export const zodSchemaGenre = {
    genre: z.string({ required_error: "Champ obligatoire" })
        .nonempty({ message: "Champ obligatoire" })
}

export const zodSchemaNom = {
    nom: z.string({ required_error: "Nom obligatoire" })
        .trim()
        .nonempty({ message: "Nom obligatoire" })
        .min(1, { message: "Trop court" })
        .max(55, { message: "Trop long" })
        .regex(nomRegex, { message: "Nom invalide" })
}

export const zodSchemaPrenom = {
    prenom: z.string({ required_error: "Prénom obligatoire" })
        .trim()
        .nonempty({ message: "Prénom obligatoire" })
        .min(1, { message: "Trop court" })
        .max(14, { message: "Trop long" })
        .regex(nomRegex, { message: "Prénom invalide" }),
}

export const zodSchemaDateNaissance = {
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

export const zodSchemaChosenPassword = {
    chosenPassword: z.string({ required_error: "Mot de passe vide" })
        .nonempty({ message: "Mot de passe vide" })
        .regex(lowercaseRegex, { message: "Il manque une minuscule" })
        .regex(uppercaseRegex, { message: "Il manque une majuscule" })
        .regex(numberRegex, { message: "Il manque un chiffre" })
        .regex(specialCharacterRegex, { message: "Il manque un caractère spécial" })
        .min(12, { message: "Mot de passe trop court" })
}


export const zodSchemaStep1 = {
    ...zodSchemaTel,
    ...zodSchemaEmail,
}

export const zodSchemaStep2 = {
    ...zodSchemaNom, ...zodSchemaPrenom, ...zodSchemaDateNaissance
}

export function validate(zodSchema: ZodRawShape) {
    return async ({ request }: RequestEvent) => {

        const formData = await request.formData()
        const fields = Object.fromEntries(formData)
		console.log(fields)

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