import NavbarAdmin from "@/Components/large-ui/NavbarAdmin";
import React, { useEffect, useState } from "react";
import RootLayout from "./RootLayout";
import { Head } from "@inertiajs/react";
import SidebarAdmin from "@/Components/large-ui/SidebarAdmin";
import BottomNavbarAdmin from "@/Components/large-ui/BottomNavbarAdmin";

interface AdminLayoutProps {
    children: React.ReactNode;
    head: string;
    tittle?: string;
    description?: string;
}

export default function AdminLayout({
    children,
    head,
    tittle,
    description,
}: AdminLayoutProps) {
    const pathname = window.location.pathname;
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        // Media query hanya dievaluasi di sisi klien
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        checkScreenSize(); // Cek ukuran layar saat pertama kali dirender
        window.addEventListener("resize", checkScreenSize); // Update saat ukuran layar berubah
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <RootLayout>
            <Head title={head} />
            <SidebarAdmin />
            <div className="mb-14 md:mb-0 h-auto bg-gray-100 dark:bg-zinc-900">
                {/* {pathname !== "/admin/dashboard" && (
                    <div className="md:hidden">
                        <NavbarAdmin />
                    </div>
                )} */}

                <NavbarAdmin />

                {children}
            </div>
            <BottomNavbarAdmin />
        </RootLayout>
    );
}
