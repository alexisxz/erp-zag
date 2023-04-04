import { Anfragen } from "@/types/Anfragen";
import { useState } from "react";
import { AnfragenEditForm } from "../AnfragenEditForm";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";

type Props = {
  anfragen: Anfragen;
};

export const AnfragenCard = ({ anfragen }: Props) => {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  return (
    <div>
      {/* Edit Form */}
      {!showPopUp ? null : (
        <div>
          <AnfragenEditForm anfragen={anfragen} setShowPopUp={setShowPopUp} />
        </div>
      )}
      {/* CARD */}
      <div
        className="flex flex-col gap-4 flex-wrap bg-gray-800 p-4 rounded-lg hover:border hover:bonder-[#F28B00] hover:bg-transparent hover:cursor-pointer"
        onClick={() => {
          anfragen.auftragStatus !== "nicht erstellt"
            ? alert("Auftrag bereits erstellt")
            : setShowPopUp(true);
        }}
      >
        {/* Infos */}
        <div className="flex gap-4 flex-wrap items-center ">
          <div className="p-4 bg-[#0f172a] self-start rounded-full code-div">
            <h3 className="h3">{anfragen.code}</h3>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs">Firma</span>
            <span>{anfragen.supplierName}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs">Bestellnummer</span>
            <span>{anfragen.supplierPartNumber}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs">Benotig</span>
            <span>{anfragen.orderedQuantity}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs">Auftrag Status</span>
            <span>{anfragen.auftragStatus}</span>
          </div>
          {!anfragen.deliveryDate ? null : (
            <div className="flex flex-col justify-center">
              <span className="text-xs">Lieferdatum</span>
              <span>
                {convertFirestoreDate(anfragen.deliveryDate, "inString")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
