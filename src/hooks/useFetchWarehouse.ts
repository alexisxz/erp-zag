import { db } from "@/firebase/config";
import { Warehouse } from "@/types/Warehouse";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useFetchWarehouse() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse[]>();

  useEffect(() => {
    async function fetchData() {
      try {
        const docsSnapshot = await getDocs(
          query(collection(db, "warehouse"), orderBy("date", "asc"))
        );
        const data: any[] = docsSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setWarehouse(data);
      } catch (error) {
        setError("Failed to load warehouse");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { loading, error, warehouse };
}
