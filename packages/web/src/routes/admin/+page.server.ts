import * as db from '$lib/server/database'
import { ulid } from "ulid"

// import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte'

// initContextClient({
//     url: import.meta.env.VITE_GRAPHQL_URL,
//     exchanges: [cacheExchange, fetchExchange]
// });


export function load({ cookies }: { cookies: any }) {
    const id = cookies.get('userid')

    if (!id) cookies.set('userid', ulid(), { path: '/' })

    return {
        patients: db.getPatients(id!) ?? []
    }
}


