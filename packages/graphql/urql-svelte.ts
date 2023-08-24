// typedMutationStore.ts
import { writable } from 'svelte/store'
import { OperationContext, CombinedError, RequestPolicy, } from "urql"
import { Client, OperationResultStore, mutationStore, queryStore, } from '@urql/svelte'
import {
  QueryResult,
  QueryGenqlSelection,
  MutationResult,
  MutationGenqlSelection,
  generateQueryOp,
  generateMutationOp,
} from "./genql"

export function typedQueryStore<Query extends QueryGenqlSelection>(opts: {
  client: Client,
  query: Query,
  pause?: boolean,
  requestPolicy?: RequestPolicy,
  context?: Partial<OperationContext>
}) {
  const { query, variables } = generateQueryOp(opts.query)
  return queryStore<QueryResult<Query>>({
    ...opts,
    query,
    variables,
  })
}

export function typedMutationStore<
  Variables extends Record<string, any>,
  Mutation extends MutationGenqlSelection,
  Data extends MutationResult<Mutation>
>(
  client: Client,
  builder: (vars: Variables) => Mutation,
  context?: Partial<OperationContext>,
) {
  const executeMutation = async (vars?: Variables) => {
    const built = builder(vars || ({} as Variables))
    const { query, variables } = generateMutationOp(built)

    return mutationStore<Data, Variables>({ client, query, variables: variables as Variables, ...context })
  }
  return executeMutation
}

export async function typedMutation<
  Variables extends Record<string, any>,
  Mutation extends MutationGenqlSelection,
  Data extends MutationResult<Mutation>
>(
  client: Client,
  builder: (vars: Variables) => Mutation,
  vars: Variables,
  context?: Partial<OperationContext>,
) {

  const built = builder(vars || ({} as Variables))
  const { query, variables } = generateMutationOp(built)

  return client.mutation<Data, Variables>(query, variables as Variables, context)
}