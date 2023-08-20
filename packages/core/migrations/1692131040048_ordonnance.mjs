import { Kysely } from "kysely"

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("ordonnance")
    .addColumn("ordonnanceID", "text", (col) => col.primaryKey())
    .addColumn("patientID", "text", (col) => col.notNull())
    .addColumn("text", "text", (col) => col.notNull())
    .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("ordonnance").execute()
}
