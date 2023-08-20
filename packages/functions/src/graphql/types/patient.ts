// STEP 2 (see Api.ts)
// This is where we define the model, types, etc. (I don't
// know how to call it) for graphql. For SQL, it is defined
// by making new migrations in the CLI, and then by using Kysely
// in the .mjs files in packages/core/migrations 
// (for example, 1692131139968_patient.mjs)
import { Patient } from "@notre-doc/core/patient"
import { SQL } from "@notre-doc/core/sql"
import { builder } from "../builder"

const OrdonnanceType = builder.objectRef<SQL.Row["ordonnance"]>("Ordonnance").implement({
  fields: (t) => ({
    id: t.exposeID("ordonnanceID"),
    text: t.exposeString("text"),
  })
})

const PatientType = builder.objectRef<SQL.Row["patient"]>("Patient").implement({
  fields: (t) => ({
    id: t.exposeID("patientID"),
    email: t.exposeString("email"),
    numeroSecu: t.exposeString("numeroSecu"),
    ordonnances: t.field({
      type: [OrdonnanceType],
      resolve: (patient) => Patient.ordonnances(patient.patientID)
    })
  }),
})

builder.queryFields((t) => ({
  patient: t.field({
    type: PatientType,
    args: {
      patientID: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const result = await Patient.get(args.patientID)

      if (!result) {
        throw new Error("Patient non trouvé")
      }

      return result
    },
  }),
  patients: t.field({
    type: [PatientType],
    resolve: () => Patient.list(),
  }),
}))

builder.mutationFields((t) => ({
  addOrdonnance: t.field({
    type: OrdonnanceType,
    args: {
      patientID: t.arg.string({ required: true }),
      text: t.arg.string({ required: true }),
    },
    resolve: (_, args) => Patient.addOrdonnance(args.patientID, args.text),
  }),
  createPatient: t.field({
    type: PatientType,
    args: {
      email: t.arg.string({ required: true }),
      numeroSecu: t.arg.string({ required: true }),
    },
    resolve: (_, args) => Patient.create(args.email, args.numeroSecu),
  }),
}))
