import { Link, usePage } from "@inertiajs/react";
import { PageProps, UserNeed } from "@/types";
import { Bell, CheckIcon, NotepadText } from "lucide-react";
import ResidentLayout from "@/Layouts/ResidentLayout";
import React, { useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { FormatRupiah } from "@arismun/format-rupiah";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/Components/ui/alert-dialog";

function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 10) {
        return "Selamat Pagi";
    } else if (hours < 17) {
        return "Selamat Sore";
    } else {
        return "Selamat Malam";
    }
}

interface Props {
    billsPay: number;
    needs: UserNeed[];
}

export default function Dashboard({ billsPay, needs }: Props) {
    const { auth } = usePage<PageProps>().props;
    const greeting = getGreeting();
    const [totalNeeds, setTotalNeeds] = React.useState(0);
    const { billActive } = usePage<PageProps>().props;
    useEffect(() => {
        setTotalNeeds(
            needs.map((need) => need.item.price).reduce((a, b) => a + b, 0)
        );
    }, [needs]);

    const url = window.location.search;
    const params = new URLSearchParams(url);

    const status = params.get("status");

    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        if (status === "success") {
            setShowModal(true);
        }
    }, [status]);

    return (
        <>
            <AlertDialog open={showModal} onOpenChange={setShowModal}>
                <AlertDialogContent className="w-[90%]  border">
                    <AlertDialogHeader>
                        <div className="flex flex-col justify-center items-center">
                            <CheckIcon className="size-20 bg-green-500 text-white rounded-full p-4" />
                            <p className="text-fotreground text-2xl font-semibold mt-2">
                                Selamat
                            </p>
                            <p className="mt-3 text-center font-medium text-base text-foreground/60">
                                Tagihan Anda Berhasil di bayar, Silahkan cek di
                                riwayat pembayaran di menu utama
                            </p>
                            <AlertDialogFooter className="mt-8 w-1/2">
                                <AlertDialogCancel
                                    onClick={() => setShowModal(false)}
                                    className="w-full"
                                >
                                    Tutup
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </div>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex lg:px-56 mt-2  flex-col w-full">
                <h1 className="text-base text-foreground/50 font-medium mb-4">
                    {greeting}, {auth.user.name}
                </h1>
                {billActive.length > 0 && (
                    <div
                        className=" flex border  bg-primary text-black lg:flex-row lg:justify-between flex-col gap-2
                 p-4 text-sm rounded-lg"
                    >
                        <div className="flex flex-col gap-2 text-white">
                            <div className="flex font-semibold items-center gap-2.5">
                                <Bell size={24} className="mt-2 lg:mt-0" />
                                <p className="text-lg">Tagihan Aktif</p>
                            </div>
                            <p className="font-medium   leading-6 ml-9">
                                Segera lakukan pembayaran pada tagihan anda,
                                untuk menghindari denda keterlambatan.
                            </p>{" "}
                        </div>

                        <Button
                            asChild
                            className="w-full  lg:w-auto bg-white text-primary hover:bg-gray-100"
                        >
                            <Link
                                href="/tagihan"
                                as="button"
                                className="mt-4  "
                            >
                                Tagihan
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
            <div className="grid gap-3 lg:px-56 mt-3 grid-cols-1">
                <div className="w-full flex gap-3 border  rounded-md p-8">
                    <NotepadText
                        size={36}
                        className="p-2 w-10 text-white bg-foreground/50 dark:bg-foreground/10 rounded-xl"
                    />
                    <div className="flex flex-col w-full mt-1 gap-1">
                        <span className="text-xl font-bold">
                            {" "}
                            {billsPay === 0 ? (
                                <span className="text-base font-medium">
                                    Belum Ada
                                </span>
                            ) : (
                                billsPay
                            )}
                        </span>
                        <span className="text-sm font-semibold text-foreground/50">
                            Tagihan Yang Sudah Dibayar
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex lg:px-56 flex-col gap-2 mt-4  lg:flex-row">
                {" "}
                <div className="w-full lg:w-full border  rounded-md p-8">
                    <p className="text-lg font-semibold">Rincian Tagihan</p>
                    <div className="flex flex-col mt-4 gap-2">
                        {needs.map((need) => (
                            <div
                                className="flex items-center justify-between"
                                key={need.id}
                            >
                                <p className="text-sm font-medium text-foreground/80">
                                    {need.item.name}
                                </p>
                                <p className="text-sm font-medium text-foreground/80">
                                    <FormatRupiah value={need.item.price} />
                                </p>
                            </div>
                        ))}
                        <hr className="my-2 border border-foreground/10" />
                        <div className="flex text-lg font-semibold justify-end gap-4">
                            <p>Total</p>
                            <p>
                                {" "}
                                <FormatRupiah value={totalNeeds} />{" "}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <ResidentLayout tittle="Dashboard" head="Dashboard" children={page} />
);
