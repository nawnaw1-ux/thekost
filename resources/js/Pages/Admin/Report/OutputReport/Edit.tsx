import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { PenBox, Plus } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { BoardingBranch, Item, RecordTransaction } from "@/types";
import EditData from "@/Components/EditData";

interface Props {
    record: RecordTransaction;
}
const Edit = ({ record }: Props) => {
    const [open, setOpen] = React.useState(false);
    const { data, post, setData, processing, errors, clearErrors } = useForm({
        amount: record.amount,
        date: record.date,
        id: record.id,
        description: record.description,
        note: record.note,
    });
    useEffect(() => {
        if (open) {
            setData("id", record.id);
            setData("amount", record.amount);
            setData("date", record.date);
            setData("description", record.description);
            setData("note", record.note);
        }
    }, [open]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.outputreport-update.update"), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
            },
            preserveScroll: true,
            preserveState: true,
        });
    }
    const [displayPrice, setDisplayPrice] = useState(record.amount);

    function formatPrice(value: string): string {
        const numericValue = value.replace(/\D/g, "");
        // Format with thousand separators
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, "");
        const formattedValue: any = formatPrice(numericValue);

        setDisplayPrice(formattedValue);
        setData("amount", numericValue as any);
        clearErrors("amount");
    }
    return (
        <EditData
            className="h-auto w-[90%]"
            dialogTitle="Edit Data Kos"
            showModal={open}
            setShowModal={setOpen}
        >
            <form onSubmit={handleSubmit} className="flex  flex-col gap-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {" "}
                        <div className="flex flex-col gap-3">
                            <Label variant={"wajib"} htmlFor="amount">
                                Nominal
                            </Label>
                            <Input
                                type="text"
                                placeholder="100.000"
                                id="amount"
                                name="amount"
                                value={displayPrice}
                                onChange={handlePriceChange}
                            />
                            <InputError message={errors.amount} />
                        </div>
                    </div>{" "}
                    <div className="flex flex-col gap-4">
                        {" "}
                        <div className="flex flex-col gap-3">
                            <Label variant={"wajib"} htmlFor="description">
                                Deskripsi
                            </Label>
                            <Input
                                type="text"
                                placeholder="Pemasukkan dari ..."
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => {
                                    setData("description", e.target.value);
                                    clearErrors("description");
                                }}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label variant={"wajib"} htmlFor="date">
                            Tanggal
                        </Label>
                        <Input
                            type="date"
                            placeholder="Tanggal"
                            id="date"
                            name="date"
                            value={data.date}
                            onChange={(e) => {
                                setData("date", e.target.value);
                                clearErrors("date");
                            }}
                        />
                        <InputError message={errors.date} />
                    </div>{" "}
                    <div className="flex flex-col gap-4">
                        {" "}
                        <div className="flex flex-col gap-3">
                            <Label variant={"optional"} htmlFor="note">
                                Keterangan
                            </Label>
                            <Input
                                type="text"
                                placeholder="Masukkan keterangan"
                                id="note"
                                name="note"
                                value={data.note}
                                onChange={(e) => {
                                    setData("note", e.target.value);
                                    clearErrors("note");
                                }}
                            />
                            <InputError message={errors.note} />
                        </div>
                    </div>
                </div>
                <div className="flex mt-4 items-center gap-3 justify-end">
                    <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => setOpen(false)}
                    >
                        Tutup
                    </Button>{" "}
                    <Button type="submit">Simpan</Button>
                </div>
            </form>
        </EditData>
    );
};

export default Edit;
