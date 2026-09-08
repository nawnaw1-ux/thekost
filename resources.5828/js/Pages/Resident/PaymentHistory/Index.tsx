import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Bill, DetailBill } from "@/types";
import { Calendar, CheckCircleIcon, Dot, SearchIcon } from "lucide-react";
import {
    DialogContent,
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import ResidentLayout from "@/Layouts/ResidentLayout";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Button } from "@/Components/ui/button";

interface Props {
    bills: Bill[];
}

const Dashboard = ({ bills }: Props) => {
    const monthNames = [
        "Semua",
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("Semua");
    const [showModal, setShowModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

    const filteredAndSearchedPayments: Bill[] = bills.filter((bill: Bill) => {
        const matchesSearchTerm = bill.invoice
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesMonth =
            selectedMonth === "Semua" || bill.end_date?.includes(selectedMonth);

        return matchesSearchTerm && matchesMonth;
    });

    const openModal = (bill: Bill) => {
        setSelectedBill(bill);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedBill(null);
        setShowModal(false);
    };

    return (
        <>
            <section className="mt-6 lg:px-56">
                <div className="flex items-center w-full justify-between">
                    <div className="relative w-1/2 max-w-lg">
                        <Input
                            type="text"
                            placeholder="Cari Invoice..."
                            className="w-full bg-transparent pl-10 border-e-0 border-t-0 border-l-0 border-b rounded-none focus:ring-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                    <select
                        className="rounded-md dark:bg-background bg-card-foreground/5 font-medium cursor-pointer pl-4 pr-8 text-sm border-zinc-400/70 h-[37px]"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {monthNames.map((month, index) => (
                            <option key={index} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
            </section>
            <div className="mx-auto mt-6 lg:px-56">
                <div className="overflow-hidden shadow-sm sm:rounded-lg">
                    {filteredAndSearchedPayments.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {filteredAndSearchedPayments.map((bill: Bill) => (
                                <div key={bill.id} className="relative">
                                    <button
                                        className="bg-card-foreground/5 border hover:bg-foreground/[0.02] cursor-pointer p-4 rounded-xl w-full"
                                        onClick={() => openModal(bill)}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={36}
                                                    className="p-2 rounded-xl bg-foreground/10"
                                                />
                                                <p className="text-xs items-start flex flex-col md:text-sm text-foreground/80">
                                                    <span className="md:text-xs">
                                                        Jatuh Tempo
                                                    </span>
                                                    <span className="font-bold line-clamp-1">
                                                        {bill.end_date}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <p className="px-4 text-xs md:text-sm font-semibold py-1 rounded-xl bg-foreground/10">
                                                    {bill.invoice}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                    {selectedBill === bill && (
                                        <Dialog
                                            open={showModal}
                                            onOpenChange={closeModal}
                                        >
                                            <DialogContent>
                                                <DialogContent className=" bg-background w-[90%]">
                                                    <div className="absolute  z-[100] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
                                                        <CheckCircleIcon
                                                            className="text-green-600/50  my-4"
                                                            size={120}
                                                        />
                                                    </div>
                                                    <DialogHeader>
                                                        <DialogTitle className="pb-3 text-xl">
                                                            No Invoice :{" "}
                                                            {bill.invoice}
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-2 text-sm">
                                                        <p className="text-base  font-semibold">
                                                            Detail Tagihan
                                                        </p>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {bill.detail_bills.map(
                                                                (
                                                                    item: DetailBill
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        className=" w-full flex  justify-between items-center"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Dot />
                                                                            <span>
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </span>
                                                                        </div>

                                                                        <span className="ml-2 bg-foreground/10 px-2 py-1 rounded">
                                                                            <FormatRupiah
                                                                                value={
                                                                                    item.price
                                                                                }
                                                                            />
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )}
                                                            {bill.penalty >
                                                                0 && (
                                                                <>
                                                                    <li className=" mt-2 w-full flex text-red-500  justify-between items-center">
                                                                        <div className="flex items-center gap-2">
                                                                            <Dot />
                                                                            <span>
                                                                                Denda{" "}
                                                                                {
                                                                                    bill.penalty_day
                                                                                }{" "}
                                                                                Hari
                                                                            </span>
                                                                        </div>

                                                                        <span className="ml-2 bg-foreground/10 px-2 py-1 rounded">
                                                                            <FormatRupiah
                                                                                value={
                                                                                    bill.penalty
                                                                                }
                                                                            />
                                                                        </span>
                                                                    </li>
                                                                </>
                                                            )}
                                                        </ul>
                                                    </div>{" "}
                                                    <div className="space-y-2 text-sm">
                                                        <p className="text-base font-semibold">
                                                            Tagihan
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-foreground/60">
                                                                Jumlah
                                                            </p>
                                                            <span className="ml-2 bg-foreground/10 px-2 py-1 rounded">
                                                                <FormatRupiah
                                                                    value={
                                                                        bill.amount +
                                                                        bill.penalty
                                                                    }
                                                                />
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-foreground/60">
                                                                Tanggal Bayar
                                                            </p>
                                                            <p>
                                                                {bill.date_pay}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-foreground/60">
                                                                Tanggal Jatuh
                                                                Tempo
                                                            </p>
                                                            <p>
                                                                {bill.end_date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring py-3 focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                                                        onClick={() =>
                                                            setShowModal(false)
                                                        }
                                                        target="_blank"
                                                        href={route(
                                                            "resident.donwload.pdf",
                                                            {
                                                                id: bill.id,
                                                            }
                                                        )}
                                                    >
                                                        Download PDF
                                                    </a>
                                                    {" "}
                                                </DialogContent>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center flex-col gap-4 text-lg w-full justify-center h-[60vh]">
                            <img
                                src={"/bg/no-data.png"}
                                className="size-40"
                                alt="No data found"
                            />
                            <span className="max-w-xs text-center">
                                Maaf data yang anda cari tidak ditemukan
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

Dashboard.layout = (page: React.ReactNode) => (
    <ResidentLayout tittle="Riwayat pembayaran" head="Riwayat Pembayaran">
        {page}
    </ResidentLayout>
);

export default Dashboard;
