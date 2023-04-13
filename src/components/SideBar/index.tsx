import { useAuth } from "@/context/AuthContext";
import { getSideBarList } from "@/utils/getSideBarList";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast, { Toaster, ToastBar } from "react-hot-toast";

export const SideBar = () => {
  const pathname = usePathname();
  const { logout, userProfile, updatePassword } = useAuth();
  const sideBarList = getSideBarList(userProfile?.screens);

  return (
    <>
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
      {/* Sidebar */}
      <aside className="sticky bg-gray-800 flex flex-col gap-4 p-4 top-0 left-0 z-40 lg:w-72 lg:h-screen w-screen transition-transform translate-x-0">
        {/* Header */}
        <div>
          <h3 className="h3 flex flex-col text-center">
            Willkommen,{" "}
            <span className="font-semibold">
              <Link href={"/panel"}>{userProfile?.username}</Link>
            </span>{" "}
          </h3>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() =>
              toast.promise(logout(), {
                loading: "wird bearbeitet...",
                success: "schau öfter mal vorbei :)",
                error: "Oops, versuchen Sie es noch einmal",
              })
            }
            className="btn btn-link pb-[2px]"
          >
            Logout
          </button>
          <button
            onClick={() => {
              updatePassword(userProfile.email);
            }}
            className="btn btn-link pb-[2px]"
          >
            Passwort ändern
          </button>
        </div>
        {/* Nav List */}
        <div>
          <ul className="flex justify-center lg:flex-col gap-2 lg:justify-start">
            {sideBarList?.map((list) =>
              pathname === `/panel/${list}` ? (
                <Link
                  className="hover:bg-[#0f172a] bg-[#F28B00] p-2 rounded-md"
                  key={list}
                  href={`panel/${list}`}
                >
                  <li>{list.charAt(0).toUpperCase() + list.slice(1)}</li>
                </Link>
              ) : (
                <Link
                  className="hover:bg-[#0f172a] p-2 rounded-md"
                  key={list}
                  href={`panel/${list}`}
                >
                  <li>{list.charAt(0).toUpperCase() + list.slice(1)}</li>
                </Link>
              )
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};
