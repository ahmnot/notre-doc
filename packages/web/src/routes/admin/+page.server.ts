import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { ulid } from "ulid"
import { zodSchemaId, zodSchemaStep1, zodSchemaStep2, validate } from '$lib/validation'

export const actions: Actions = {
    deletePatient: validate(zodSchemaId),
    updatePatient: validate({ ...zodSchemaId, ...zodSchemaStep1, ...zodSchemaStep2 })
}