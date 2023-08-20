import { use, StackContext, SvelteKitSite } from "sst/constructs";
import { Api } from "./Api.js";

export function Web({ stack }: StackContext) {
  const api = use(Api);

  const site = new SvelteKitSite(stack, "Site", {
    path: "packages/web/",
    environment: {
      VITE_GRAPHQL_URL: api.url + "/graphql",
    },
  });

  stack.addOutputs({
    SITE: site.url,
  });
}
