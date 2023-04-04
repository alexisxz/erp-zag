import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { Anfragen } from "@/types/Anfragen";
import { Auftrag } from "@/types/Auftrag";
import { Warehouse } from "@/types/Warehouse";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

export const exportExcel = async (
  data: any,
  sheetName: string,
  screen: "anfragen" | "auftrag" | "warehouse",
  isAdmin?: boolean
) => {
  if (!data) return;
  let newData: Warehouse[] | Auftrag[] | Anfragen[] | any[] = [];

  // If warehouse export
  if (screen === "warehouse") {
    newData = data.map((item: Warehouse) => ({
      Datum: convertFirestoreDate(item.date),
      Aktion: item.action,
      Beschreibung: item.materialDescription,
      Eingabemenge: item.quantity,
      Lagerort: item.warehouse,
      Optionales_Lagerort: item.optionalWarehouse,
      Genau: item.shelf,
      Firma: item.supplierName,
      Bestellnummer: item.supplierPartNumber,
    }));
  }

  // if Auftrag export
  if (screen === "auftrag") {
    newData = data.map((item: Auftrag) => ({
      Code: item.code,
      Datum: convertFirestoreDate(item.createdAt),
      Beschreibung: item.description,
      Benotig: item.orderedQuantity,
      Firma: item.supplierName,
      Bestellnummer: item.supplierPartNumber,
      Verwendung: item.useProprosal,
      Kunde: item.customer,
      Gew_Lieferdatum: convertFirestoreDate(item.desiredDeliveryDate),
      status: item.reason,
      auftragStatus: item.auftragStatus,
      Anfoderer: item.requestedUserName,
      Lieferdatum: item.deliveryDate
        ? convertFirestoreDate(item.deliveryDate)
        : "",
      invoice: item.invoice ? item.invoice : "",
    }));
  }

  // if Anfragen export
  if (screen === "anfragen") {
    if (isAdmin) {
      const docs = (await getDocs(collection(db, "anfragen"))).docs.map(
        (doc) => ({
          ...doc.data(),
        })
      );
      newData = docs.map((item: any) => ({
        Code: item.code,
        Datum: convertFirestoreDate(item.date),
        Beschreibung: item.description,
        Benotig: item.orderedQuantity,
        Firma: item.supplierName,
        Bestellnummer: item.supplierPartNumber,
        Verwendung: item.useProprosal,
        Kunde: item.customer,
        Gew_Lieferdatum: convertFirestoreDate(item.desiredDeliveryDate),
        status: item.reason,
        auftragStatus: item.auftragStatus,
        Anfoderer: item.userName,
        Lieferdatum: item.deliveryDate
          ? convertFirestoreDate(item.deliveryDate)
          : "",
      }));
    } else {
      newData = data.map((item: Anfragen) => ({
        Code: item.code,
        Datum: convertFirestoreDate(item.date),
        Beschreibung: item.description,
        Benotig: item.orderedQuantity,
        Firma: item.supplierName,
        Bestellnummer: item.supplierPartNumber,
        Verwendung: item.useProprosal,
        Kunde: item.customer,
        Gew_Lieferdatum: convertFirestoreDate(item.desiredDeliveryDate),
        status: item.reason,
        auftragStatus: item.auftragStatus,
        Anfoderer: item.userName,
        Lieferdatum: item.deliveryDate
          ? convertFirestoreDate(item.deliveryDate)
          : "",
      }));
    }
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(newData);

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  XLSX.writeFileXLSX(wb, sheetName);
};
