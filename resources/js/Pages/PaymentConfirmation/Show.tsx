import { Button } from "@/Components/ui/button";
import RootLayout from "@/Layouts/RootLayout";
import { Bill, Payment } from "@/types";
import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";

interface BillWithBranch extends Bill {
    boarding_branch?: {
        id: number;
        name: string;
        address: string;
        phone_number: string;
    };
    unique_code?: number;
    transfer_amount?: number;
}

interface Props {
    bill: BillWithBranch;
    payment: Payment;
    action: "received" | "not-received";
    actionLabel: string;
    actionDescription: string;
    canConfirm: boolean;
}

const Show = ({
    bill,
    payment,
    action,
    actionLabel,
    actionDescription,
    canConfirm,
}: Props) => {
    const totalAmount = bill.amount + bill.penalty;
    const uniqueCode = bill.unique_code ?? 0;
    const transferAmount = bill.transfer_amount ?? totalAmount + uniqueCode;
    const formattedTransferAmount = new Intl.NumberFormat("id-ID").format(
        transferAmount,
    );

    const handleConfirm = () => {
        router.post(
            route("owner.payment-confirmation.confirm", {
                token: payment.owner_confirmation_token,
                action,
            }),
        );
    };

    const currentStatusText =
        payment.owner_confirmation_status === "received"
            ? "Pembayaran sudah dikonfirmasi."
            : payment.owner_confirmation_status === "not_received"
              ? "Pembayaran belum dikonfirmasi."
              : "Menunggu konfirmasi pemilik kos.";

    return (
        <>
            <Head title={`${actionLabel} - ${bill.invoice}`} />

            <div
                className="h-screen overflow-hidden bg-[#f3f3f3] px-4 py-4 sm:px-6 lg:flex lg:items-center lg:justify-center lg:px-8"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                <div className="mx-auto flex h-full w-full max-w-[640px] overflow-hidden rounded-[20px] bg-white shadow-[0_20px_70px_rgba(20,16,37,0.16)] lg:max-h-[calc(100vh-2rem)]">
                    <section className="flex w-full flex-1 flex-col bg-white px-5 py-5 sm:px-7 lg:px-8 lg:py-6">
                        <div>
                            <p className="text-[1.55rem] font-extrabold uppercase italic leading-none tracking-tight text-[#4d1290] sm:text-[1.9rem] lg:text-[2.2rem]">
                                {bill.boarding_branch?.name ??
                                    "Konfirmasi Pembayaran"}
                            </p>
                            <p className="mt-2 text-sm text-black/85 sm:text-base lg:text-[0.92rem]">
                                {bill.boarding_branch?.address ??
                                    "Informasi alamat cabang belum tersedia"}
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="text-base font-bold text-[#2a2a2a] lg:text-[1.05rem]">
                                {actionLabel}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-black/70 sm:text-base lg:text-[0.95rem]">
                                {actionDescription}
                            </p>
                            <p className="mt-3 text-sm font-medium text-[#5b0a91] lg:text-[0.92rem]">
                                {currentStatusText}
                            </p>
                        </div>

                        <div className="mt-4 grid gap-2.5 text-sm text-black/85 sm:text-base lg:text-[0.92rem]">
                            <div className="flex items-start justify-between gap-4">
                                <span>Invoice</span>
                                <span className="max-w-[420px] text-right font-semibold text-black">
                                    {bill.invoice}
                                </span>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <span>Nama Penghuni</span>
                                <span className="text-right font-semibold text-black">
                                    {bill.resident.user.name}
                                </span>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <span>Total Transfer</span>
                                <span className="text-right font-semibold text-black">
                                    Rp {formattedTransferAmount}
                                </span>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <span>Tanggal Tagihan</span>
                                <span className="text-right font-semibold text-black">
                                    {bill.date_invoice}
                                </span>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <span>Jatuh Tempo</span>
                                <span className="text-right font-semibold text-black">
                                    {bill.end_date}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-black/10 px-4 py-4">
                            <p className="text-base font-semibold text-black sm:text-lg lg:text-[1.02rem]">
                                Detail tagihan
                            </p>

                            <div className="mt-3.5 space-y-2.5 text-sm sm:text-[0.95rem] lg:text-[0.92rem]">
                                {bill.detail_bills.map((detailBill) => (
                                    <div
                                        key={detailBill.id}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <span className="text-black/75">
                                            {detailBill.name}
                                        </span>
                                        <span className="font-medium text-black">
                                            Rp{" "}
                                            {new Intl.NumberFormat(
                                                "id-ID",
                                            ).format(detailBill.price)}
                                        </span>
                                    </div>
                                ))}

                                {bill.penalty > 0 && (
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-red-500">
                                            Denda {bill.penalty_day} Hari
                                        </span>
                                        <span className="font-medium text-red-500">
                                            Rp{" "}
                                            {new Intl.NumberFormat(
                                                "id-ID",
                                            ).format(bill.penalty)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-3">
                                    <span className="font-semibold text-black">
                                        Total Pembayaran
                                    </span>
                                    <span className="font-bold text-black">
                                        Rp {formattedTransferAmount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex flex-col gap-3 pt-5 sm:items-end">
                            <Button
                                type="button"
                                className="bg-[#b58cf4] text-black hover:bg-[#a97ded] lg:h-10 lg:px-4 lg:text-[0.92rem]"
                                disabled={!canConfirm}
                                onClick={handleConfirm}
                            >
                                {canConfirm
                                    ? actionLabel
                                    : "Sudah Dikonfirmasi"}
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

Show.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Show;
