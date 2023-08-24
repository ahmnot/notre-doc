import { Api } from "sst/node/api"
import { expect, it } from "vitest"
import { createClient } from "@notre-doc/graphql/genql"
import { typedMutation, typedMutationStore, typedQuery, typedQueryStore } from '@notre-doc/graphql/urql-svelte'

import {
  Client, debugExchange,
  cacheExchange,
  fetchExchange,
  OperationResultStore
} from '@urql/svelte'

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
    dateNaissance: Date
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
        id: true,
      }
    }
  }

  const lengthBefore = (await Patient.list()).length

  const nomNewPatient = "titi"
  const prenomNewPatient = "toto"
  const dateNaissanceNewPatient = "1990-07-25"
  const emailNewPatient = "tototiti@gmail.com"
  const telephoneNewPatient = "0636333333"
  const numeroSecuNewPatient = "111222333444555"

  let result = await typedMutation(client, createPatientBuilder, {
    nom: nomNewPatient,
    prenom: prenomNewPatient,
    dateNaissance: dateNaissanceNewPatient,
    email: emailNewPatient,
    telephone: telephoneNewPatient,
    numeroSecu: numeroSecuNewPatient
  })

  expect(result.error).toBe(undefined)

  let listePatients = await Patient.list()

  let lengthAfter = listePatients.length

  expect(lengthAfter).not.to.equal(0)
  expect(lengthAfter).to.equal(lengthBefore + 1)

  const ulidRegex = /[0-7][0-9A-HJKMNP-TV-Z]{25}/gm

  expect(ulidRegex.test(result.data.createPatient.id)).toBe(true)

  const leNewPatientSQL = await Patient.get(result.data.createPatient.id)

  expect(
    leNewPatientSQL.patientID
  ).to.be.equal(result.data.createPatient.id)
  expect(leNewPatientSQL.nom)
    .to.be.equal(nomNewPatient)
  expect(leNewPatientSQL.prenom)
    .to.be.equal(prenomNewPatient)
  expect(leNewPatientSQL.dateNaissance)
    .to.be.equal(dateNaissanceNewPatient)
  expect(leNewPatientSQL.email)
    .to.be.equal(emailNewPatient)
  expect(leNewPatientSQL.telephone)
    .to.be.equal(telephoneNewPatient)
  expect(leNewPatientSQL.numeroSecu)
    .to.be.equal(numeroSecuNewPatient)
})
