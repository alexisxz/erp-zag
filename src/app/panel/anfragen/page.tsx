"use client";
import { AnfragenCard } from "@/components/AnfragenCard";
import { AnfragenForm } from "@/components/AnfragenForm";
import { useAuth } from "@/context/AuthContext";
import useFetchAnfragen from "@/hooks/useFetchAnfragen";
import { Anfragen } from "@/types/Anfragen";
import { exportExcel } from "@/utils/exportExcel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnfragePage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { loading, error, userAnfragen, refetch } = useFetchAnfragen();
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [anfragenItems, setAnfragenItems] = useState<Anfragen[]>();
  const [limitAnfragen, setLimitAnfragen] = useState<number>(5);

  // to validate screens
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

  // to limit number os anfragen
  useEffect(() => {
    if (!userAnfragen) return;
    setAnfragenItems(
      userAnfragen
        .sort((a: any, b: any) => b.code - a.code)
        .slice(0, limitAnfragen)
    );
  }, [userAnfragen, limitAnfragen]);

  return (
    <>
      {/* Form */}
      {!showPopUp ? null : (
        <AnfragenForm setShowPopUp={setShowPopUp} refetch={refetch} />
      )}
      {/* Header */}
      <section className="section">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 items-center">
            {/* Title */}
            <div>
              <h1 className="h1 text-center">Anfragen Bildschrim</h1>
            </div>
            {/* Button */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowPopUp(true)}
                className="btn btn-sm bg-green-500 hover:bg-green-900"
              >
                Neue Anfrage
              </button>
              <button
                className="text-xl"
                onClick={() =>
                  exportExcel(
                    userAnfragen,
                    "anfragen_data",
                    "anfragen",
                    !!userProfile.screens.find(
                      (screen: string) => screen === "admin"
                    )
                  )
                }
              >
                📄
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Anfragen */}
      <section className="section">
        <div className="container mx-auto">
          {/* Anfragen Loading */}
          {loading && (
            <div className="grid place-items-center">
              <span>Wird geladen...</span>
            </div>
          )}
          {/* error / 0 anfragen*/}
          {error && (
            <div className="grid place-items-center">
              <span>{error}</span>
            </div>
          )}
          {/* Anfragen */}
          <div className="flex flex-col gap-4">
            {anfragenItems &&
              !loading &&
              anfragenItems.map((anfrage) => (
                <article key={anfrage.id}>
                  <AnfragenCard anfragen={anfrage} refetch={refetch} />
                </article>
              ))}
            <div className="self-center">
              {!anfragenItems ? null : anfragenItems.length <=
                0 ? null : anfragenItems.length < limitAnfragen ? null : (
                <button
                  className="btn btn-lg"
                  onClick={() => setLimitAnfragen(limitAnfragen + 5)}
                >
                  Mehr
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
