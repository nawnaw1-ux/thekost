import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
    BedSingle,
    BookCheck,
    BoxIcon,
    FileClock,
    Home,
    Users2Icon,
} from "lucide-react";
import React from "react";

const BottomNavbar = () => {
    const { url } = usePage();

    return (
        <div className="fixed lg:hidden bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-zinc-900 border-t">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                <Link
                    href="/admin/dashboard"
                    type="button"
                    className={`inline-flex flex-col items-center justify-center px-5 group ${
                        url === "/admin/dashboard"
                            ? " dark:bg-background/50"
                            : ""
                    }`}
                >
                    <svg
                        className={`size-4 mb-2 ${
                            url === "/admin/dashboard"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span
                        className={`text-[11px] ${
                            url === "/admin/dashboard"
                                ? " text-primary font-bold   "
                                : "text-foreground/50"
                        }`}
                    >
                        Home
                    </span>
                </Link>
                <Link
                    href="/admin/penghuni"
                    type="button"
                    className={`inline-flex relative flex-col items-center justify-center px-5 group ${
                        url === "/admin/penghuni"
                            ? " dark:bg-background/50"
                            : ""
                    }`}
                >
                    <Users2Icon
                        className={`size-4 mb-2 ${
                            url === "/admin/penghuni"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    />

                    <span
                        className={`text-[11px] ${
                            url === "/admin/penghuni"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    >
                        Penghuni
                    </span>
                </Link>
                <Link
                    href="/admin/kamar"
                    type="button"
                    className={`inline-flex  relative flex-col items-center justify-center px-5 group ${
                        url === "/admin/kamar" ? " dark:bg-background/50" : ""
                    }`}
                >
                    <BedSingle
                        className={`size-4 mb-2 ${
                            url === "/admin/kamar"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    />
                    <span
                        className={`text-[11px] ${
                            url === "/admin/kamar"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    >
                        Kamar
                    </span>
                </Link>
                <Link
                    href="/admin/item"
                    type="button"
                    className={`inline-flex flex-col items-center justify-center px-5 group ${
                        url === "/admin/item" ? " dark:bg-background/50" : ""
                    }`}
                >
                    <BoxIcon
                        className={`size-4 mb-2 ${
                            url === "/admin/item"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    />
                    <span
                        className={`text-[11px] ${
                            url === "/admin/item"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    >
                        Item
                    </span>
                </Link>

                <Link
                    href="/admin/laporan"
                    type="button"
                    className={`inline-flex flex-col items-center justify-center px-5 group ${
                        url === "/admin/laporan" ? " dark:bg-background/50" : ""
                    }`}
                >
                    <BookCheck
                        className={`size-4 mb-2 ${
                            url === "/admin/laporan" ||
                            url === "/admin/laporan/pemasukkan" ||
                            url === "/admin/laporan/pengeluaran"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    />

                    <span
                        className={`text-[11px] ${
                            url === "/admin/laporan"
                                ? " text-primary font-bold  "
                                : "text-foreground/50"
                        }`}
                    >
                        Laporan
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default BottomNavbar;
