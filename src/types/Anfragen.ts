// first form to fill up the auftrag
// anfragen01 - create new anfrag
// anfragen02 - edit anfrag if there is no auftrag for this anfrag created
// anfragen03 - view all anfrages

export type Anfragen = {
  id: string;
  code: number; // auto generated
  date: Date; // auto generated
  description: string; // Beschreibung
  orderedQuantity: number; // Benotig
  supplierName: string; // Firma
  supplierPartNumber: string; // Bestellnummer
  useProprosal: string; // Verwendung
  customer: string; // Kunde
  desiredDeliveryDate: Date; // Gew. Lieferdatum
  userId: string; // useId
  userName: string;
  auftragId?: string;
  reason: string; // status
  auftragStatus: string; // can be changed in auftrag
  // come from auftrag
  deliveryDate?: Date;
  invoice?: string;
};
