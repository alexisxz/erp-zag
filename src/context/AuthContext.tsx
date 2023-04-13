import { auth, db } from "@/firebase/config";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext<any>({});
export const useAuth = () => useContext(AuthContext);
type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>();

  // Login
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Update password
  const updatePassword = async (email: string) => {
    toast.loading("wird bearbeitet...", { duration: 1000 });
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast("Update-Informationen in Ihrer E-Mail");
      })
      .catch((error) => {
        toast.error(`${error.code}: ${error.message}`);
      });
  };

  // Check if user is authenticaded
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const data = await getDoc(doc(db, "users", user.uid));
        setUserProfile({ ...data.data(), id: data.id });
      }

      if (!user) {
        router.push("/");
      }
    });
    return unsubscribe;
  }, []);

  // get all values for the context
  const contextValue = {
    user,
    userProfile,
    login,
    logout,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
