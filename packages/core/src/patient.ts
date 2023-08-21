export * as Patient from "./patient"

import { ulid } from "ulid"
import { SQL } from "./sql"

export async function create(email: string, numeroSecu: string) {
  const [result] = await SQL.DB.insertInto("patient")
    .values({ patientID: ulid(), email, numeroSecu })
    .returningAll()
    .execute()
  return result
}

export function get(patientID: string) {
  return SQL.DB.selectFrom("patient")
    .selectAll()
    .where("patientID", "=", patientID)
    .executeTakeFirst()
}

export function list() {
  return SQL.DB.selectFrom("patient")
    .selectAll()
    .orderBy("created", "desc")
    .execute()
}

export function addOrdonnance(patientID: string, text: string) {
  return SQL.DB.insertInto("ordonnance").values({
    ordonnanceID: ulid(),
    patientID,
    text
  })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export function ordonnances(patientID: string) {
  return SQL.DB.selectFrom("ordonnance")
    .selectAll()
    .where("patientID", "=", patientID)
    .execute()
}

export function addRdv(patientID: string, dateRdv: string, heureRdv: string) {
  return SQL.DB.insertInto("rendez_vous").values({
    rdvID: ulid(),
    dateRdv,
    heureRdv,
    patientID
  })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export function listRdv(patientID: string) {
  return SQL.DB.selectFrom("rendez_vous")
    .selectAll()
    .where("patientID", "=", patientID)
    .execute()
}