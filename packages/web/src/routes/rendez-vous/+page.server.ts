import {
    zodSchemaTelephoneEmail,
    zodSchemaGenre,
    zodSchemaNom,
    zodSchemaPrenom,
    zodSchemaDateNaissance,
    zodSchemaTel,
    zodSchemaEmail,
    zodSchemaChosenPassword,
    validate,
    login
} from '$lib/validation'

import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
    step1: validate(zodSchemaTelephoneEmail),
    login: login(zodSchemaTelephoneEmail),
    step2: validate({}),
    step3: validate({
        ...zodSchemaGenre,
        ...zodSchemaNom,
        ...zodSchemaPrenom,
        ...zodSchemaDateNaissance
    }),
    step4: validate({ ...zodSchemaTel, ...zodSchemaEmail }),
    step5: validate(zodSchemaChosenPassword),
    step6: validate({    
        ...zodSchemaGenre,
        ...zodSchemaNom,
        ...zodSchemaPrenom,
        ...zodSchemaDateNaissance,
        ...zodSchemaTel,
        ...zodSchemaEmail,
        ...zodSchemaChosenPassword})
}
