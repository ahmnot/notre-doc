import type { Schema } from "zod"

/**
 * This function is used to simulate a slow network.
 */
export async function sleep(ms: number) {
    return new Promise((fulfil) => setTimeout(fulfil, ms))
}

/**
 * This function is used to validate datas from a form.
 * @param formData 
 * @param schema 
 */
export function validate(formData: FormData, schema: Schema) {
    // ...
  }