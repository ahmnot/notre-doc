import { Api } from "sst/node/api"
import { expect, it } from "vitest"
import { createClient } from "@notre-doc/graphql/genql"
import { Patient } from "@notre-doc/core/src/patient"

it("should create a patient", async () => {
  const client = createClient({
    url: Api.api.url + "/graphql",
  })

  const patient = await client.mutation({
    createPatient: [
      { nom: "toto", prenom: "titi", telephone: "0636333333", dateNaissance: "25-07-1990", email: "toto@gmail.com", numeroSecu: "111222333444555" },
      {
        id: true,
      },
    ],
  })
  const list = await Patient.list()
  expect(
    list.find((a) => a.patientID === patient.createPatient.id)
  ).not.toBeNull()
})
