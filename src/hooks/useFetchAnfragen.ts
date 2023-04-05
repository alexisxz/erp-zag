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
  const [userAnfragen, setUserAnfragen] = useState<Anfragen[]>();

  useEffect(() => {
    async function fetchData() {
      try {
        //userAnfragen
        const queryUserSnapshot = await getDocs(
          query(collection(db, "anfragen"), where("userId", "==", user.uid))
        );
        if (!queryUserSnapshot.docs) {
          setUserAnfragen([]);
        }
        const userData: any[] = queryUserSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setUserAnfragen(userData);

        //anfragen
        const querySnapshot = await getDocs(collection(db, "anfragen"));
        if (!querySnapshot) {
          setAnfragen([]);
        }
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

  return { loading, error, anfragen, userAnfragen };
}
