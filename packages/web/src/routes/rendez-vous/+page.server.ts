import {
    zodSchemaTel,
    zodSchemaEmail,
    zodSchemaNom,
    zodSchemaPrenom,
    zodSchemaDateNaissance,
    zodSchemaChosenPassword,
    zodSchemaTelEmail,
    validate
} from '$lib/validation'
import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
    step1: validate({}),
    step2: validate({}),
    step3: validate({}),
    step4: validate({}),
    step5: validate({}),
    step6: validate({})
}
