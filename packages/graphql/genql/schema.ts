// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Date: any,
    String: string,
    ID: string,
    Boolean: boolean,
}

export interface Mutation {
    addOrdonnance: Ordonnance
    addRdv: RendezVous
    createPatient: Patient
    deletePatient: (Patient | null)
    updateDateRdv: RendezVous
    updateHourRdv: RendezVous
    __typename: 'Mutation'
}

export interface Ordonnance {
    id: Scalars['ID']
    text: Scalars['String']
    __typename: 'Ordonnance'
}

export interface Patient {
    dateNaissance: Scalars['Date']
    email: Scalars['String']
    id: Scalars['ID']
    nom: Scalars['String']
    numeroSecu: (Scalars['String'] | null)
    ordonnances: Ordonnance[]
    prenom: Scalars['String']
    rendezVous: RendezVous[]
    telephone: Scalars['String']
    __typename: 'Patient'
}

export interface Query {
    patient: Patient
    patients: Patient[]
    __typename: 'Query'
}

export interface RendezVous {
    dateRdv: Scalars['String']
    heureRdv: Scalars['String']
    id: Scalars['ID']
    __typename: 'RendezVous'
}

export interface MutationGenqlSelection{
    addOrdonnance?: (OrdonnanceGenqlSelection & { __args: {patientID: Scalars['String'], text: Scalars['String']} })
    addRdv?: (RendezVousGenqlSelection & { __args: {dateRdv: Scalars['String'], heureRdv: Scalars['String'], patientID: Scalars['String']} })
    createPatient?: (PatientGenqlSelection & { __args: {dateNaissance: Scalars['Date'], email: Scalars['String'], nom: Scalars['String'], numeroSecu?: (Scalars['String'] | null), prenom: Scalars['String'], telephone: Scalars['String']} })
    deletePatient?: (PatientGenqlSelection & { __args: {id: Scalars['String']} })
    updateDateRdv?: (RendezVousGenqlSelection & { __args: {newDate: Scalars['String'], rdvID: Scalars['String']} })
    updateHourRdv?: (RendezVousGenqlSelection & { __args: {newHour: Scalars['String'], rdvID: Scalars['String']} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface OrdonnanceGenqlSelection{
    id?: boolean | number
    text?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PatientGenqlSelection{
    dateNaissance?: boolean | number
    email?: boolean | number
    id?: boolean | number
    nom?: boolean | number
    numeroSecu?: boolean | number
    ordonnances?: OrdonnanceGenqlSelection
    prenom?: boolean | number
    rendezVous?: RendezVousGenqlSelection
    telephone?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    patient?: (PatientGenqlSelection & { __args: {patientID: Scalars['String']} })
    patients?: PatientGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RendezVousGenqlSelection{
    dateRdv?: boolean | number
    heureRdv?: boolean | number
    id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const Ordonnance_possibleTypes: string[] = ['Ordonnance']
    export const isOrdonnance = (obj?: { __typename?: any } | null): obj is Ordonnance => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrdonnance"')
      return Ordonnance_possibleTypes.includes(obj.__typename)
    }
    


    const Patient_possibleTypes: string[] = ['Patient']
    export const isPatient = (obj?: { __typename?: any } | null): obj is Patient => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPatient"')
      return Patient_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const RendezVous_possibleTypes: string[] = ['RendezVous']
    export const isRendezVous = (obj?: { __typename?: any } | null): obj is RendezVous => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRendezVous"')
      return RendezVous_possibleTypes.includes(obj.__typename)
    }
    