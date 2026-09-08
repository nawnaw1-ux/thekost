import { Link, useForm, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { PageProps } from "@/types";
import { CirclePowerIcon, LogOut, Settings, User } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { ModeToggle } from "../mode-toggle";
import { cn } from "@/lib/utils";
import ApplicationLogoTwo from "../ApplicationLogoTwo";
import React, { useEffect } from "react";
import MonthYear from "./MonthYear";

interface Props {
    className?: string;
}
const NavbarAdmin = ({ className }: Props) => {
    const { auth, boarding_branch, active_boarding_branch } =
        usePage<PageProps>().props;
    let variantUrl = window.location.pathname;
    const { monthNow } = usePage<PageProps>().props;
    const path = window.location.pathname;
    const [branchChange, setBranchChange] = React.useState();
    const { post, setData, data } = useForm({
        id: branchChange,
    });

    useEffect(() => {
        if (branchChange) {
            setData("id", branchChange);
            post(
                route("admin.dashboard.update-branch", {
                    id: branchChange,
                })
            );
        }
    }, [branchChange]);

    const handleBranchChange = (id: any) => {
        setBranchChange(id);
    };
    const now = new Date();
    const wibTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    const hour = wibTime.getHours();

    // Tentukan salam berdasarkan jam
    let greeting = "Halo";
    if (hour >= 4 && hour < 11) {
        greeting = "Selamat Pagi";
    } else if (hour >= 11 && hour < 15) {
        greeting = "Selamat Siang";
    } else if (hour >= 15 && hour < 18) {
        greeting = "Selamat Sore";
    } else {
        greeting = "Selamat Malam";
    }
    return (
        <nav
            className={cn(
                `flex w-full px-4 pl-9 pr-9 justify-between py-4 items-center z-10 md:top-0 md:fixed`,
                {
                    "dark:bg-zinc-900 bg-zinc-900 md:bg-white":
                        variantUrl.startsWith("/admin/dashboard") ||
                        variantUrl === "/admin/laporan",
                    "bg-white dark:bg-zinc-900":
                        variantUrl.startsWith("/admin/penghuni") ||
                        variantUrl.startsWith("/admin/kamar") ||
                        variantUrl.startsWith("/admin/item") ||
                        variantUrl.startsWith("/admin/profil") ||
                        variantUrl.startsWith("/admin/laporan/pengeluaran") ||
                        variantUrl.startsWith("/admin/laporan/pemasukkan") ||
                        variantUrl.startsWith(
                            "/admin/laporan/pemasukkan-denda"
                        ),
                },
                className
            )}
        >
            {path.startsWith("/admin/dashboard") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">
                        DASHBOARD
                    </p>
                    <div className="py-2 bg-white dark:bg-zinc-700 text-sm font-semibold px-5 rounded-full shadow-md">
                        {monthNow}
                    </div>{" "}
                    {boarding_branch?.length > 0 && (
                        <div className="hidden lg:flex justify-end w-full">
                            <Select
                                onValueChange={(id) => handleBranchChange(id)}
                            >
                                <SelectTrigger className="dark:bg-zinc-800 h-10 rounded-full">
                                    <SelectValue
                                        placeholder={
                                            active_boarding_branch?.name ||
                                            "Select a Branch"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {boarding_branch.map((branch) => (
                                        <SelectItem
                                            className=" pl-2"
                                            key={branch.id}
                                            value={`${branch.id}`}
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}{" "}
            {path.startsWith("/admin/penghuni") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className="xl:text-2xl font-semibold lg:pl-64">
                        PENGHUNI
                    </p>
                    {boarding_branch?.length > 0 && (
                        <div className="hidden lg:flex justify-end w-full">
                            <Select
                                onValueChange={(id) => handleBranchChange(id)}
                            >
                                <SelectTrigger className="dark:bg-zinc-800 h-10 rounded-full">
                                    <SelectValue
                                        placeholder={
                                            active_boarding_branch?.name ||
                                            "Select a Branch"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {boarding_branch.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={`${branch.id}`}
                                            className=" pl-2"
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}{" "}
            {path.startsWith("/admin/cabang-kos") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">
                        CABANG KOS
                    </p>
                </div>
            )}{" "}
            {path.startsWith("/admin/profile") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">
                        PROFIL
                    </p>
                </div>
            )}{" "}
            {path.startsWith("/admin/denda") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">DENDA</p>
                </div>
            )}{" "}
            {path.startsWith("/admin/tagihan") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">
                        TAGIHAN
                    </p>{" "}
                    {boarding_branch?.length > 0 && (
                        <div className="hidden lg:flex justify-end w-full">
                            <Select
                                onValueChange={(id) => handleBranchChange(id)}
                            >
                                <SelectTrigger className="dark:bg-zinc-800 h-10 rounded-full">
                                    <SelectValue
                                        placeholder={
                                            active_boarding_branch?.name ||
                                            "Select a Branch"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {boarding_branch.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={`${branch.id}`}
                                            className=" pl-2"
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}{" "}
            {path.startsWith("/admin/kamar") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">KAMAR</p>{" "}
                    {boarding_branch?.length > 0 && (
                        <div className="hidden lg:flex justify-end w-full">
                            <Select
                                onValueChange={(id) => handleBranchChange(id)}
                            >
                                <SelectTrigger className="dark:bg-zinc-800 h-10 rounded-full">
                                    <SelectValue
                                        placeholder={
                                            active_boarding_branch?.name ||
                                            "Select a Branch"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {boarding_branch.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={`${branch.id}`}
                                            className=" pl-2"
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}{" "}
            {path.startsWith("/admin/pengaturan") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">
                        PENGATURAN
                    </p>{" "}
                    {boarding_branch?.length > 0 && (
                        <div className="hidden lg:flex justify-end w-full">
                            <Select
                                onValueChange={(id) => handleBranchChange(id)}
                            >
                                <SelectTrigger className="dark:bg-zinc-800 h-10 rounded-full">
                                    <SelectValue
                                        placeholder={
                                            active_boarding_branch?.name ||
                                            "Select a Branch"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {boarding_branch.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={`${branch.id}`}
                                            className=" pl-2"
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}{" "}
            {path.startsWith("/admin/item") && (
                <div className="md:flex items-center gap-4 hidden">
                    <p className=" xl:text-2xl font-semibold lg:pl-64">ITEM</p>{" "}
                    {boarding_branch?.length > 0 && (
                        <div className="hidden lg:flex justify-end w-full">
                            <Select
                                onValueChange={(id) => handleBranchChange(id)}
                            >
                                <SelectTrigger className="dark:bg-zinc-800 h-10 rounded-full">
                                    <SelectValue
                                        placeholder={
                                            active_boarding_branch?.name ||
                                            "Select a Branch"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {boarding_branch.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={`${branch.id}`}
                                            className=" pl-2"
                                        >
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}{" "}
            {path.startsWith("/admin/laporan") && (
                <>
                    <div className="md:flex items-center w-[76%] gap-4 hidden">
                        <div className="flex items-center gap-4 lg:pl-64 w-full">
                            <p className="xl:text-2xl font-semibold whitespace-nowrap">
                                {path === "/admin/laporan/pemasukkan" ? (
                                    <p>PEMASUKAN</p>
                                ) : path === "/admin/laporan/pengeluaran" ? (
                                    "PENGELUARAN"
                                ) : path ===
                                  "/admin/laporan/pemasukkan-denda" ? (
                                    "PEMASUKAN DENDA"
                                ) : (
                                    "LAPORAN"
                                )}
                            </p>
                            {boarding_branch?.length > 0 && (
                                <div className="hidden lg:flex w-full max-w-xs">
                                    <Select
                                        onValueChange={(id) =>
                                            handleBranchChange(id)
                                        }
                                    >
                                        <SelectTrigger className="dark:bg-zinc-800 h-10 rounded-full w-auto">
                                            <SelectValue
                                                placeholder={
                                                    active_boarding_branch?.name ||
                                                    "Select a Branch"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {boarding_branch.map((branch) => (
                                                <SelectItem
                                                    key={branch.id}
                                                    value={`${branch.id}`}
                                                    className="pl-2"
                                                >
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end w-auto">
                            {path === "/admin/laporan/pemasukkan" ||
                            path === "/admin/laporan/pemasukkan-denda" ||
                            path === "/admin/laporan/pengeluaran" ? null : (
                                <div className="hidden lg:flex justify-end">
                                    <MonthYear />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            <div className="w-20 md:w-auto bg-transparent md:hidden">
                <Link href="/admin/dashboard">
                    <ApplicationLogoTwo className="w-14 md:hidden" />{" "}
                </Link>
            </div>
            <div className=" md:hidden flex">
                {boarding_branch?.length > 0 && (
                    <div className="justify-end w-full">
                        <Select onValueChange={(id) => handleBranchChange(id)}>
                            <SelectTrigger
                                className={`
                                    ${
                                        variantUrl.startsWith(
                                            "/admin/dashboard"
                                        ) || variantUrl === "/admin/laporan"
                                            ? " text-white bg-zinc-800"
                                            : "text-foreground"
                                    }
                                    dark:bg-zinc-800 w-32 pl-2 h-10 rounded-full`}
                            >
                                <SelectValue
                                    placeholder={
                                        active_boarding_branch?.name ||
                                        "Select a Branch"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {boarding_branch.map((branch) => (
                                    <SelectItem
                                        className=" pl-2"
                                        key={branch.id}
                                        value={`${branch.id}`}
                                    >
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            <div className="flex text-white md:text-foreground items-center md:gap-2 ">
                <Link
                    href={route("admin.profile.index")}
                    className="hidden md:flex md:pr-5 shadow-md flex-items-center gap-2.5 dark:bg-zinc-700 bg-white  rounded-full p-1.5"
                >
                    <div className=" rounded-full p-2 bg-gray-50 dark:bg-zinc-500 ">
                        <User size={20} />
                    </div>
                    <div className="hidden md:flex  text-xs xl:text-sm flex-col">
                        <p className=" font-medium">Hallo,{greeting}</p>{" "}
                        <p className="  text-foreground/70">Admin</p>
                    </div>
                </Link>
                <div
                    className={`
                                    ${
                                        variantUrl.startsWith(
                                            "/admin/dashboard"
                                        ) || variantUrl === "/admin/laporan"
                                            ? " text-white md:text-foreground"
                                            : ""
                                    }
                                    dark:text-white text-black`}
                >
                    <ModeToggle />
                </div>

                <Link
                    className=" hidden md:flex"
                    href={route("logout")}
                    method="post"
                >
                    <CirclePowerIcon size={24} />
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div
                            className={` items-center gap-3 ml-2 cursor-pointer flex md:hidden ${
                                variantUrl.startsWith("/admin/dashboard") ||
                                variantUrl === "/admin/laporan"
                                    ? " text-white"
                                    : "text-foreground"
                            }`}
                        >
                            <div className=" flex-col w-auto hidden md:flex ">
                                <span className=" text-sm font`-semibold  ">
                                    {auth.user.name}
                                </span>
                                <span className="text-xs font-medium text-gray-400 ">
                                    {auth.user.email}
                                </span>
                            </div>
                            <svg
                                className=" md:ml-2 "
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m7 10l5 5m0 0l5-5"
                                ></path>
                            </svg>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mt-2 z-[110]">
                        <DropdownMenuLabel>Profil Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={route("admin.profile.index")}>
                            <DropdownMenuItem className=" cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </Link>{" "}
                        <Link
                            href={route("admin.setting.index")}
                            className=" md:hidden"
                        >
                            <DropdownMenuItem className=" cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Pengaturan</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href={route("logout")} method="post">
                            <DropdownMenuItem className=" cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default NavbarAdmin;
