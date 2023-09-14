import type { LayoutServerLoad } from "./$types";
import { Amplify } from "aws-amplify";
import config from "../config";

import { initContextClient, cacheExchange, fetchExchange } from '@urql/svelte';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: 'graphql',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
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