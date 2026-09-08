import ShowData from "@/Components/ShowData";
import { Bill } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import React, { useState } from "react";

interface Props {
    bill: Bill;
}

const Show = ({ bill }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <ShowData
            dialogTitle={`Tagihan ${bill.invoice} - ${bill.resident.user.name}`}
            showModal={showModal}
            setShowModal={setShowModal}
        >
            <div className="p-2 w-full bg-card-foreground/10">
                <p>Penghuni</p>
            </div>
            <div className="flex flex-col space-y-1 text-sm">
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Nama</p>
                    <p>{bill.resident.user.name}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Email</p>
                    <p>{bill.resident.user.email}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Nomor Telepon</p>
                    <p>{bill.resident.phone_number}</p>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Jenis Kelamin</p>
                    <p>{bill.resident.gender}</p>
                </div>
            </div>
            <div className="p-2 w-full bg-card-foreground/10">
                <p>Detail Tagihan</p>
            </div>
            <div className="flex flex-col space-y-1 text-sm">
                {bill.detail_bills.map((detail) => (
                    <div
                        key={detail.id}
                        className="flex items-center justify-between"
                    >
                        <p className="text-foreground/60">{detail.name}</p>
                        <p>
                            {" "}
                            <FormatRupiah value={detail.price} />
                        </p>
                    </div>
                ))}
                {bill.penalty > 0 && (
                    <div className="flex items-center justify-between">
                        <p className="text-foreground/60">
                            Denda {bill.penalty_day} Hari
                        </p>
                        <p>
                            {" "}
                            <FormatRupiah value={bill.penalty} />
                        </p>
                    </div>
                )}
            </div>

            <div className="p-2 w-full bg-card-foreground/10">
                <p>Tagihan</p>
            </div>
            <div className="flex flex-col space-y-1 text-sm">
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Invoice</p>
                    <p>{bill.invoice}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Jumlah</p>
                    <FormatRupiah value={bill.amount + bill.penalty} />
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Tanggal Tagihan</p>
                    <p>{bill.date_invoice}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Tanggal Bayar</p>
                    <p>{bill.date_pay}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Status</p>
                    <p
                        className={
                            bill.status === "lunas"
                                ? "text-green-600"
                                : "text-red-600"
                        }
                    >
                        {bill.status}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/60">Tanggal Jatuh Tempo</p>
                    <p>{bill.end_date}</p>
                </div>
            </div>
            {bill.payment && (
                <>
                    <div className="p-2 w-full bg-card-foreground/10">
                        <p>Pembayaran</p>
                    </div>{" "}
                    <div className="flex flex-col space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-foreground/60">Channel</p>
                            <p>{bill.payment.payment_channel}</p>
                        </div>{" "}
                        <div className="flex items-center justify-between">
                            <p className="text-foreground/60">
                                Metode Pembayaran
                            </p>
                            <p>{bill.payment.payment_method}</p>
                        </div>
                    </div>
                </>
            )}
        </ShowData>
    );
};

export default Show;
