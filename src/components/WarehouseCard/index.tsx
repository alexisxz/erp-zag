import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { Warehouse } from "@/types/Warehouse";

type Props = {
  warehouse: Warehouse;
};

export const WarehouseCard = ({ warehouse }: Props) => {
  return (
    <div className="flex p-4 gap-4 bg-gray-800 rounded-lg flex-wrap">
      <div className="flex lg:flex-col items-center gap-2">
        <span className="text-sm font-semibold">Aktion:</span>
        <span>{warehouse.action.toUpperCase()}</span>
      </div>
      <div className="flex lg:flex-col items-center gap-2">
        <span className="text-sm font-semibold">Warehouse:</span>
        <span>{warehouse.warehouse}</span>
      </div>
      <div className="flex lg:flex-col items-center gap-2">
        <span className="text-sm font-semibold">Genau:</span>
        <span>{warehouse.shelf}</span>
      </div>
      <div className="flex lg:flex-col items-center gap-2">
        <span className="text-sm font-semibold">Date:</span>
        <span>{convertFirestoreDate(warehouse.date, "inString")}</span>
      </div>
      <div className="flex lg:flex-col items-center gap-2 flex-1">
        <span className="text-sm font-semibold">Bestellnummer:</span>
        <span>{warehouse.supplierPartNumber}</span>
      </div>
      <div className="flex lg:flex-col items-center gap-2">
        <span className="text-sm font-semibold">Firma:</span>
        <span>{warehouse.supplierName}</span>
      </div>
      <div className="flex lg:flex-col items-center gap-2">
        <span className="text-sm font-semibold">Eingabemenge:</span>
        <span>{warehouse.quantity}</span>
      </div>
    </div>
  );
};
