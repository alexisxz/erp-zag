import { Anfragen } from "@/types/Anfragen";
import { useState } from "react";
import { convertFirestoreDate } from "@/helpers/convertFirestoreDate";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  anfragen: Anfragen;
  refetch: () => void;
};

export const AnfragenCard = ({ anfragen, refetch }: Props) => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  return (
    <div>
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
      {/* CARD */}
      <div
        className="flex flex-col gap-4 flex-wrap bg-gray-800 p-4 rounded-lg hover:border hover:bonder-[#F28B00] hover:bg-transparent hover:cursor-pointer"
        onClick={() => {
          anfragen.auftragStatus !== "nicht erstellt"
            ? toast.error("Auftrag bereits erstellt")
            : router.push(`/panel/anfragen/${anfragen.id}`);
        }}
      >
        {/* Infos */}
        <div className="flex gap-4 flex-wrap items-center ">
          <div className="p-4 bg-[#0f172a] self-start rounded-full code-div">
            <h3 className="h3">{anfragen.code}</h3>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs">Kunde</span>
            <span>{anfragen.customer}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs">Verwendung</span>
            <span>{anfragen.useProprosal}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs">Auftrag Status</span>
            <span>{anfragen.auftragStatus}</span>
          </div>
          {!anfragen.deliveryDate ? null : (
            <div className="flex flex-col justify-center">
              <span className="text-xs">Lieferdatum</span>
              <span>
                {convertFirestoreDate(anfragen.deliveryDate, "inString")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
