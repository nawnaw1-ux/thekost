import {
    Banknote,
    BedSingle,
    BookCheck,
    Headphones,
    Home,
    LayoutDashboard,
    NotebookPen,
    PackageOpen,
    Settings,
    Users2Icon,
} from "lucide-react";
import SidebarItem from "../SidebarItem";
import ApplicationLogo from "../ApplicationLogo";
import { Link } from "@inertiajs/react";

const SidebarAdmin = () => {
    // Get the current pathname to determine active links
    const currentPath = window.location.pathname;

    return (
        <aside className="hidden lg:block bg-background z-20 w-64 left-0 h-screen top-0 fixed">
            <div className="flex flex-col justify-between h-full">
                <ul className="mt-6 ml-2 font-medium text-sm flex flex-col">
                    {/* Application Logo */}
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center mb-7 justify-center"
                    >
                        <ApplicationLogo className="size-12 lg:w-28 lg:h-full" />
                    </Link>

                    {/* Dashboard Group */}
                    <SidebarItem
                        href={route("admin.dashboard.index")}
                        icon={LayoutDashboard}
                        label="Dashboard"
                        isActive={currentPath.startsWith("/admin/dashboard")}
                    />

                    <SidebarItem
                        href={route("admin.resident.index")}
                        icon={Users2Icon}
                        label="Penghuni"
                        isActive={currentPath.startsWith("/admin/penghuni")}
                    />
                    <SidebarItem
                        href={route("admin.room.index")}
                        icon={BedSingle}
                        label="Kamar"
                        isActive={currentPath.startsWith("/admin/kamar")}
                    />

                    <SidebarItem
                        href={route("admin.item.index")}
                        icon={PackageOpen}
                        label="Item"
                        isActive={currentPath.startsWith("/admin/item")}
                    />
                    <SidebarItem
                        href={"/admin/laporan"}
                        icon={BookCheck}
                        label="Laporan"
                        isActive={currentPath.startsWith("/admin/laporan")}
                    />
                </ul>

                {/* Pengaturan Group - Uncomment if needed */}
                <div className="mb-3 ml-2 ">
                    <SidebarItem
                        href={route("admin.setting.index")}
                        icon={Settings}
                        label="Pengaturan"
                        isActive={currentPath.startsWith("/admin/pengaturan")}
                    />
                </div>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
