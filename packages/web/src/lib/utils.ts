/**
 * This function is used to simulate a slow network.
 */
export async function sleep(ms: number) {
    return new Promise((fulfil) => setTimeout(fulfil, ms))
}
