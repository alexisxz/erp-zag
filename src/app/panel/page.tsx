import Image from "next/image";

export const metadata = {
  title: "ERP",
  description: "Powered by Alexis Matos",
};

export default function Panel() {
  return (
    <section className="section h-screen w-full flex flex-wrap items-center justify-center bg-white text-center">
      <div className="container mx-auto flex flex-col flex-wrap gap-16 justify-center items-center">
        <div className="flex flex-col flex-wrap gap-2 items-center justify-center">
          <h1 className="h1 text-black font-bold">COMPANY NAME ERP</h1>
          <span className="text-black">
            {new Date().toLocaleDateString("de-DE")}
          </span>
        </div>
        {/* <Image
          src={"https://www.zyklotron-ag.de/fileadmin/assets/zyklotron.jpg"}
          alt="ZAG LOGO"
          width={500}
          height={500}
          className="self-center"
        /> */}
      </div>
    </section>
  );
}
