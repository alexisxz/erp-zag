import { customers, anfragenStatus } from "@/data/parameters";
import { db } from "@/firebase/config";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { Anfragen } from "@/types/Anfragen";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  anfragen: Anfragen;
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AnfragenEditForm = ({ anfragen, setShowPopUp }: Props) => {
  const router = useRouter();
  const [anfragenData, setAnfragenData] = useState<Anfragen>(anfragen);
  const [deletePopUp, setDeletePopUp] = useState<boolean>(false);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (deletePopUp === true) return;

    if (!anfragen.id) return alert("ERROR: Bitte schließen und wieder öffnen");

    const anfragenRef = doc(db, "anfragen", anfragen.id);

    await updateDoc(anfragenRef, anfragenData);

    return alert("Daten aktualisiert");
  };

  const handleOnDelete = () => {
    if (!anfragen.id) return alert("ERROR: Bitte schließen und wieder öffnen");

    deleteDoc(doc(db, "anfragen", anfragen.id));
    alert("gelöscht");
    setDeletePopUp(false);
    setShowPopUp(false);
  };

  return (
    <>
      {/* Delet PopUp */}
      {!deletePopUp ? null : (
        <div className="z-[51] top-0 left-0 fixed h-full w-full backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-600 rounded-lg flex flex-col flex-wrap gap-4 max-w-sm lg:max-w-none text-center">
            <div>
              <p>
                Wenn Sie löschen, ist eine Wiederherstellung danach nicht
                möglich. Möchten Sie fortfahren?
              </p>
            </div>
            <div className="ml-auto flex gap-4">
              <button
                onClick={handleOnDelete}
                className="bg-red-400 w-20 hover:opacity-80"
              >
                Ja
              </button>
              <button
                onClick={() => setDeletePopUp(false)}
                className="bg-green-400 w-20 hover:opacity-80"
              >
                Nein
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FORM */}
      <div className="z-50 top-0 left-0 fixed h-full w-full backdrop-blur-sm flex flex-col items-center justify-center">
        {/* Form Header */}
        <div className="bg-[#F28B00] flex gap-4 justify-around items-center py-2 px-4 rounded-t-lg shadow-lg shadow-black">
          <div>
            <h2 className="h2">Edit Anfragen - {anfragen.code}</h2>
          </div>
          <div>
            <button onClick={() => setShowPopUp(false)}>❌</button>
          </div>
        </div>
        {/* Form */}
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col p-4 gap-4 rounded-lg bg-gray-500 max-w-sm lg:max-w-none"
        >
          {/* Line 1 */}
          <div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Beschreibung</span>
              <input
                required
                type="text"
                value={anfragenData.description}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    description: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              />
            </div>
          </div>
          {/* Line 2 */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Firma</span>
              <select
                required
                value={anfragenData.supplierName}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    supplierName: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              >
                {customers.map((customer) => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Bestellnummer</span>
              <input
                required
                type="text"
                value={anfragenData.supplierPartNumber}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    supplierPartNumber: e.currentTarget.value.toUpperCase(),
                  })
                }
                className="text-black px-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Benotig</span>
              <input
                required
                type="number"
                value={anfragenData.orderedQuantity}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    orderedQuantity: +e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              />
            </div>
          </div>
          {/* Line 3 */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Kunde</span>
              <input
                required
                type="text"
                value={anfragenData.customer}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    customer: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Verwendung</span>
              <input
                required
                type="text"
                value={anfragenData.useProprosal}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    useProprosal: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Gew. Lierferdatum</span>
              <input
                type="date"
                defaultValue={
                  anfragenData.desiredDeliveryDate ===
                  anfragen.desiredDeliveryDate
                    ? convertFirestoreDate(anfragen.desiredDeliveryDate)
                        .toISOString()
                        .substring(0, 10)
                    : ""
                }
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    desiredDeliveryDate: new Date(e.currentTarget.value),
                  })
                }
                className="text-black px-2"
              />
            </div>
          </div>
          {/* line 4 */}
          <div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Status</span>
              <select
                required
                value={anfragenData.reason}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    reason: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              >
                {anfragenStatus.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* button */}
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-sm bg-green-400 hover:bg-green-900"
              type="submit"
            >
              Weiter
            </button>
            <button
              className="btn btn-sm bg-red-400 hover:bg-red-900"
              onClick={() => setDeletePopUp(true)}
            >
              Löschen
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
