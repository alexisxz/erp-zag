// reference DB for anfragen and auftrag
// auftrag01 - create auftrag
// auftrag02 - edit auftrag
// auftrag03 - view all auftrags

import { Material } from "./Material";
import { User } from "./User";

export type Auftrag = {
  //comes from anfragen
  id: string;
  code: number; // comes from code of anfragen
  anfragenDate: Date; // comes from date of anfragen
  materials: Material[];
  useProprosal: string; // comes from anfragen
  customer: string; // comes from anfragen
  desiredDeliveryDate: Date; // comes from anfragen
  reason: string; // comes from anfragen // Ursache
  auftragStatus: string; // status, but we can change
  anfragenId: string; // comes from anfragen
  requestedUserName: string; // comes from anfragen
  // auftrag process
  createdAt: Date; // AuftrageDatum - auto generated
  userId: string; // comes from anfragen
  userName: string; // comes from userProfile
  deliveryDate?: Date; //Lieferzeit
  invoice?: string; // Kundenbestell
};
