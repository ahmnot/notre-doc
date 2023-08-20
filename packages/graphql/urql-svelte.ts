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
import { get } from 'svelte/store'


export function typedQueryStore<Query extends QueryGenqlSelection>(opts: {
  client: Client
  query: Query
  pause?: boolean
  requestPolicy?: RequestPolicy
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
  opts?: Partial<OperationContext>,
) {
  const executeMutation = async (vars?: Variables, context?: Partial<OperationContext>) => {
    const built = builder(vars || ({} as Variables))
    const { query, variables } = generateMutationOp(built)

    return mutationStore<Data, Variables>({ client, query, variables: variables as Variables, ...opts, ...context })
  }
  return executeMutation
}

// <script lang="ts">
//     import { typedMutationStore } from './urql-svelte.ts';

//     const { state, executeMutation } = typedMutationStore(/* your builder function */, /* optional context */);

//     // To execute the mutation:
//     function handleMutation() {
//         executeMutation(/* your variables */);
//     }
// </script>

// <!-- You can use the state like any Svelte store -->
// {#if $state.fetching}
//     Loading...
// {:else if $state.error}
//     {$state.error.message}
// {:else}
//     {JSON.stringify($state.data)}
// {/if}