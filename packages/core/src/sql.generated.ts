import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Ordonnance {
  ordonnanceID: string;
  patientID: string;
  text: string;
}

export interface Patient {
  patientID: string;
  email: string;
  numeroSecu: string;
  created: Generated<Timestamp>;
}

export interface RendezVous {
  rdvID: string;
  dateRdv: Timestamp;
  heureRdv: string;
  patientID: string;
  created: Generated<Timestamp>;
}

export interface Database {
  ordonnance: Ordonnance;
  patient: Patient;
  rendez_vous: RendezVous;
}
