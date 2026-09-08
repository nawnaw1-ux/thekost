import {
    FileClock,
    Home,
    HomeIcon,
    MapPinIcon,
    NotepadText,
} from "lucide-react";
import SidebarItem from "../SidebarItem";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

const SidebarAdmin = () => {
    let variantUrl = window.location.pathname;
    const { billActive } = usePage<PageProps>().props;
    return (
        <aside className=" hidden border-r lg:block bg-background w-64 left-0 h-screen top-0 fixed">
            <div className="pt-[88px] px-8 flex flex-col justify-between h-full">
                <ul className="mt-6 font-medium text-sm flex gap-1 flex-col ">
                    <SidebarItem
                        href={route("resident.dashboard.index")}
                        icon={HomeIcon}
                        label="Dashboard"
                        isActive={variantUrl === "/dashboard"}
                    />{" "}
                    <div className="relative w-full">
                        {billActive.length > 0 && (
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                        <SidebarItem
                            href={route("resident.bill.index")}
                            icon={NotepadText}
                            label="Tagihan"
                            isActive={variantUrl === "/tagihan"}
                        />{" "}
                    </div>
                    <SidebarItem
                        href={route("resident.paymenthistory.index")}
                        icon={FileClock}
                        label="Riwayat Pembayaran"
                        isActive={variantUrl === "/riwayat"}
                    />{" "}
                    <SidebarItem
                        href={route("resident.branchinfo.index")}
                        icon={MapPinIcon}
                        label="Informasi Kos"
                        isActive={variantUrl === "/info-cabang"}
                    />{" "}
                </ul>
                <div className="mb-5 flex flex-col justify-center items-center">
                    <span className="text-xs font-semibold">
                        © 2025 - Room Wise
                    </span>
                    <span className="text-xs text-zinc-600">
                        All rights reserved
                    </span>
                </div>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
