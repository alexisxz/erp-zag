'use client'

import { useAuth } from "@/context/AuthContext"
import { anfragenStatus } from "@/data/parameters"
import { db } from "@/firebase/config"
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate"
import useFetchAnfragen from "@/hooks/useFetchAnfragen"
import { Material } from "@/types/Material"
import { collection, doc, getDoc, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ToastBar, Toaster, toast } from "react-hot-toast"



export default function NeueAuftrag() {
    const router = useRouter()
    const { anfragen, refetch } = useFetchAnfragen()
    const { userProfile } = useAuth()
    const [anfrageId, setAnfrageId] = useState<string>("")
    const [getSelectedAnfrage, setGetSelectedAnfrage] = useState<any>()

    useEffect(() => {
        if (anfrageId === "") return setGetSelectedAnfrage(null)
        const getDate = async () => {
            const docRef = doc(db, "anfragen", anfrageId)
            const docSnap = await getDoc(docRef)
            setGetSelectedAnfrage(docSnap.data())
        }
        getDate()
    }, [anfrageId])

    const handleOnSubmit = async () => {
        if (!anfrageId) return toast.error("Bitte wählen Sie einen Anfragecode aus")
        if (!getSelectedAnfrage?.reason || !getSelectedAnfrage?.deliveryDate) return toast.error("Bitte füllen Sie beide Informationen aus (Status und Lieferdatum)")

        // Toaster
        toast.success("Daten hinzugefügt");

        // add the new auftrag to the database
        await setDoc(doc(collection(db, "auftrag")), {
            ...getSelectedAnfrage,
            anfrageId: anfrageId,
            userId: userProfile.id,
            userName: userProfile.username,
            requestedUserName: getSelectedAnfrage.userName,
            createdAt: new Date(),
            anfragenDate: getSelectedAnfrage.date
        });

        // change the anfragen
        await updateDoc(doc(db, "anfragen", anfrageId), {
            reason: getSelectedAnfrage.reason,
            auftragStatus: "in Bearbeitung",
            deliveryDate: getSelectedAnfrage.deliveryDate,
        });

        // reset the form
        setGetSelectedAnfrage(null);

        // refetch data
        refetch();
    }

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
            {/* HEADER */}
            <section className="section">
                <div className="container mx-auto">
                    <div className="flex flex-col flex-wrap gap-4 items-center">
                        {/* TITLE */}
                        <div>
                            <h1 className="h1">AuftragForm</h1>
                        </div>
                        {/* BUTTONS */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleOnSubmit}
                                className="btn btn-sm bg-green-500 hover:bg-green-900"
                            >
                                Weiter
                            </button>
                            <button
                                onClick={() => router.push("/panel/auftrag")}
                                className="btn btn-sm bg-red-500 hover:bg-red-900"
                            >
                                Zurücknehmen
                            </button>
                        </div>
                        {/* ANFRAGE SELECT */}
                        <div className="flex gap-1 flex-wrap items-center">
                            <span className="text-sm">Anfrage code:</span>
                            <select defaultValue={""} className="text-black" onChange={e => { setAnfrageId(e.target.value) }}>
                                <option value=""></option>
                                {anfragen?.sort((a, b) => a.code - b.code).map(item => (
                                    item.auftragStatus !== "nicht erstellt" ? null : <option key={item.id} value={item.id}>{item.code.toString()}</option>
                                ))}
                            </select>
                            <div>
                                <span className="text-sm">{`bei ${!anfrageId ? "" : getSelectedAnfrage?.userName}`}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            {/* AUFTRAG INFOS */}
            <section className="section">
                <div className="container mx-auto">
                    <div>
                        <div className="flex gap-2 items-center justify-center flex-wrap">
                            {/* STATUS */}
                            <div className="flex flex-col gap-2 items-center flex-wrap">
                                <span className="text-sm">Status:</span>
                                <select
                                    value={getSelectedAnfrage?.reason}
                                    onChange={(e) =>
                                        setGetSelectedAnfrage({
                                            ...getSelectedAnfrage,
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
                            {/* INVOICE */}
                            <div className="flex flex-col gap-2 items-center flex-wrap">
                                <span className="text-sm">Invoice:</span>
                                <input type="text" className="px-2 text-black" />
                            </div>
                            {/* DELIVERY DATE */}
                            <div className="flex flex-col gap-2 items-center flex-wrap">
                                <span className="text-sm">Lieferdatum:</span>
                                <input
                                    required
                                    type="date"
                                    onChange={(e) =>
                                        setGetSelectedAnfrage({
                                            ...getSelectedAnfrage,
                                            deliveryDate: new Date(e.currentTarget.value),
                                        })
                                    }
                                    className="text-black px-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ANFRAGEN INFOS */}
            <section className="section">
                <div className="container mx-auto">
                    {/* FIRST INFOS */}
                    <div>
                        <h2 className="h2 text-center mb-4">Anfrage {getSelectedAnfrage?.code}</h2>
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex flex-col gap-2 items-center flex-wrap">
                                <span className="text-sm">Verwendung:</span>
                                <span className="">{getSelectedAnfrage?.useProprosal}</span>
                            </div>
                            <div className="flex flex-col gap-2 items-center flex-wrap">
                                <span className="text-sm">Kunde:</span>
                                <span className="">{getSelectedAnfrage?.customer}</span>
                            </div>
                            <div className="flex flex-col gap-2 items-center flex-wrap">
                                <span className="text-sm">Gew. Lieferdatum:</span>
                                <span className="">{convertFirestoreDate(getSelectedAnfrage?.desiredDeliveryDate, "inString")}</span>

                            </div>

                        </div>
                    </div>
                    {/* MATERIALS LIST */}
                    <div>
                        <h3 className="h3 text-center my-4">Materials:</h3>
                        <div>
                            {getSelectedAnfrage?.materials?.map((item: Material) => (
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}