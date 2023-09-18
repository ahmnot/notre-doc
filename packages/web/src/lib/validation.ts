import { redirect, fail, type RequestEvent } from '@sveltejs/kit'
import { z, type ZodRawShape } from 'zod'

import {
    cognitoLogin,
    cognitoRegisterUserToUserPool,
    cognitoConfirmRegistration,
    userPool
} from './cognito'

import { CognitoUser } from 'amazon-cognito-identity-js';


const nomRegex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ-]+$/i
const telephoneRegex = /^\+?0?0?[0-9][0-9]{7,18}$/g
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

export function login(zodSchema: ZodRawShape) {
    return async ({ request, cookies }: RequestEvent) => {
        let response;

        try {
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

            response = await cognitoLogin(
                fields.telephonemail2.toString(),
                fields.password.toString()
            );

        } catch (error: any) {
            return fail(401, { error: error.message });
        }

        cookies.set('jwt', response.getAccessToken().getJwtToken(), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
        });
        throw redirect(303, '/compte-patient');
    }
}

export function signUp(zodSchema: ZodRawShape) {
    return async ({ request, cookies }: RequestEvent) => {
        let response;
        try {
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

            response = await cognitoRegisterUserToUserPool(
                fields.email.toString(),
                fields.chosenPassword.toString()
            );
        } catch (error: any) {
            return fail(400, { error: error.message });
        }

        cookies.set('username', response.user.getUsername(), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
        });

        return { success: true }
    }
}

export function confirmRegistration(zodSchema: ZodRawShape) {

    return async ({ request, cookies }: RequestEvent) => {
        try {
            const formData = await request.formData();
            const confirmationCode = formData.get('confirmationCode');
            const username = cookies.get('username');

            if (
                typeof username !== 'string' ||
                typeof confirmationCode !== 'string' ||
                !username ||
                !confirmationCode
            ) {
                return fail(400, { error: 'invalid' });
            }

            const myCognitoUser = new CognitoUser({
                Username: username,
                Pool: userPool,
            });
            await cognitoConfirmRegistration(myCognitoUser, confirmationCode);
        } catch (e: any) {
            console.error(e);
            return { success: false, error: e.message };
        }

        throw redirect(303, '/login');
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