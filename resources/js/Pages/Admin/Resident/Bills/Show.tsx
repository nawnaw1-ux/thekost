import ShowData from "@/Components/ShowData";
import type { Bill } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import type React from "react";
import { useState } from "react";

interface Props {
    bill: Bill;
}

const Show = ({ bill }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <ShowData
            className=" max-w-2xl h-screen mx-auto"
            dialogTitle={`Tagihan ${bill.invoice} - ${bill.resident.user.name}`}
            showModal={showModal}
            setShowModal={setShowModal}
        >
            <div className="flex flex-col gap-4 overflow-y-auto p-1 pb-4 -mx-1 px-2">
                {/* Penghuni Section */}
                <div className="rounded-md ">
                    <div className="p-2 w-full bg-card-foreground/10">
                        <p className="font-medium">Penghuni</p>
                    </div>
                    <div className="flex flex-col space-y-2 text-sm p-3">
                        <InfoItem
                            label="Nama"
                            value={bill.resident.user.name}
                        />
                        <InfoItem
                            label="Email"
                            value={bill.resident.user.email}
                        />
                        <InfoItem
                            label="Nomor Telepon"
                            value={bill.resident.phone_number}
                        />
                        <InfoItem
                            label="Jenis Kelamin"
                            value={bill.resident.gender}
                        />{" "}
                        <InfoItem
                            label="Plat Kendaraan"
                            value={bill.resident.number_plat}
                        />
                    </div>
                </div>

                {/* Detail Tagihan Section */}
                <div className="rounded-md ">
                    <div className="p-2 w-full bg-card-foreground/10">
                        <p className="font-medium">Detail Tagihan</p>
                    </div>
                    <div className="flex flex-col space-y-2 text-sm p-3">
                        {bill.detail_bills.map((detail) => (
                            <InfoItem
                                key={detail.id}
                                label={detail.name}
                                value={<FormatRupiah value={detail.price} />}
                            />
                        ))}
                        {bill.penalty > 0 && (
                            <InfoItem
                                label={`Denda ${bill.penalty_day} Hari`}
                                value={<FormatRupiah value={bill.penalty} />}
                            />
                        )}
                    </div>
                </div>

                {/* Tagihan Section */}
                <div className="rounded-md ">
                    <div className="p-2 w-full bg-card-foreground/10">
                        <p className="font-medium">Tagihan</p>
                    </div>
                    <div className="flex flex-col space-y-2 text-sm p-3">
                        <InfoItem label="Invoice" value={bill.invoice} />
                        <InfoItem
                            label="Jumlah"
                            value={
                                <FormatRupiah
                                    value={bill.amount + bill.penalty}
                                />
                            }
                        />
                        <InfoItem
                            label="Tanggal Tagihan"
                            value={bill.date_invoice}
                        />
                        <InfoItem label="Tanggal Bayar" value={bill.date_pay} />
                        <InfoItem
                            label="Status"
                            value={
                                <span
                                    className={
                                        bill.status === "lunas"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                >
                                    {bill.status}
                                </span>
                            }
                        />
                        <InfoItem
                            label="Tanggal Jatuh Tempo"
                            value={bill.end_date}
                        />
                    </div>
                </div>

                {/* Pembayaran Section (conditional) */}
                {bill.payment && (
                    <div className="rounded-md overflow-hidden">
                        <div className="p-2 w-full bg-card-foreground/10">
                            <p className="font-medium">Pembayaran</p>
                        </div>
                        <div className="flex flex-col space-y-2 text-sm p-3">
                            <InfoItem
                                label="Status Konfirmasi Owner"
                                value={bill.payment.owner_confirmation_status ?? "-"}
                            />
                        </div>
                    </div>
                )}
            </div>
        </ShowData>
    );
};

// Reusable component for info items
const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <div className="grid grid-cols-[1fr,1.2fr] sm:grid-cols-2 gap-2 items-start">
        <p className="text-foreground/60 break-words">{label}</p>
        <p className="text-right break-words">{value}</p>
    </div>
);

export default Show;
