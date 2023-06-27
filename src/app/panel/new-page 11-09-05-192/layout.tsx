"use client";
import { SideBar } from "@/components/SideBar";

type Props = {
    children: React.ReactNode;
};

export default function NewPageLayout({ children }: Props) {
    return (
        <div className="flex flex-col lg:flex-row">
            <div>
                <SideBar />
            </div>
            <div>New Div</div>
            <div className="flex-1">{children}</div>
        </div>
    );
}
