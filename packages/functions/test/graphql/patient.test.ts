import { Api } from "sst/node/api";
import { expect, it } from "vitest";
import { createClient } from "@notre-doc/graphql/genql";
import { Patient } from "@notre-doc/core/patient";

it("should create a patient", async () => {
  const client = createClient({
    url: Api.api.url + "/graphql",
  });

  const patient = await client.mutation({
    createPatient: [
      { email: "toto@gmail.com", numeroSecu: "111222333444555" },
      {
        id: true,
      },
    ],
  });
  const list = await Patient.list();
  expect(
    list.find((a) => a.patientID === patient.createPatient.id)
  ).not.toBeNull();
});
