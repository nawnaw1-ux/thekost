import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { Bill } from "@/types";
import EditDataTwo from "@/Components/EditDataTwo";

interface Props {
    bill: Bill;
}

const Edit = ({ bill }: Props) => {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        status: bill.status,
        date_pay: bill.date_pay ?? "",
        penalty: bill.penalty ?? 0,
        penalty_day: bill.penalty_day ?? 0,
    });

    useEffect(() => {
        if (open) {
            setData({
                status: bill.status,
                date_pay: bill.date_pay ?? "",
                penalty: bill.penalty ?? 0,
                penalty_day: bill.penalty_day ?? 0,
            });
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route("admin.bill.update", bill.id), {
            onSuccess: () => setOpen(false),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <EditDataTwo
            className="h-auto w-[90%]"
            dialogTitle="Edit Data Tagihan"
            showModal={open}
            setShowModal={setOpen}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Label variant="wajib">Status</Label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="status"
                                value="belum lunas"
                                checked={data.status === "belum lunas"}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            />
                            <span>Belum Lunas</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="status"
                                value="denda"
                                checked={data.status === "denda"}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            />
                            <span>Denda</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="status"
                                value="lunas"
                                checked={data.status === "lunas"}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            />
                            <span>Lunas</span>
                        </label>
                    </div>
                    <InputError message={errors.status} />
                </div>

                {/* Conditionally Render Based on Status */}
                {data.status === "lunas" && (
                    <div className="flex flex-col gap-3">
                        <Label variant="wajib" htmlFor="date_pay">
                            Tanggal Bayar
                        </Label>
                        <Input
                            id="date_pay"
                            type="date"
                            value={data.date_pay}
                            onChange={(e) =>
                                setData("date_pay", e.target.value)
                            }
                        />
                        <InputError message={errors.date_pay} />
                    </div>
                )}

                {data.status === "denda" && (
                    <>
                        <div className="flex flex-col gap-3">
                            <Label variant="wajib" htmlFor="penalty">
                                Jumlah Denda
                            </Label>
                            <Input
                                id="penalty"
                                type="text"
                                value={data.penalty}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setData("penalty", value as any);
                                    }
                                }}
                            />
                            <InputError message={errors.penalty} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label variant="wajib" htmlFor="penalty_day">
                                Hari Keterlambatan
                            </Label>
                            <Input
                                id="penalty_day"
                                type="text"
                                value={data.penalty_day}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setData("penalty_day", value as any);
                                    }
                                }}
                            />
                            <InputError message={errors.penalty_day} />
                        </div>
                    </>
                )}

                <div className="flex mt-4 items-center gap-3 justify-end">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => setOpen(false)}
                    >
                        Tutup
                    </Button>
                    <Button type="submit" disabled={processing}>
                        Simpan
                    </Button>
                </div>
            </form>
        </EditDataTwo>
    );
};

export default Edit;
