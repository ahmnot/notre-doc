// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    String: string,
    ID: string,
    Boolean: boolean,
}

export interface Mutation {
    addOrdonnance: Ordonnance
    createPatient: Patient
    __typename: 'Mutation'
}

export interface Ordonnance {
    id: Scalars['ID']
    text: Scalars['String']
    __typename: 'Ordonnance'
}

export interface Patient {
    email: Scalars['String']
    id: Scalars['ID']
    numeroSecu: Scalars['String']
    ordonnances: Ordonnance[]
    __typename: 'Patient'
}

export interface Query {
    patient: Patient
    patients: Patient[]
    __typename: 'Query'
}

export interface MutationGenqlSelection{
    addOrdonnance?: (OrdonnanceGenqlSelection & { __args: {patientID: Scalars['String'], text: Scalars['String']} })
    createPatient?: (PatientGenqlSelection & { __args: {email: Scalars['String'], numeroSecu: Scalars['String']} })
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
    email?: boolean | number
    id?: boolean | number
    numeroSecu?: boolean | number
    ordonnances?: OrdonnanceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    patient?: (PatientGenqlSelection & { __args: {patientID: Scalars['String']} })
    patients?: PatientGenqlSelection
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
    