import { Warehouse } from "@/types/Warehouse";

export const getUniqueSupplierPartNumber = (warehouses: Warehouse[]) => {
  let uniques: string[] = [];
  if (warehouses.length <= 0) return uniques;
  uniques = [
    ...(new Set(
      warehouses.map((item: Warehouse) => item.supplierPartNumber)
    ) as any),
  ];
  return uniques;
};
