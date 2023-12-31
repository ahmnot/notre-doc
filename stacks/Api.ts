import { use, StackContext, Api as ApiGateway } from "sst/constructs"
import { Database } from "./Database.js"

export function Api({ stack }: StackContext) {
  const api = new ApiGateway(stack, "api", {
    defaults: {
      // authorizer: "iam",
      function: {
        bind: [use(Database)],
      },
    },
    routes: {
      "POST /graphql": {
        type: "graphql",
        function: {
          handler: "packages/functions/src/graphql/graphql.handler",
        },
        pothos: {
          schema: "packages/functions/src/graphql/schema.ts",
          output: "packages/graphql/schema.graphql",
          // These commands run after generating the schema. Useful for code generation steps.
          commands: [
            "cd packages/graphql && npx @genql/cli --output ./genql --schema ./schema.graphql --esm",
          ],
        },
      },
    },
  })

  stack.addOutputs({
    API: api.url,
  })

  return api
}
