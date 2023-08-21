import { Kysely, sql } from "kysely"

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("rendez_vous")
    .addColumn("rdvID", "text", (col) => col.primaryKey())
    .addColumn("dateRdv", "date", (col) => col.notNull())
    .addColumn("heureRdv", "time", (col) => col.notNull())
    .addColumn("created", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("patientID", "text", (col) => col.notNull())
    .execute()

  await db.schema.createIndex("idx_rdv_created").on("rendez_vous").column("created").execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropIndex("idx_rdv_created").execute()
  await db.schema.dropTable("rendez_vous").execute()
}
