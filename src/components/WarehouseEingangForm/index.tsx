import { useAuth } from "@/context/AuthContext";
import { customers, anfragenStatus, warehouses } from "@/data/parameters";
import { app, db } from "@/firebase/config";
import { Anfragen } from "@/types/Anfragen";
import { User } from "@/types/User";
import { Warehouse } from "@/types/Warehouse";
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialWarehouseData: Warehouse = {
  date: new Date(),
  action: "eingang",
  materialDescription: "",
  quantity: 0,
  shelf: "",
  supplierName: "",
  supplierPartNumber: "",
  warehouse: "R103-S3-F1",
  userId: "",
};

type Props = {
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

export const WarehouseEingangForm = ({ setShowPopUp, refetch }: Props) => {
  const { userProfile } = useAuth();
  const [warehouseData, setWarehouseData] =
    useState<Warehouse>(initialWarehouseData);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get the current date to be the date of the anfragen
    const warehouseDate = new Date();

    // creating the whole anfragen
    const addWarehouse: Warehouse = {
      ...warehouseData,
      date: warehouseDate,
      userId: userProfile.id ? userProfile.id : "",
    };

    // add the new anfragen to the database
    await setDoc(doc(collection(db, "warehouse")), addWarehouse);

    // reset the form
    setWarehouseData(initialWarehouseData);

    // refetch data
    refetch();

    alert("Daten hinzugefügt");
  };

  return (
    <div className="z-50 fixed h-full w-full backdrop-blur-sm flex flex-col items-center justify-center top-0 left-0">
      {/* Form Header */}
      <div className="bg-[#F28B00] flex gap-4 justify-around items-center py-2 px-4 rounded-t-lg shadow-lg shadow-black">
        <div>
          <h2 className="h2">Eingang Form</h2>
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
              value={warehouseData.materialDescription}
              onChange={(e) =>
                setWarehouseData({
                  ...warehouseData,
                  materialDescription: e.currentTarget.value,
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
              value={warehouseData.supplierName}
              onChange={(e) =>
                setWarehouseData({
                  ...warehouseData,
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
              value={warehouseData.supplierPartNumber}
              onChange={(e) =>
                setWarehouseData({
                  ...warehouseData,
                  supplierPartNumber: e.currentTarget.value.toUpperCase(),
                })
              }
              className="text-black px-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm">Eingabemenge</span>
            <input
              required
              type="number"
              value={warehouseData.quantity}
              onChange={(e) =>
                setWarehouseData({
                  ...warehouseData,
                  quantity: +e.currentTarget.value,
                })
              }
              className="text-black px-2"
            />
          </div>
        </div>
        {/* Line 3 */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-sm">Lagerort</span>
            <select
              required
              value={warehouseData.warehouse}
              defaultValue={"R103-S3-F1"}
              onChange={(e) =>
                setWarehouseData({
                  ...warehouseData,
                  warehouse: e.currentTarget.value,
                })
              }
              className="text-black"
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse} value={warehouse}>
                  {warehouse}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm">Genau</span>
            <input
              required
              type="text"
              value={warehouseData.shelf}
              onChange={(e) =>
                setWarehouseData({
                  ...warehouseData,
                  shelf: e.currentTarget.value
                    .replace(/[^a-z]/gi, "")
                    .toUpperCase(),
                })
              }
              className="text-black px-2"
            />
          </div>
          {warehouseData.warehouse !== "Sonstige" ? null : (
            <div className="flex flex-col gap-1">
              <span className="text-sm">Optionales Lagerort</span>
              <input
                required
                type="string"
                onChange={(e) =>
                  setWarehouseData({
                    ...warehouseData,
                    optionalWarehouse: e.currentTarget.value,
                  })
                }
                className="text-black px-2"
              />
            </div>
          )}
        </div>
        {/* button */}
        <div className="flex justify-end">
          <button className="btn btn-sm" type="submit">
            Weiter
          </button>
        </div>
      </form>
    </div>
  );
};
