"use client";
import { AuftragCard } from "@/components/AuftragCard";
import { AuftragForm } from "@/components/AuftragForm";
import { useAuth } from "@/context/AuthContext";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import useFetchAnfragen from "@/hooks/useFetchAnfragen";
import useFetchAuftrag from "@/hooks/useFetchAuftrag";
import { Anfragen } from "@/types/Anfragen";
import { Auftrag } from "@/types/Auftrag";
import { exportExcel } from "@/utils/exportExcel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuftragPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { auftrag, loading, error, auftragLimit, setAuftragLimit } =
    useFetchAuftrag();
  const { anfragen } = useFetchAnfragen();
  const [chooseListType, setChooseListType] = useState<string>("auftrag");
  const [newAnfragenList, setNewAnfragenList] = useState<any[]>([]);
  const [auftragItems, setAuftragItems] = useState<Auftrag[]>();
  const [limitAuftrag, setLimitAuftrag] = useState<number>(5);
  const [selectedAnfragen, setSelectedAnfragen] = useState<Anfragen | null>(
    null
  );

  // to validate user screen
  useEffect(() => {
    if (!userProfile) return;

    const validateScreen = !!userProfile.screens.find(
      (screen: string) => screen === "auftrag" || screen === "admin"
    );

    if (!validateScreen) {
      alert("Sie haben keinen Zugriff auf den Bildschirm");
      return router.push("panel");
    }
  }, [userProfile]);

  // get only the not started anfragen
  useEffect(() => {
    if (!anfragen) return;
    setNewAnfragenList(
      anfragen
        .map((item: Anfragen) => {
          if (item.auftragStatus === "nicht erstellt" && !item.deliveryDate)
            return item;
          return;
        })
        .sort((a: any, b: any) => a.code - b.code)
    );
  }, [anfragen]);

  // to limit the auftragitems
  useEffect(() => {
    if (!auftrag) return;
    setAuftragItems(
      auftrag.sort((a, b) => b.code - a.code).slice(0, limitAuftrag)
    );
  }, [auftrag, limitAuftrag]);

  return (
    <>
      {/* PopUpForm */}
      {!selectedAnfragen ? null : (
        <AuftragForm
          selectedAnfragen={selectedAnfragen}
          setSelectedAnfragen={setSelectedAnfragen}
        />
      )}
      {/* Header */}
      <section className="section">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 items-center">
            {/* Title */}
            <div>
              <h1 className="h1">Aufträge Bildschrim</h1>
            </div>
            {/* Select between new aufragen and auftrags */}
            <div className="flex gap-4">
              <button
                onClick={() => setChooseListType("auftrag")}
                className={
                  chooseListType === "auftrag"
                    ? "text-[#F28B00] font-semibold"
                    : ""
                }
              >
                Aufträge
              </button>
              <div>|</div>
              <button
                onClick={() => setChooseListType("anfragen")}
                className={
                  chooseListType === "anfragen"
                    ? "text-[#F28B00] font-semibold"
                    : ""
                }
              >
                Anfragen
              </button>
            </div>
            <div>
              {chooseListType === "anfragen" ? null : (
                <button
                  className="text-xl"
                  onClick={() =>
                    exportExcel(auftrag, "auftrag_data", "auftrag")
                  }
                >
                  📄
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Auftrag List */}
      <section className="section">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            {chooseListType === "auftrag" && (
              <div className="flex flex-col gap-4">
                {/* Loading */}
                {loading && <span>Wird geladen...</span>}
                {/* Error */}
                {error && <span>{error}</span>}
                {/* Auftrag List */}
                {!loading && auftragItems && (
                  <div className="flex flex-col gap-4">
                    {auftragItems.map((item) => (
                      <article key={item.id}>
                        <AuftragCard auftrag={item} />
                      </article>
                    ))}
                  </div>
                )}
                <div className="self-center">
                  {auftragItems?.length &&
                  auftragItems.length < limitAuftrag ? null : (
                    <button
                      className="btn btn-lg"
                      onClick={() => setLimitAuftrag(limitAuftrag + 5)}
                    >
                      Mehr
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Anfragen List */}
      {chooseListType === "anfragen" && (
        <section className="section">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-4 justify-start">
              {newAnfragenList?.map((item: Anfragen) =>
                !item ? null : (
                  <article
                    onClick={() => setSelectedAnfragen(item)}
                    key={item.id}
                    className="bg-gray-800 p-4 rounded-md flex flex-col gap-4 hover:border hover:border-white hover:bg-transparent hover:cursor-pointer"
                  >
                    {/* Header */}
                    <div className="flex self-center flex-col items-center">
                      <span className="text-[#F28B00]">
                        {convertFirestoreDate(item.date, "inString")}
                      </span>
                      <span className="text-xs">{item.userName}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs">code:</span>
                      <span>{item.code}</span>
                    </div>
                    {/* Content */}
                    <div className="flex gap-2 items-center">
                      <span className="text-xs">Bestellnummer:</span>
                      <span>{item.supplierPartNumber}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs">Firma:</span>
                      <span>{item.supplierName}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs">Gew. Lieferdatum:</span>
                      <span>{convertFirestoreDate(item.date, "inString")}</span>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
