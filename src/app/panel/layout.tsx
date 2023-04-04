"use client";
import { SideBar } from "@/components/SideBar";

type Props = {
  children: React.ReactNode;
};

export default function PanelLayout({ children }: Props) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div>
        <SideBar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
