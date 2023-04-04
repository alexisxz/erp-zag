import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPasswordCorrect(true);
    try {
      await login(email, password);
      router.replace("/panel");
    } catch (error) {
      setIsPasswordCorrect(false);
    }
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form onSubmit={handleOnSubmit}>
        <div className="backdrop-blur-sm bg-white/10 py-12 rounded-lg flex flex-col gap-4 items-center w-96">
          <div className="text-center">
            <h1 className="h1">ZAG ERP</h1>
            <h2 className="h2">Anmeldung</h2>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span>E-mail</span>
            <input
              type="email"
              className="bg-transparent border border-white p-2 rounded-md focus:bg-[#F28B00]"
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span>Passwort</span>
            <input
              type="password"
              className="bg-transparent border border-white p-2 rounded-md focus:bg-[#F28B00]"
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <div className="mt-4 w-56">
            <button className="btn btn-sm w-full" type="submit">
              Weiter
            </button>
          </div>
          {isPasswordCorrect ? (
            ""
          ) : (
            <div>
              <span className="text-red-400">falsche E-Mail oder Passwort</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
