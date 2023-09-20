import {
    zodSchemaTelephoneEmail,
    zodSchemaPassword,
    zodSchemaGenre,
    zodSchemaNom,
    zodSchemaPrenom,
    zodSchemaDateNaissance,
    zodSchemaTel,
    zodSchemaEmail,
    zodSchemaChosenPassword,
    validate,
    login,
    signUp
} from '$lib/validation'

import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
    step1: validate(zodSchemaTelephoneEmail("telephonemail")),
    login: login({
        ...zodSchemaTelephoneEmail("telephonemail2"), 
        ...zodSchemaPassword 
    }),
    step2: validate({}),
    step3: validate({
        ...zodSchemaGenre,
        ...zodSchemaNom,
        ...zodSchemaPrenom,
        ...zodSchemaDateNaissance
    }),
    step4: validate({ ...zodSchemaTel, ...zodSchemaEmail }),
    step5: signUp(zodSchemaChosenPassword),
    step6: validate({
        ...zodSchemaGenre,
        ...zodSchemaNom,
        ...zodSchemaPrenom,
        ...zodSchemaDateNaissance,
        ...zodSchemaTel,
        ...zodSchemaEmail,
        ...zodSchemaChosenPassword
    })
}

// export const load: PageServerLoad = async ({ locals }) => {
//     if (!locals.userId) {
//         return { formStep: 2 }
//     }
// };