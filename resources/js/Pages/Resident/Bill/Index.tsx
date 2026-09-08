import { Button } from "@/Components/ui/button";
import ResidentLayout from "@/Layouts/ResidentLayout";
import { Resident } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Link } from "@inertiajs/react";
import { CalendarIcon, CircleCheckBig } from "lucide-react";

interface Props {
    resident: Resident;
}
const Index = ({ resident }: Props) => {
    return (
        <>
            <div className="mt-5 lg:px-56 lg:flex lg:w-full lg:mt-20 lg:items-center lg:flex-col lg:gap-3 lg:justify-center ">
                {resident.bills.length > 0 ? (
                    resident.bills.map((bill) => {
                        const isPaymentSubmitted =
                            bill.payment?.status ===
                                "pending_owner_confirmation" ||
                            bill.payment?.status === "waiting_admin_approval";
                        const paymentStatusMessage =
                            bill.payment?.status === "pending_owner_confirmation"
                                ? "Konfirmasi pembayaran berhasil dikirim dan tagihan ini sedang menunggu konfirmasi owner."
                                : "Pembayaran sudah dikonfirmasi dan tagihan sedang diproses.";

                        return (
                            <div
                                key={bill.id}
                                className="mb-4 flex w-full flex-col rounded-lg border bg-secondary/30 p-4 text-foreground/80 shadow-md lg:max-w-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CalendarIcon size={16} />
                                        <p className="text-xs font-semibold md:text-lg">
                                            {bill.end_date}
                                        </p>
                                    </div>
                                    <p className="text-xs font-semibold md:text-lg">
                                        {bill.invoice}
                                    </p>
                                </div>
                                <hr className="my-4 border border-foreground/10" />
                                <p className="text-xs font-medium text-foreground/60 md:text-base">
                                    Detail
                                </p>
                                <div className="mt-2 flex flex-col">
                                    <div>
                                        {bill.detail_bills.map((detailBill) => (
                                            <div
                                                key={detailBill.id}
                                                className="flex items-center justify-between"
                                            >
                                                <p className="text-sm font-medium text-foreground/80 md:text-lg">
                                                    {detailBill.name}
                                                </p>
                                                <p className="text-sm font-medium text-foreground/80 md:text-lg">
                                                    <FormatRupiah
                                                        value={detailBill.price}
                                                    />
                                                </p>
                                            </div>
                                        ))}
                                        {bill.penalty > 0 && (
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-red-500 md:text-lg">
                                                    Denda {bill.penalty_day} Hari
                                                </p>
                                                <p className="text-sm font-medium text-red-500 md:text-lg">
                                                    <FormatRupiah
                                                        value={bill.penalty}
                                                    />
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <hr className="my-4 border border-foreground/10" />
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold md:text-lg">
                                            Total
                                        </p>
                                        <p className="text-sm font-semibold md:text-lg">
                                            <FormatRupiah
                                                value={bill.amount + bill.penalty}
                                            />
                                        </p>
                                    </div>
                                </div>

                                {isPaymentSubmitted ? (
                                    <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            <CircleCheckBig className="mt-0.5 h-5 w-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm font-semibold text-emerald-500 md:text-base">
                                                    Sudah dibayar
                                                </p>
                                                <p className="mt-1 text-xs text-foreground/70 md:text-sm">
                                                    {paymentStatusMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Button asChild className="mt-5">
                                        <Link
                                            href={route("resident.bill.show", bill.id)}
                                        >
                                            Bayar
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="flex  justify-center border items-center w-full h-[64vh] lg:h-[50vh]">
                        <div className="flex items-center flex-col">
                            <p>Belum ada tagihan</p>
                            <p>Untuk Bulan ini</p>
                            <Button
                                asChild
                                className="mt-4"
                                variant={"default"}
                                size={"sm"}
                            >
                                <Link href="/riwayat">
                                    Cek Riwayat Pembayaran
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

Index.layout = (page: React.ReactNode) => (
    <ResidentLayout tittle="Tagihan" head="Tagihan">
        {page}
    </ResidentLayout>
);

export default Index;
