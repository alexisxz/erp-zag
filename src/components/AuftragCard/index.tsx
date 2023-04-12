import { anfragenStatus, auftragStatus } from "@/data/parameters";
import { Auftrag } from "@/types/Auftrag";
import { useState } from "react";
import { convertFirestoreDate } from "../../helpers/convertFirestoreDate";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

type Props = {
  auftrag: Auftrag;
  refetch: () => void;
};

export const AuftragCard = ({ auftrag, refetch }: Props) => {
  const [editExtend, setEditExtend] = useState<boolean>(false);
  const [updatedAuftrag, setUpdatedAuftrag] = useState<Auftrag>(auftrag);

  const handleOnSubmit = async () => {
    await updateDoc(doc(db, "auftrag", auftrag.id), updatedAuftrag);
    await updateDoc(doc(db, "anfragen", auftrag.anfragenId), {
      auftragStatus: updatedAuftrag.auftragStatus,
      reason: updatedAuftrag.reason,
      deliveryDate: updatedAuftrag.deliveryDate,
    });
    refetch();
    alert("Daten hinzugefügt");
  };

  return (
    <>
      {/* Card */}
      <div
        className="bg-gray-800 p-4 rounded-t-lg flex flex-col gap-4 hover:border hover:bg-transparent hover:cursor-pointer"
        onClick={() => setEditExtend(!editExtend)}
      >
        {/* Header */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col ">
            <span className="text-xs font-semibold">Code:</span>
            <span>{auftrag.code}</span>
          </div>
          <div className="flex flex-col ">
            <span className="text-xs font-semibold">Mitarbeiten:</span>
            <span>{auftrag.requestedUserName}</span>
          </div>
          <div className="flex flex-col ">
            <span className="text-xs font-semibold">Anfragedatum:</span>
            <span>
              {convertFirestoreDate(auftrag.anfragenDate, "inString")}
            </span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-xs font-semibold">Beschreibung:</span>
            <span>{auftrag.description}</span>
          </div>
        </div>
        {/* Line 1 */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col ">
            <span className="text-xs font-semibold">Firma:</span>
            <span>{auftrag.supplierName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Bestellnummer:</span>
            <span>{auftrag.supplierPartNumber}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Benotig:</span>
            <span>{auftrag.orderedQuantity}</span>
          </div>
          <div className="flex flex-col ">
            <span className="text-xs font-semibold">Gew. Lieferdatum:</span>
            <span>
              {convertFirestoreDate(auftrag.desiredDeliveryDate, "inString")}
            </span>
          </div>
          <div className="flex flex-col ">
            <span className="text-xs font-semibold">Kunde:</span>
            <span>{auftrag.customer}</span>
          </div>
          <div className="flex flex-col ">
            <span className="text-xs font-semibold">Verwendung:</span>
            <span>{auftrag.useProprosal}</span>
          </div>
        </div>
      </div>
      {/* Status div */}
      <div>
        {updatedAuftrag.auftragStatus === "in Bearbeitung" ? (
          <div className="bg-yellow-800 p-2">
            {updatedAuftrag.auftragStatus.charAt(0).toUpperCase() +
              updatedAuftrag.auftragStatus.slice(1)}
          </div>
        ) : updatedAuftrag.auftragStatus === "fertig" ? (
          <div className="bg-green-800 p-2">
            {updatedAuftrag.auftragStatus.charAt(0).toUpperCase() +
              updatedAuftrag.auftragStatus.slice(1)}
          </div>
        ) : updatedAuftrag.auftragStatus === "annulliert" ? (
          <div className="bg-red-800 p-2">
            {updatedAuftrag.auftragStatus.charAt(0).toUpperCase() +
              updatedAuftrag.auftragStatus.slice(1)}
          </div>
        ) : (
          <div className="bg-white text-black p-2">
            {updatedAuftrag.auftragStatus.charAt(0).toUpperCase() +
              updatedAuftrag.auftragStatus.slice(1)}
          </div>
        )}
      </div>
      {/* Extend Edit Card */}
      {!editExtend ? null : (
        <div className="p-4 bg-gray-500 rounded-b-lg flex flex-col items-center lg:flex-row gap-4 flex-wrap">
          <div className="flex flex-col gap-2 items-center flex-wrap">
            <span className="text-xs font-semibold">status:</span>
            <select
              required
              value={updatedAuftrag.reason}
              onChange={(e) =>
                setUpdatedAuftrag({
                  ...updatedAuftrag,
                  reason: e.currentTarget.value,
                })
              }
              className="text-black px-2 break-words max-w-xs lg:max-w-none"
            >
              {anfragenStatus.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs font-semibold">Auftragstatus:</span>
            <select
              required
              value={updatedAuftrag.auftragStatus}
              onChange={(e) =>
                setUpdatedAuftrag({
                  ...updatedAuftrag,
                  auftragStatus: e.currentTarget.value,
                })
              }
              className="text-black px-2"
            >
              {auftragStatus.map((item) => {
                return (
                  <option value={item} key={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs font-semibold">invoice:</span>
            <input
              className="px-4 text-black"
              type="text"
              value={updatedAuftrag.invoice}
              onChange={(e) =>
                setUpdatedAuftrag({
                  ...updatedAuftrag,
                  invoice: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs font-semibold">Lieferdatum:</span>
            <input
              className="px-4 text-black"
              type="date"
              defaultValue={
                updatedAuftrag.deliveryDate === auftrag.deliveryDate
                  ? convertFirestoreDate(updatedAuftrag.deliveryDate)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                setUpdatedAuftrag({
                  ...updatedAuftrag,
                  deliveryDate: new Date(e.target.value),
                })
              }
            />
          </div>
          {/* button */}
          <div>
            <button className="btn btn-sm" onClick={() => handleOnSubmit()}>
              Weiter
            </button>
          </div>
        </div>
      )}
    </>
  );
};
