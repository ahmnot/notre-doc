// STEP 2 (see Api.ts)
// This is where we define the model, types, etc. (I don't
// know how to call it) for graphql. For SQL, it is defined
// by making new migrations in the CLI, and then by using Kysely
// in the .mjs files in packages/core/migrations 
// (for example, 1692131139968_patient.mjs)
import { Patient } from "@notre-doc/core/patient"
import { RendezVousType } from "./rendez_vous"
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
    nom: t.exposeString("nom"),
    prenom: t.exposeString("prenom"),
    dateNaissance: t.field({type: 'Date', resolve: () => new Date()}),
    email: t.exposeString("email"),
    telephone: t.exposeString("telephone"),
    numeroSecu: t.exposeString("numeroSecu"),
    ordonnances: t.field({
      type: [OrdonnanceType],
      resolve: (patient) => Patient.ordonnances(patient.patientID)
    }),
    rendezVous: t.field({
      type: [RendezVousType],
      resolve: (patient) => Patient.listRdv(patient.patientID)
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
  addRdv: t.field({
    type: RendezVousType,
    args: {
      patientID: t.arg.string({ required: true }),
      dateRdv: t.arg.string({ required: true }),
      heureRdv: t.arg.string({ required: true }),
    },
    resolve: (_, args) => Patient.addRdv(args.patientID, args.dateRdv, args.heureRdv),
  }),
  createPatient: t.field({
    type: PatientType,
    args: {
      nom: t.arg.string({ required: true }),
      prenom: t.arg.string({ required: true }),
      dateNaissance: t.arg({ type: 'Date', required: true }),
      email: t.arg.string({ required: true }),
      telephone: t.arg.string({ required: true }),
      numeroSecu: t.arg.string({ required: true }),
    },
    resolve: (_, args) => Patient.create(args.nom, args.prenom, args.dateNaissance, args.email, args.telephone, args.numeroSecu),
  }),
}))
