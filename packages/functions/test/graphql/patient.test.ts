import { Api } from "sst/node/api"
import { expect, it } from "vitest"
import { createClient } from "@notre-doc/graphql/genql"
import { typedMutationStore, typedQueryStore } from '@notre-doc/graphql/urql-svelte'

import {
  Client,
  cacheExchange,
  fetchExchange,
  OperationResultStore
} from '@urql/svelte'

import { get } from 'svelte/store'


import { Patient } from "@notre-doc/core/src/patient"
import { ulid } from "ulid"

it("should create a patient", async () => {

  const client = new Client({
    url: Api.api.url + "/graphql",
    exchanges: [cacheExchange, fetchExchange]
  })

  interface PatientForm {
    nom: string
    prenom: string
    dateNaissance: string
    email: string
    telephone: string
    numeroSecu: string
  }

  const createPatientBuilder = (vars: PatientForm) => {
    return {
      createPatient: {
        __args: {
          ...vars
        },
        id: true
      }
    }
  }

  const executeCreatePatientMutation = typedMutationStore(client, createPatientBuilder)

  let resultStore: OperationResultStore

  const createPatient = async (vars) => {
    resultStore = await executeCreatePatientMutation(vars)
  }

  await createPatient({ nom: "toto", prenom: "titi", dateNaissance: "25-07-1990", email: "toto@gmail.com", telephone: "0636333333", numeroSecu: "111222333444555" })

  const list = await Patient.list()

  console.log("list=")
  console.log(list)

  expect(list.length).not.to.equal(0)
  expect(
    list.find((a) => a.patientID === patient.createPatient.id)
  ).not.toBeNull()

})
