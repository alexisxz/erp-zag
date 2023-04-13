import { useAuth } from "@/context/AuthContext";
import { anfragenStatus } from "@/data/parameters";
import { db } from "@/firebase/config";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { Anfragen } from "@/types/Anfragen";
import { Auftrag } from "@/types/Auftrag";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import toast, { Toaster, ToastBar } from "react-hot-toast";

type Props = {
  setSelectedAnfragen: React.Dispatch<React.SetStateAction<null | Anfragen>>;
  selectedAnfragen: Anfragen;
  refetch: () => void;
  refetchAnfragen: () => void;
};

export const AuftragForm = ({
  setSelectedAnfragen,
  selectedAnfragen,
  refetch,
  refetchAnfragen,
}: Props) => {
  const { userProfile } = useAuth();
  const [anfragenData, setAnfragenData] = useState<Anfragen>(selectedAnfragen);
  const [auftragData, setAuftragData] = useState<Omit<Auftrag, "id">>({
    code: anfragenData.code,
    anfragenDate: convertFirestoreDate(anfragenData.date),
    description: anfragenData.description,
    orderedQuantity: anfragenData.orderedQuantity,
    supplierName: anfragenData.supplierName,
    supplierPartNumber: anfragenData.supplierPartNumber,
    useProprosal: anfragenData.useProprosal,
    customer: anfragenData.customer,
    desiredDeliveryDate: convertFirestoreDate(anfragenData.desiredDeliveryDate),
    reason: anfragenData.reason,
    auftragStatus: "in Bearbeitung",
    anfragenId: anfragenData.id,
    requestedUserName: anfragenData.userName,
    createdAt: new Date(),
    userId: userProfile.id,
    username: userProfile.username,
  });

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Toaster
    toast.success("Daten hinzugefügt");

    // add the new auftrag to the database
    await setDoc(doc(collection(db, "auftrag")), auftragData);

    // change the anfragen
    await updateDoc(doc(db, "anfragen", anfragenData.id), {
      reason: auftragData.reason,
      auftragStatus: "in Bearbeitung",
      deliveryDate: auftragData.deliveryDate,
    });

    // reset the form
    setSelectedAnfragen(null);

    // refetch data
    refetch();
    refetchAnfragen();
  };

  return (
    <>
      {/* TOASTER */}
      <div>
        <Toaster reverseOrder={false} position="top-center">
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== "loading" && (
                    <button onClick={() => toast.dismiss(t.id)}>❌</button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>
      </div>
      <div className="z-50 fixed h-full w-full backdrop-blur-sm flex flex-col items-center justify-center top-0 left-0">
        {/* Form Header */}
        <div className="bg-[#F28B00] flex gap-4 justify-around items-center py-2 px-4 shadow-lg shadow-black rounded-t-lg">
          <div>
            <h2 className="h2 flex flex-col items-center">
              Auftrag Form{" "}
              <span className="text-xs">
                Anfrage code {anfragenData.code} bei {anfragenData.userName}
              </span>
            </h2>
          </div>
          <div>
            <button onClick={() => setSelectedAnfragen(null)}>❌</button>
          </div>
        </div>
        {/* Form */}
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col p-4 gap-4 rounded-lg bg-gray-500 max-w-sm lg:max-w-none"
        >
          {/* Line 1 */}
          <div>
            <div className="flex flex-col">
              <span className="text-sm">Beschreibung</span>
              <span>{anfragenData.description}</span>
            </div>
          </div>
          {/* Line 2 */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sm">Firma</span>
              <span>{anfragenData.supplierName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Bestellnummer</span>
              <span>{anfragenData.supplierPartNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Benotig</span>
              <span>{anfragenData.orderedQuantity}</span>
            </div>
          </div>
          {/* Line 3 */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sm">Kunde</span>
              <span>{anfragenData.customer}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Verwendung</span>
              <span>{anfragenData.useProprosal}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Gew. Lierferdatum</span>
              <span>
                {convertFirestoreDate(
                  anfragenData.desiredDeliveryDate,
                  "inString"
                )}
              </span>
            </div>
          </div>
          {/* line 4 */}
          <div>
            <div className="flex flex-col">
              <span className="text-sm">Status</span>
              <select
                required
                value={auftragData.reason}
                onChange={(e) =>
                  setAuftragData({
                    ...auftragData,
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
          {/* line 5 */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sm">Invoice</span>
              <input
                type="string"
                onChange={(e) =>
                  setAuftragData({
                    ...auftragData,
                    invoice: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              />
              <div className="flex flex-col">
                <span className="text-sm">Lieferdatum</span>
                <input
                  required
                  type="date"
                  onChange={(e) =>
                    setAuftragData({
                      ...auftragData,
                      deliveryDate: new Date(e.currentTarget.value),
                    })
                  }
                  className="text-black px-2"
                />
              </div>
            </div>
          </div>
          {/* button */}
          <div className="flex justify-end">
            <button className="btn btn-sm" type="submit">
              Weiter
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
