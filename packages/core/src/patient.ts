export * as Patient from "./patient"

import { ulid } from "ulid"
import { SQL } from "./sql"

export async function createPatient(nom: string, prenom: string, dateNaissance: string, email: string, telephone: string, numeroSecu: string) {
  const [result] = await SQL.DB.insertInto('patient')
    .values({ patientID: ulid(), nom, prenom, dateNaissance, email, telephone, numeroSecu })
    .returningAll()
    .execute()
  return result
}

export function get(patientID: string) {
  return SQL.DB.selectFrom('patient')
    .selectAll()
    .where('patientID', '=', patientID)
    .executeTakeFirst()
}

export function updatePatient(patientID: string, nom: string, prenom: string, dateNaissance: string, email: string, telephone: string, numeroSecu: string) {
  return SQL.DB.updateTable('patient')
  .set({
    nom: nom, 
    prenom: prenom, 
    dateNaissance: dateNaissance, 
    email: email, 
    telephone: telephone, 
    numeroSecu: numeroSecu
  }).where('patientID', '=', patientID)
  .returning('patientID')
  .executeTakeFirstOrThrow()
}

export function deletePatient(patientID: string) {
  return SQL.DB.deleteFrom('patient')
    .where('patientID', '=', patientID)
    .returning('patientID')
    .executeTakeFirstOrThrow()
}

export function list() {
  return SQL.DB.selectFrom('patient')
    .selectAll()
    .orderBy('created', 'desc')
    .execute()
}

export function addOrdonnance(patientID: string, text: string) {
  return SQL.DB.insertInto('ordonnance').values({
    ordonnanceID: ulid(),
    patientID,
    text
  })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export function ordonnances(patientID: string) {
  return SQL.DB.selectFrom('ordonnance')
    .selectAll()
    .where('patientID', '=', patientID)
    .execute()
}

export function addRdv(patientID: string, dateRdv: string, heureRdv: string) {
  return SQL.DB.insertInto('rendez_vous').values({
    rdvID: ulid(),
    dateRdv,
    heureRdv,
    patientID
  })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export function listRdv(patientID: string) {
  return SQL.DB.selectFrom('rendez_vous')
    .selectAll()
    .where('patientID', '=', patientID)
    .execute()
}



