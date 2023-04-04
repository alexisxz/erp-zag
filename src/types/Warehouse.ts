// inbound and outbound process
// warehouse01 - create inbound or outbound order
// warehouse02 - edit inbound or outbound order by id
// warehouse03 - view all inbound or outbound order
// warehouse04 - view the material stock

import { User } from "./User";

export type Warehouse = {
  id?: string;
  date: Date; //datum
  action: string;
  materialDescription: string; // Beschreibung
  quantity: number; // Eingabemenge
  warehouse: string; //Lagerort
  optionalWarehouse?: string; // Optionales Lagerort
  shelf: string; //Genau
  supplierName: string; // Firma
  supplierPartNumber: string; //Bestellnummer
  userId: string;
};

export type Material = {
  id: string; //supplierPartNumber
  totalQuantity: number; //Eingabemenge
  warehouse: string[]; // warehouse + shelf
};
