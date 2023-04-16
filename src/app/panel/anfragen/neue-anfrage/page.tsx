"use client";
import { useAuth } from "@/context/AuthContext";
import { anfragenStatus, customers } from "@/data/parameters";
import { db } from "@/firebase/config";
import { Anfragen } from "@/types/Anfragen";
import { Material } from "@/types/Material";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastBar, Toaster, toast } from "react-hot-toast";

const initialAnfragenData: Omit<Anfragen, "id"> = {
  code: 0,
  date: new Date(),
  materials: [],
  useProprosal: "",
  customer: "",
  desiredDeliveryDate: new Date(),
  reason: "",
  userId: "",
  userName: "",
  auftragStatus: "nicht erstellt",
};

export default function NeueAnfrage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [anfragenData, setAnfragenData] =
    useState<Omit<Anfragen, "id">>(initialAnfragenData);
  const [newMaterial, setNewMaterial] = useState<Material>({
    supplierPartNumber: "",
    quantity: 0,
    description: "",
    supplierName: "",
  });
  const [materials, setMaterials] = useState<Material[]>([]);

  // To validate Screen
  useEffect(() => {
    if (!userProfile) return;

    const validateScreen = !!userProfile.screens.find(
      (screen: string) => screen === "anfragen" || screen === "admin"
    );

    if (!validateScreen) {
      alert("Sie haben keinen Zugriff auf den Bildschirm");
      return router.push("panel");
    }
  }, [router, userProfile]);

  // Save the anfrange on database
  const handleOnSubmit = async () => {
    // Check fields
    if (
      !anfragenData.useProprosal ||
      !anfragenData.customer ||
      !anfragenData.desiredDeliveryDate ||
      !anfragenData.reason ||
      materials.length <= 0
    )
      return toast.error("Bitte füllen Sie alle Informationen aus");

    // Toaster
    toast.success("Daten hinzugefügt");

    // get quantity to be the next code
    const anfragenQtd: number[] = (
      await getDocs(collection(db, "anfragen"))
    ).docs.map((item) => item.data().code);

    // creating the whole anfragen
    const addAnfragen: Omit<Anfragen, "id"> = {
      ...anfragenData,
      code: Math.max(...anfragenQtd, 0) + 1,
      date: new Date(),
      userId: userProfile.id,
      userName: userProfile.username,
      auftragStatus: "nicht erstellt",
      materials: materials,
    };

    // add the new anfragen to the database
    await setDoc(doc(collection(db, "anfragen")), addAnfragen);

    // reset the form
    setAnfragenData(initialAnfragenData);
    setMaterials([]);
  };

  // Add new material
  const addNewMaterial = () => {
    if (
      !newMaterial.supplierPartNumber ||
      !newMaterial.quantity ||
      !newMaterial.description ||
      !newMaterial.supplierName
    )
      return toast.error(
        "Bitte füllen Sie alle Informationen aus (Beschreibung, Firma, Bestellnummer und Benotig!)"
      );

    if (
      materials.find(
        (item) => item.supplierPartNumber === newMaterial.supplierPartNumber
      )
    )
      return toast.error("Material bereits hinzugefügt");

    toast.success("Neues Material hinzugefügt");
    setMaterials([...materials, newMaterial]);
    setNewMaterial({
      supplierPartNumber: "",
      quantity: 0,
      description: "",
      supplierName: "",
    });
  };

  // Delete material from materials list
  const deleteMaterial = (id: String) => {
    const newMaterials = materials.filter(
      (item) => item.supplierPartNumber !== id
    );
    setMaterials(newMaterials);
    toast.success("Material gelöscht");
  };

  return (
    <main>
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
      {/* Header */}
      <section className="section">
        <div className="container mx-auto">
          <div className="flex flex-col flex-wrap items-center gap-4">
            <div>
              <h1 className="h1">AnfrageForm</h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleOnSubmit}
                className="btn btn-sm bg-green-500 hover:bg-green-900"
              >
                Weiter
              </button>
              <button
                onClick={() => router.push("/panel/anfragen")}
                className="btn btn-sm bg-red-500 hover:bg-red-900"
              >
                Zurücknehmen
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* FORM */}
      <section className="section">
        <div className="container mx-auto">
          <div>
            {/* Form */}
            <div className="flex flex-col items-center flex-wrap">
              {/* FOMR */}
              <div className="flex flex-col flex-wrap gap-4">
                <div className="flex gap-4 pb-4 flex-wrap border-b border-white">
                  {/* VERWENDUNG */}
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
                  {/* KUNDE */}
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
                  {/* STATUS */}
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
                  {/* GEW. LIEFERDATUM */}
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
              </div>
              {/* Material Form */}
              <div className="flex flex-col flex-wrap gap-4">
                {/* Header */}
                <div>
                  <h2 className="h2 mt-4">Material:</h2>
                </div>
                {/* Form */}
                <div className="flex flex-col flex-wrap gap-4">
                  {/* Description line */}
                  <div className="flex flex-col gap-1 lg:w-[750px]">
                    <span className="text-sm">Beschreibung</span>
                    <input
                      required
                      type="text"
                      value={newMaterial.description}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          description: e.currentTarget.value,
                        })
                      }
                      className="text-black px-2"
                    />
                  </div>
                  {/* Material Form */}
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">Bestellnummer</span>
                      <input
                        required
                        type="text"
                        value={newMaterial.supplierPartNumber}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            supplierPartNumber:
                              e.currentTarget.value.toUpperCase(),
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
                        value={newMaterial.quantity}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            quantity: +e.currentTarget.value,
                          })
                        }
                        className="text-black px-2 w-24"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">Firma</span>
                      <select
                        required
                        value={newMaterial.supplierName}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            supplierName: e.currentTarget.value,
                          })
                        }
                        className="text-black px-2 w-max"
                      >
                        <option value=""></option>
                        {customers.map((customer) => (
                          <option key={customer} value={customer}>
                            {customer}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        onClick={addNewMaterial}
                        className="text-green-700 text-5xl hover:text-green-950"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Materials List */}
                  <div>
                    {materials.map((item) => (
                      <div
                        key={item.supplierPartNumber}
                        className="grid grid-cols-2 gap-2 lg:grid-cols-5 mb-4 p-2 border rounded-md"
                      >
                        <span>
                          {item.description.length > 10
                            ? `${item.description.slice(0, 10)}...`
                            : `${item.description}`}
                        </span>
                        <span className="font-semibold">
                          {item.supplierPartNumber}
                        </span>
                        <span>{item.quantity} Stck </span>
                        <span>{item.supplierName}</span>
                        <button
                          className="btn bg-red-500 hover:bg-red-950"
                          onClick={() =>
                            deleteMaterial(item.supplierPartNumber)
                          }
                        >
                          Löschen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
