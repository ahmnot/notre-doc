import { use, StackContext, SvelteKitSite } from "sst/constructs";
import { Api } from "./Api.js";
import { Auth } from "./Auth.js"

export function Web({ stack, app }: StackContext) {
  const api = use(Api);
  const { auth } = use(Auth);

  const site = new SvelteKitSite(stack, "Site", {
    path: "packages/web/",
    environment: {
      VITE_GRAPHQL_URL: api.url + "/graphql",
      VITE_REGION: app.region,
      VITE_USER_POOL_ID: auth.userPoolId,
      VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    },
  });

  stack.addOutputs({
    SITE: site.url,
  });
}
