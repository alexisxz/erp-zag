import { useAuth } from "@/context/AuthContext";
import { customers, anfragenStatus } from "@/data/parameters";
import { db } from "@/firebase/config";
import { Anfragen } from "@/types/Anfragen";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useState } from "react";
import toast, { Toaster, ToastBar } from "react-hot-toast";

const initialAnfragenData: Omit<Anfragen, "id"> = {
  code: 0,
  date: new Date(),
  description: "",
  orderedQuantity: 0,
  supplierName: "",
  supplierPartNumber: "",
  useProprosal: "",
  customer: "",
  desiredDeliveryDate: new Date(),
  reason: "",
  userId: "",
  userName: "",
  auftragStatus: "nicht erstellt",
};

type Props = {
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

export const AnfragenForm = ({ setShowPopUp, refetch }: Props) => {
  const { userProfile } = useAuth();
  const [anfragenData, setAnfragenData] =
    useState<Omit<Anfragen, "id">>(initialAnfragenData);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Toaster
    toast.success("Daten hinzugefügt");

    // get quantity to be the next code
    const anfragenQtd: number[] = (
      await getDocs(collection(db, "anfragen"))
    ).docs.map((item) => item.data().code);

    // creating the whole anfragen
    const addAnfragen: Omit<Anfragen, "id"> = {
      ...anfragenData,
      code: Math.max(...anfragenQtd) + 1,
      date: new Date(),
      userId: userProfile.id,
      userName: userProfile.username,
    };

    // add the new anfragen to the database
    await setDoc(doc(collection(db, "anfragen")), addAnfragen);

    // reset the form
    setAnfragenData(initialAnfragenData);

    // update the anfragen
    refetch();
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
      {/* FORM */}
      <div className="z-50 fixed h-full w-full backdrop-blur-sm flex flex-col items-center justify-center top-0 left-0">
        {/* Form Header */}
        <div className="bg-[#F28B00] flex gap-4 justify-around items-center py-2 px-4 rounded-t-lg shadow-lg shadow-black">
          <div>
            <h2 className="h2">Anfragen Form</h2>
          </div>
          <div>
            <button onClick={() => setShowPopUp(false)}>❌</button>
          </div>
        </div>
        {/* Form */}
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col p-4 lg:max-w-none max-w-sm gap-4 rounded-lg bg-gray-500"
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
                <option value=""></option>
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
                className="text-black px-2 max-w-[100px]"
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
                required
                type="date"
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
                value={anfragenData.reason}
                onChange={(e) =>
                  setAnfragenData({
                    ...anfragenData,
                    reason: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              >
                <option value=""></option>
                {anfragenStatus.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
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
