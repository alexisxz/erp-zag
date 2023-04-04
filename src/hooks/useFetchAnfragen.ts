import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { Anfragen } from "@/types/Anfragen";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useFetchAnfragen() {
  const { user, userProfile } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anfragen, setAnfragen] = useState<Anfragen[]>();

  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "anfragen"), where("userId", "==", user.uid))
        );
        if (!querySnapshot.docs) return setAnfragen([]);
        const data: any[] = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setAnfragen(data);
      } catch (error) {
        setError("Failed to load anfragen");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { loading, error, anfragen };
}
