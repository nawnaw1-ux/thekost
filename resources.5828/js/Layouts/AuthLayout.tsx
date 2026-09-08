import React from "react";
import RootLayout from "./RootLayout";
import { Head, usePage } from "@inertiajs/react";
import { ModeToggle } from "@/Components/mode-toggle";
import maskotPng from "../../../public/assets/Logo/maskot.png";
interface AuthLayoutProps {
    children: React.ReactNode;
    head: string;
}
export default function AuthLayout({ children, head }: AuthLayoutProps) {
    return (
        <RootLayout>
            <Head>
                <title>{head}</title>
                <meta
                    name="description"
                    content={
                        "Apakah Anda mencari tempat tinggal yang nyaman, aman, dan strategis? Selamat datang di 'The Kost', pilihan terbaik untuk hunian modern yang memenuhi semua kebutuhan Anda!"
                    }
                />
            </Head>
            <div className="h-screen md:flex relative">
                <div className=" absolute right-10 top-10">
                    <ModeToggle />
                </div>

                <div className="relative overflow-hidden lg:flex w-1/2 bg-gradient-to-tr from-primary to-[#AD88C6]  justify-around items-center hidden">
                    <div className="flex max-w-lg  items-center flex-col gap-2">
                        <img
                            src={maskotPng}
                            className="w-[140%] max-w-4xl"
                            alt=""
                        />
                    </div>
                    <div className="absolute  -bottom-32 -left-40 w-80 border-black h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -bottom-40 -left-20 w-80 border-black h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -top-40 -right-0 w-80 border-black h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -top-20 -right-20 w-80 border-black h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                </div>
                <div className="flex h-screen md:h-auto md:w-full lg:w-1/2 justify-center py-10 items-center">
                    {children}
                </div>
            </div>
        </RootLayout>
    );
}
