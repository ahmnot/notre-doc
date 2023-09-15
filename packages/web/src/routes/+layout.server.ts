import type { LayoutServerLoad } from "./$types";
import { Amplify } from "aws-amplify";

import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: import.meta.env.VITE_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID
  }
});

initContextClient({
  url: import.meta.env.VITE_GRAPHQL_URL,
  exchanges: [cacheExchange, fetchExchange]
});

export const load: LayoutServerLoad = async (event) => {
  return {
    session: await event.locals.getSession(),
  };
};