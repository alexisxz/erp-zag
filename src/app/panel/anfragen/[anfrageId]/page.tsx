"use client";
import { anfragenStatus, customers } from "@/data/parameters";
import { db } from "@/firebase/config";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import useFetchAnfragen from "@/hooks/useFetchAnfragen";
import { Anfragen } from "@/types/Anfragen";
import { Material } from "@/types/Material";
import { deleteDoc, doc, getDoc, query, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastBar, Toaster, toast } from "react-hot-toast";

type PageType = {
  params: {
    anfrageId: string;
  };
};

const initialAnfragenData: Anfragen = {
  id: "",
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

export default function Page({ params }: PageType) {
  const router = useRouter();
  const { refetch } = useFetchAnfragen();
  const [anfrage, setAnfrage] = useState<any>(initialAnfragenData);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState<Material>({
    supplierPartNumber: "",
    quantity: 0,
    description: "",
    supplierName: "",
  });
  const [deletePopUp, setDeletePopUp] = useState<boolean>(false);

  // load anfrage
  useEffect(() => {
    const getAnfrage = async () => {
      const docRef = doc(db, "anfragen", params.anfrageId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.data()?.code) {
        return router.push("/panel/anfragen");
      }
      if (docSnap.data()?.auftragStatus !== "nicht erstellt") {
        toast.error("Auftrag bereits erstellt");
        return router.push("/panel/anfragen");
      }
      setAnfrage({ ...docSnap.data(), id: docSnap.id });
      setMaterials(docSnap.data()?.materials);
      return toast.success("Anfrage geladen");
    };
    getAnfrage();
  }, [params.anfrageId, router]);

  // update in the database
  const handleOnSubmit = async () => {
    // Check fields
    if (
      !anfrage.useProprosal ||
      !anfrage.customer ||
      !anfrage.desiredDeliveryDate ||
      !anfrage.reason ||
      materials.length <= 0
    )
      return toast.error("Bitte füllen Sie alle Informationen aus");

    // updating
    toast.success("Daten hinzugefügt");
    const anfragenRef = doc(db, "anfragen", params.anfrageId);
    await updateDoc(anfragenRef, { ...anfrage, materials: materials });
  };

  // Delete anfrage
  const handleOnDelete = async () => {
    if (!anfrage.id) return toast.error("Bitte schließen und wieder öffnen");

    // Toaster
    toast.success("gelöscht");

    await deleteDoc(doc(db, "anfragen", anfrage.id));

    setDeletePopUp(false);

    router.push("/panel/anfragen");

    refetch();
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
      {/* Delete PopUp */}
      {!deletePopUp ? null : (
        <div className="z-[50] top-0 left-0 fixed h-full w-full backdrop-blur-sm flex flex-col items-center justify-center">
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
      {/* Header */}
      <section className="section">
        <div className="container mx-auto">
          <div className="flex flex-col flex-wrap items-center gap-4">
            <div>
              <h1 className="h1">code: {anfrage.code}</h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleOnSubmit}
                className="btn btn-sm bg-green-500 hover:bg-green-900"
              >
                Weiter
              </button>
              <button
                onClick={() => setDeletePopUp(true)}
                className="btn btn-sm bg-red-500 hover:bg-red-900"
              >
                Löschen
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
                      value={anfrage.useProprosal}
                      onChange={(e) =>
                        setAnfrage({
                          ...anfrage,
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
                      value={anfrage.customer}
                      onChange={(e) =>
                        setAnfrage({
                          ...anfrage,
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
                      value={anfrage.reason}
                      onChange={(e) =>
                        setAnfrage({
                          ...anfrage,
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
                      type="date"
                      defaultValue={
                        anfrage.desiredDeliveryDate ===
                          anfrage.desiredDeliveryDate
                          ? convertFirestoreDate(anfrage.desiredDeliveryDate)
                            .toISOString()
                            .substring(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setAnfrage({
                          ...anfrage,
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
