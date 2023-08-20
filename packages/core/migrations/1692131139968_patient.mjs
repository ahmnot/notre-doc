import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("patient")
    .addColumn("patientID", "text", (col) => col.primaryKey())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("numeroSecu", "text", (col) => col.notNull())
    .addColumn("created", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createIndex("idx_patient_created")
    .on("patient")
    .column("created")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropIndex("idx_patient_created").execute();
  await db.schema.dropTable("patient").execute();
}
