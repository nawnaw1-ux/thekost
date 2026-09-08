import React from "react";
import RootLayout from "./RootLayout";
import { Head } from "@inertiajs/react";
import NavbarResident from "@/Components/large-ui/NavbarResident";
import SidebarResident from "@/Components/large-ui/SidebarResident";
import BottomNavbar from "@/Components/large-ui/BottomNavbar";

interface ResidentLayoutProps {
    children: React.ReactNode;
    head: string;
    tittle?: string;
    description?: string;
}
export default function ResidentLayout({
    children,
    head,
    tittle,
    description,
}: ResidentLayoutProps) {
    return (
        <RootLayout>
            <Head title={head} />
            <NavbarResident />
            <SidebarResident />
            <div className="my-28 lg:mt-32 px-4 lg:ml-64 lg:mr-4">
                {" "}
                <div className="flex flex-col lg:ml-56">
                    <span className="text-xl md:text-2xl  font-bold">
                        {tittle}
                    </span>
                    <span className="text-sm md:text-base font-medium text-zinc-400">
                        {description}
                    </span>
                </div>
                {children}
            </div>
            <BottomNavbar />
        </RootLayout>
    );
}
