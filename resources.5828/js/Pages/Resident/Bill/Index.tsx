import { Button } from "@/Components/ui/button";
import ResidentLayout from "@/Layouts/ResidentLayout";
import { Resident } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Link } from "@inertiajs/react";
import { CalendarIcon } from "lucide-react";

interface Props {
    resident: Resident;
}
const Index = ({ resident }: Props) => {
    return (
        <>
            <div className="mt-5 lg:px-56 lg:flex lg:w-full lg:mt-20 lg:items-center lg:flex-col lg:gap-3 lg:justify-center ">
                {resident.bills.length > 0 ? (
                    resident.bills.map((bill) => (
                        <div
                            key={bill.id}
                            className="flex w-full lg:max-w-xl flex-col p-4 bg-secondary/30 border rounded-lg text-foreground/80 shadow-md mb-4"
                        >
                            <div className="flex items-center justify-between">
                                {" "}
                                <div className="flex items-center gap-2 text-sm">
                                    <CalendarIcon size={16} />
                                    <p className="text-xs md:text-lg font-semibold">
                                        {bill.end_date}
                                    </p>
                                </div>
                                <p className="text-xs md:text-lg font-semibold">
                                    {bill.invoice}
                                </p>{" "}
                            </div>
                            <hr className="my-4 border border-foreground/10" />
                            <p className="text-xs md:text-base font-medium text-foreground/60">
                                Detail
                            </p>
                            <div className="flex mt-2 flex-col">
                                <div>
                                    {bill.detail_bills.map((detailBill) => (
                                        <div
                                            key={detailBill.id}
                                            className="flex items-center justify-between"
                                        >
                                            <p className="text-sm md:text-lg text-foreground/80 font-medium">
                                                {detailBill.name}
                                            </p>
                                            <p className="text-sm md:text-lg text-foreground/80 font-medium">
                                                <FormatRupiah
                                                    value={detailBill.price}
                                                />
                                            </p>
                                        </div>
                                    ))}
                                    {bill.penalty > 0 && (
                                        <div className="flex  items-center justify-between">
                                            <p className="text-sm md:text-lg text-red-500 font-medium">
                                                Denda {bill.penalty_day} Hari
                                            </p>
                                            <p className="text-sm md:text-lg text-red-500 font-medium">
                                                <FormatRupiah
                                                    value={bill.penalty}
                                                />
                                            </p>
                                        </div>
                                    )}
                                </div>{" "}
                                <hr className="my-4 border border-foreground/10" />
                                <div className="flex  items-center justify-between">
                                    <p className="text-sm md:text-lg font-semibold">
                                        Total
                                    </p>
                                    <p className="text-sm md:text-lg font-semibold">
                                        <FormatRupiah
                                            value={bill.amount + bill.penalty}
                                        />
                                    </p>
                                </div>
                            </div>{" "}
                            <Button asChild className="mt-5">
                                <Link
                                    as="button"
                                    method="post"
                                    href={route("resident.payment.post", {
                                        bill_id: bill.id,
                                    })}
                                >
                                    Bayar
                                </Link>
                            </Button>
                        </div>
                    ))
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
