import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import RootLayout from "@/Layouts/RootLayout";
import { BankAccountProps, Bill } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Head, router } from "@inertiajs/react";
import { Info } from "lucide-react";
import LeftLogo from "../../../../../public/assets/Logo/logo2.png";
import { useState, type ReactNode } from "react";

interface BillWithBranch extends Bill {
    boarding_branch?: {
        id: number;
        name: string;
        address: string;
        phone_number: string;
    };
}

interface Props {
    bill: BillWithBranch;
    bankAccount: BankAccountProps | null;
}

const Show = ({ bill, bankAccount }: Props) => {
    const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
    const [showUniqueCodeInfo, setShowUniqueCodeInfo] = useState(false);
    const totalAmount = bill.amount + bill.penalty;
    const uniqueCode = bill.unique_code ?? 0;
    const transferAmount = bill.transfer_amount ?? totalAmount + uniqueCode;
    const formattedTransferAmount = new Intl.NumberFormat("id-ID").format(
        transferAmount,
    );
    const formattedUniqueCode = String(uniqueCode).padStart(3, "0");
    const transferAmountPrefix = formattedTransferAmount.slice(0, -3);
    const transferAmountSuffix = formattedTransferAmount.slice(-3);

    const handlePaymentConfirmation = () => {
        setShowPaymentConfirm(false);
        router.post(
            route("resident.payment.post", {
                bill_id: bill.id,
            }),
        );
    };

    return (
        <>
            <Head title="Pembayaran Tagihan">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="h-[100dvh] overflow-hidden bg-white px-3 py-2 sm:px-6 sm:py-8 lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:overflow-visible lg:bg-[#bcbcbc] lg:px-8"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                <div className="w-full max-w-[900px] lg:mx-auto">
                    <div className="flex h-[calc(100dvh-1rem)] flex-col overflow-y-auto rounded-[24px] bg-[#fcfcfc] shadow-[0_20px_70px_rgba(20,16,37,0.12)] lg:hidden">
                        <div className="shrink-0 rounded-b-[28px] bg-[#5b0a91] px-5 pb-4 pt-5">
                            <img
                                src={LeftLogo}
                                alt="Room Wise Logo"
                                className="h-8 w-auto"
                            />
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col px-5 pb-28 pt-5">
                            <p className="break-words text-[0.9rem] font-extrabold uppercase leading-6 tracking-tight text-[#4d1290]">
                                {bill.invoice}
                            </p>

                            <div className="mt-4 space-y-1.5 text-[0.95rem] leading-7 text-black">
                                {bill.detail_bills.map((detailBill) => (
                                    <div
                                        key={detailBill.id}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <span>{detailBill.name}</span>
                                        <span>
                                            <FormatRupiah
                                                value={detailBill.price}
                                            />
                                        </span>
                                    </div>
                                ))}

                                <div className="flex items-center justify-between gap-4 text-[0.95rem] font-semibold leading-normal text-[#5b0a91]">
                                    <span className="flex items-center gap-1.5">
                                        <span>Kode Unik</span>
                                        <button
                                            type="button"
                                            aria-label="Info kode unik"
                                            className="text-[#d6c0ff] transition hover:text-white"
                                            onClick={() =>
                                                setShowUniqueCodeInfo(true)
                                            }
                                        >
                                            <Info size={14} />
                                        </button>
                                    </span>
                                    <span className="font-bold text-[#4df05a]">
                                        {formattedUniqueCode}
                                    </span>
                                </div>

                                {bill.penalty > 0 && (
                                    <div className="flex items-center justify-between gap-4 text-red-500">
                                        <span>
                                            Denda {bill.penalty_day} Hari
                                        </span>
                                        <span>
                                            <FormatRupiah
                                                value={bill.penalty}
                                            />
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 border-t-2 border-black pt-2.5">
                                <div className="flex items-center justify-between gap-4 text-[0.95rem]">
                                    <span className="uppercase">
                                        <span className="text-black">
                                            Total
                                        </span>{" "}
                                        Transfer
                                    </span>
                                    <span className="text-black">
                                        Rp {transferAmountPrefix}
                                        <span className="text-[#4df05a]">
                                            {transferAmountSuffix}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <p className="mx-auto mt-4 max-w-[320px] text-center text-[0.68rem] font-semibold leading-4 text-red-500">
                                Harap melakukan pembayaran kos sesuai dengan
                                nominal tagihan kode unik agar pembayaran dapat
                                terverifikasi lebih cepat.
                            </p>

                            <div className="mt-4">
                                <p className="text-[0.95rem] text-black/75">
                                    Total pembayaran :
                                </p>
                                <p className="mt-1.5 text-[1.85rem] font-black leading-none tracking-tight text-black">
                                    Rp {formattedTransferAmount}
                                </p>
                            </div>

                            <div className="mt-8">
                                <div className="grid grid-cols-1 gap-2.5">
                                    <div className="rounded-[14px] bg-[#f7f3ff] px-3 py-2.5">
                                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#816aa7]">
                                            Nama Bank
                                        </p>
                                        <p className="mt-1 text-[0.72rem] font-bold leading-5 text-black">
                                            {bankAccount?.bank_type ?? "-"}
                                        </p>
                                    </div>

                                    <div className="rounded-[14px] bg-[#f7f3ff] px-3 py-2.5">
                                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#816aa7]">
                                            Nomor Rekening
                                        </p>
                                        <p className="mt-1 break-all text-[0.72rem] font-bold leading-5 text-black">
                                            {bankAccount?.bank_account ?? "-"}
                                        </p>
                                    </div>

                                    <div className="rounded-[14px] bg-[#f7f3ff] px-3 py-2.5">
                                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#816aa7]">
                                            Nama Pemilik
                                        </p>
                                        <p className="mt-1 text-[0.72rem] font-bold leading-5 text-black">
                                            {bankAccount?.bank_account_name ?? "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 pb-5 pt-4 lg:hidden">
                        <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-white via-white/95 to-transparent" />
                        <Button
                            className="pointer-events-auto relative h-auto w-full rounded-[10px] bg-[#b58cf4] px-6 py-3.5 text-[0.98rem] font-semibold text-black shadow-[0_14px_30px_rgba(91,10,145,0.2)] hover:bg-[#a97ded]"
                            type="button"
                            onClick={() => setShowPaymentConfirm(true)}
                        >
                            Saya Sudah Bayar
                        </Button>
                    </div>

                    <div className="hidden overflow-hidden rounded-[12px] bg-white shadow-[0_20px_70px_rgba(20,16,37,0.18)] lg:flex lg:min-h-[560px] lg:flex-row">
                        <section className="flex w-full flex-col bg-[#5b0a91] px-6 py-7 text-white sm:px-8 sm:py-8 lg:w-[35%] lg:grid lg:grid-rows-[120px_1fr_52px] lg:px-6 lg:py-7">
                            <div className="flex items-start">
                                <img
                                    src={LeftLogo}
                                    alt="Room Wise Logo"
                                    className="h-10 w-auto sm:h-12 lg:h-12"
                                />
                            </div>

                            <div className="mt-12 lg:-mt-8 lg:self-center">
                                <p className="text-sm font-bold uppercase leading-6 sm:text-base lg:text-[0.9rem]">
                                    {bill.invoice}
                                </p>

                                <div className="mt-5 space-y-2 text-sm sm:text-base lg:text-[0.95rem]">
                                    {bill.detail_bills.map((detailBill) => (
                                        <div
                                            key={detailBill.id}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <span className="text-white/95">
                                                {detailBill.name}
                                            </span>
                                            <span className="font-medium">
                                                <FormatRupiah
                                                    value={detailBill.price}
                                                />
                                            </span>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-between gap-4 leading-normal">
                                        <span className="flex items-center gap-1.5">
                                            <span>Kode Unik</span>
                                            <button
                                                type="button"
                                                aria-label="Info kode unik"
                                                className="text-white/55 transition hover:text-white"
                                                onClick={() =>
                                                    setShowUniqueCodeInfo(true)
                                                }
                                            >
                                                <Info size={14} />
                                            </button>
                                        </span>
                                        <span className="font-bold text-[#59ff77]">
                                            {formattedUniqueCode}
                                        </span>
                                    </div>

                                    {bill.penalty > 0 && (
                                        <div className="flex items-center justify-between gap-4 text-red-200">
                                            <span>
                                                Denda {bill.penalty_day} Hari
                                            </span>
                                            <span className="font-medium">
                                                <FormatRupiah
                                                    value={bill.penalty}
                                                />
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 border-t border-white/35 pt-4">
                                    <div className="flex items-center justify-between gap-4 text-base sm:text-lg lg:text-[1rem]">
                                        <span className="uppercase tracking-wide">
                                            Total Transfer
                                        </span>
                                        <span className="font-semibold text-white">
                                            Rp {transferAmountPrefix}
                                            <span className="text-[#59ff77]">
                                                {transferAmountSuffix}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-12 self-end text-center text-[11px] text-white/90 lg:mt-0 lg:text-[10px]">
                                Copyright 2025 - Room Wise All rights reserved
                            </p>
                        </section>

                        <section className="flex w-full flex-col bg-white px-6 py-7 sm:px-8 sm:py-8 lg:w-[65%] lg:grid lg:grid-rows-[120px_1fr_120px] lg:px-8 lg:py-7">
                            <div className="flex items-center">
                                <div className="min-w-0">
                                    <p className="text-[2rem] font-extrabold uppercase italic leading-none tracking-tight text-[#4d1290] sm:text-[2.4rem] lg:text-[2.25rem]">
                                        {bill.boarding_branch?.name ??
                                            "Pembayaran Tagihan"}
                                    </p>
                                    <p className="mt-2 text-lg text-black/85 sm:text-xl lg:text-[0.98rem]">
                                        {bill.boarding_branch?.address ??
                                            "Informasi alamat cabang belum tersedia"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 lg:mt-0 lg:flex lg:flex-col lg:justify-center">
                                <div className="space-y-2 text-xl font-bold text-black sm:text-2xl lg:text-[1.02rem]">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                                        <span className="min-w-[150px]">
                                            Nama Bank
                                        </span>
                                        <span>
                                            : {bankAccount?.bank_type ?? "-"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                                        <span className="min-w-[150px]">
                                            Nomor Rekening
                                        </span>
                                        <span>
                                            : {bankAccount?.bank_account ?? "-"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                                        <span className="min-w-[150px]">
                                            Nama Pemilik
                                        </span>
                                        <span>
                                            :{" "}
                                            {bankAccount?.bank_account_name ??
                                                "-"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-7 rounded-xl border border-[#8de0ff] bg-[#ffe9e9] px-4 py-4 text-center lg:mx-2 lg:mt-5">
                                    <p className="text-sm font-semibold leading-6 text-red-500 sm:text-base lg:text-[0.95rem]">
                                        Harap melakukan pembayaran kos sesuai
                                        dengan nominal total transfer termasuk
                                        kode unik.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col gap-5 lg:mt-0 lg:flex-row lg:items-end lg:justify-between lg:self-end">
                                <div className="min-w-0">
                                    <p className="text-2xl font-normal text-black/75 sm:text-3xl lg:text-[0.95rem]">
                                        Total pembayaran :
                                    </p>
                                    <p className="mt-2 whitespace-nowrap text-[2.6rem] font-black tracking-[-0.04em] text-black sm:text-[2.9rem] lg:text-[2.35rem]">
                                        Rp {formattedTransferAmount}
                                    </p>
                                </div>

                                <Button
                                    className="h-auto w-full rounded-lg bg-[#b58cf4] px-8 py-4 text-lg font-normal text-black shadow-none hover:bg-[#a97ded] sm:text-xl lg:w-auto lg:min-w-[220px] lg:px-6 lg:py-3.5 lg:text-[0.95rem]"
                                    type="button"
                                    onClick={() => setShowPaymentConfirm(true)}
                                >
                                    Saya Sudah Bayar
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Dialog
                open={showPaymentConfirm}
                onOpenChange={setShowPaymentConfirm}
            >
                <DialogContent className="max-w-[420px] gap-0 rounded-2xl border-0 bg-white p-0 text-black shadow-[0_18px_60px_rgba(0,0,0,0.22)] [&>button]:bg-transparent [&>button]:text-black/55 [&>button]:hover:bg-black/[0.03] [&>button]:hover:text-black/80">
                    <DialogHeader className="px-6 pb-4 pt-7 text-center">
                        <DialogTitle className="text-center text-[1.5rem] font-semibold text-[#202020]">
                            Konfirmasi Pembayaran
                        </DialogTitle>
                        <DialogDescription className="pt-3 text-center text-base leading-7 text-black/70">
                            Pastikan Anda sudah melakukan pembayaran sebesar{" "}
                            <span className="font-semibold text-black">
                                Rp {formattedTransferAmount}
                            </span>{" "}
                            sebelum melanjutkan konfirmasi pembayaran.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="grid grid-cols-2 gap-0 border-t border-black/10">
                        <button
                            type="button"
                            onClick={() => setShowPaymentConfirm(false)}
                            className="w-full border-r border-black/10 py-4 text-center text-lg font-medium text-black/70 transition hover:bg-black/[0.03]"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handlePaymentConfirmation}
                            className="w-full py-4 text-center text-lg font-medium text-[#8f63e9] transition hover:bg-black/[0.03]"
                        >
                            Ya, Lanjutkan
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showUniqueCodeInfo}
                onOpenChange={setShowUniqueCodeInfo}
            >
                <DialogContent className="max-w-[420px] gap-0 rounded-2xl border-0 bg-white p-0 text-black shadow-[0_18px_60px_rgba(0,0,0,0.18)] [&>button]:hidden">
                    <DialogHeader className="px-5 pb-3 pt-6 text-center">
                        <DialogTitle className="text-center text-[1.35rem] font-bold text-[#202020]">
                            Kode Unik
                        </DialogTitle>
                        <DialogDescription className="mx-auto  pt-3 text-center text-[0.95rem] font-medium leading-7 text-black/60">
                            Kode unik ditambahkan pada total tagihan agar
                            pembayaran Anda lebih mudah dikenali dan dapat
                            terverifikasi lebih cepat.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="border-t border-black/10">
                        <button
                            type="button"
                            onClick={() => setShowUniqueCodeInfo(false)}
                            className="w-full py-4 text-center text-[1.1rem] font-semibold text-[#8f63e9] transition hover:bg-black/[0.03]"
                        >
                            OK
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

Show.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Show;
