import { db } from "@/firebase/config";
import { Auftrag } from "@/types/Auftrag";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useFetchAuftrag() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [auftrag, setAuftrag] = useState<Auftrag[]>();
  const [auftragLimit, setAuftragLimit] = useState<number>(5);

  const fetchData = async () => {
    try {
      const docsSnapshot = await getDocs(
        query(collection(db, "auftrag"), orderBy("code", "desc"))
      );
      const data: any[] = docsSnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setAuftrag(data);
    } catch (error) {
      setError("Failed to load aufträge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    error,
    auftrag,
    setAuftragLimit,
    auftragLimit,
    refetch: fetchData,
  };
}
