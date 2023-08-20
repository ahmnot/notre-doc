import { ulid } from "ulid"

// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map<string, [Patient]>()

export type Patient = {
    id: string,
    nom: string,
    prenom: string,
    dateNaissance: string,
    email: string,
    numeroSecu: string
}

export function getPatients(userid: string) {

    if (!db.get(userid)) {
        db.set(userid, [{
            id: ulid(),
            nom: 'Dupont',
            prenom: 'Michel',
            dateNaissance: '30/07/1978',
            email: 'toto@gmail.com',
            numeroSecu: '123456789012345',
        }])
    }

    return db.get(userid)
}

export function createPatient(userid: string, data: { [k: string]: FormDataEntryValue }) {
    if (!userid || typeof userid != 'string') {
        throw new Error("L'identifiant de l'utilisateur doit être valorisé.")
    }

    const patients = db.get(userid)

    const nom = data.nom.toString()
    const prenom = data.prenom.toString()
    const dateNaissance = data.dateNaissance.toString()
    const email = data.email.toString()
    const numeroSecu = data.numeroSecu.toString()

    if (!patients) {
        throw new Error("Il doit y avoir une liste des patients.")
    }

    const nouveauPatient: Patient = {
        id: ulid(),
        nom,
        prenom,
        dateNaissance,
        email,
        numeroSecu
    }

    patients.push(nouveauPatient)
}

export function deletePatient(userid: string, patientid: string) {
    const patients = db.get(userid)

    if (!patients) {
        throw new Error("Il doit y avoir une liste des patients.")
    }

    const index = patients.findIndex((patient: any) => patient.id === patientid)

    if (index !== -1) {
        patients.splice(index, 1)
    }
}
