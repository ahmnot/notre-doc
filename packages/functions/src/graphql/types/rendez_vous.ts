import { RendezVous } from "@notre-doc/core/rendez_vous"
import { SQL } from "@notre-doc/core/sql"
import { builder } from "../builder"

const RendezVousType = builder.objectRef<SQL.Row["rendez_vous"]>("RendezVous").implement({
    fields: (t) => ({
        id: t.exposeID("rdvID"),
        dateRdv: t.exposeString("dateRdv"),
        heureRdv: t.exposeString("heureRdv"),
    })
})

builder.mutationFields((t) => ({
  updateDateRdv: t.field({
    type: RendezVousType,
    args: {
      rdvID: t.arg.string({ required: true }),
      newDate: t.arg.string({ required: true }),
    },
    resolve: (_, args) => RendezVous.updateDateRdv(args.rdvID, args.newDate),
  }),
  updateHourRdv: t.field({
    type: RendezVousType,
    args: {
      rdvID: t.arg.string({ required: true }),
      newHour: t.arg.string({ required: true }),
    },
    resolve: (_, args) => RendezVous.updateDateRdv(args.rdvID, args.newHour),
  })
}))