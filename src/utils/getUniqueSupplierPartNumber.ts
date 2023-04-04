import { Warehouse } from "@/types/Warehouse";

export const getUniqueSupplierPartNumber = (warehouses: Warehouse[]) => {
  let uniques: string[] = [];
  if (!warehouses) return uniques;
  uniques = [
    ...new Set(warehouses.map((item: string) => item.supplierPartNumber)),
  ];
  return uniques;
};
