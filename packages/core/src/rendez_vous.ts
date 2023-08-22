export * as RendezVous from "./rendez_vous"

import { SQL } from "./sql"

export function updateDateRdv(rdvID: string, newDate: string) {
    return SQL.DB.updateTable('rendez_vous').set({ dateRdv: newDate }).where('rdvID', '=', rdvID).executeTakeFirst()
}

export function updateHourRdv(rdvID: string, newHour: string) {
    return SQL.DB.updateTable('rendez_vous').set({ heureRdv: newHour }).where('rdvID', '=', rdvID).executeTakeFirst()
}