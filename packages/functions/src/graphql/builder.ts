// STEP 1 (see Api.ts)

import SchemaBuilder from "@pothos/core"
import { DateResolver } from 'graphql-scalars';

export const builder = new SchemaBuilder<{
    Scalars: {
        Date: {
            Input: Date
            Output: Date
        }
    }
}>({})

builder.addScalarType('Date', DateResolver, {})

builder.queryType({})
builder.mutationType({})
