import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { FileClock, MapIcon, MapPinIcon } from "lucide-react";
import React from "react";

const BottomNavbar = () => {
    const { url } = usePage();
    const { billActive } = usePage<PageProps>().props;
    return (
        <div className="fixed lg:hidden bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-zinc-900 border-t">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                <Link
                    href="/dashboard"
                    type="button"
                    className={`inline-flex flex-col items-center justify-center px-5 group ${
                        url === "/dashboard" ? " dark:bg-background/50" : ""
                    }`}
                >
                    <svg
                        className={`size-4 mb-2 ${
                            url === "/dashboard"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span
                        className={`text-sm ${
                            url === "/dashboard"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                    >
                        Home
                    </span>
                </Link>
                <Link
                    href="/tagihan"
                    type="button"
                    className={`inline-flex relative flex-col items-center justify-center px-5 group ${
                        url === "/tagihan" ? " dark:bg-background/50" : ""
                    }`}
                >
                    {billActive.length > 0 && (
                        <div className="absolute -top-2  right-2 size-4 rounded-full bg-red-700"></div>
                    )}
                    <svg
                        className={`size-4 mb-2 ${
                            url === "/tagihan"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
                        <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
                    </svg>
                    <span
                        className={`text-sm ${
                            url === "/tagihan"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                    >
                        Tagihan
                    </span>
                </Link>
                <Link
                    href="/riwayat"
                    type="button"
                    className={`inline-flex flex-col items-center justify-center px-5 group ${
                        url === "/riwayat" ? " dark:bg-background/50" : ""
                    }`}
                >
                    <FileClock
                        className={`size-4 mb-2 ${
                            url === "/riwayat"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                    />
                    <span
                        className={`text-sm ${
                            url === "/riwayat"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                    >
                        Riwayat
                    </span>
                </Link>{" "}
                <Link
                    href="/info-cabang"
                    type="button"
                    className={`inline-flex flex-col items-center justify-center px-5 group ${
                        url === "/info-cabang" ? " dark:bg-background/50" : ""
                    }`}
                >
                    <MapPinIcon
                        className={`size-4 mb-2 ${
                            url === "/info-cabang"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                    />
                    <span
                        className={`text-sm ${
                            url === "/info-cabang"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                    >
                        Cabang
                    </span>
                </Link>
                <Link
                    href="/profile"
                    type="button"
                    className={`inline-flex flex-col items-center justify-center px-5 group ${
                        url === "/profile" ? " dark:bg-background/50" : ""
                    }`}
                >
                    <svg
                        className={`size-4 mb-2 ${
                            url === "/profile"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <span
                        className={`text-sm ${
                            url === "/profile"
                                ? "dark:text-primary text-primary"
                                : "text-foreground/70"
                        }`}
                    >
                        Profile
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default BottomNavbar;
