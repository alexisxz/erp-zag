// first form to fill up the auftrag
// anfragen01 - create new anfrag
// anfragen02 - edit anfrag if there is no auftrag for this anfrag created
// anfragen03 - view all anfrages

import { Material } from "./Material";

export type Anfragen = {
  id: string;
  code: number; // auto generated
  date: Date; // auto generated
  materials: Material[];
  useProprosal: string; // Verwendung
  customer: string; // Kunde
  desiredDeliveryDate: Date | string; // Gew. Lieferdatum
  userId: string; // useId
  userName: string;
  auftragId?: string;
  reason: string; // status
  auftragStatus: string; // can be changed in auftrag
  // come from auftrag
  deliveryDate?: Date;
  invoice?: string;
};
