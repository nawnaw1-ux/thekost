import EditData from "@/Components/EditData";
import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Punishment } from "@/types";
import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { PenBoxIcon } from "lucide-react";

interface PageProps {
    punishment: Punishment;
}

const hari = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const Edit = ({ punishment }: PageProps) => {
    const { data, setData, processing, errors, reset, put, clearErrors } =
        useForm({
            price: punishment.price,
            max_day: punishment.max_day,
        });
    const [displayPrice, setDisplayPrice] = useState(
        formatPrice(punishment.price)
    );

    useEffect(() => {
        setData({
            price: punishment.price,
            max_day: punishment.max_day,
        });
        setDisplayPrice(formatPrice(punishment.price));
    }, [punishment]);

    const [inputError, setInputError] = useState<string | null>(null);

    function formatPrice(value: string | number): string {
        const numericValue = value.toString().replace(/\D/g, "");
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const numericValue: any = value.replace(/\D/g, "");
        const formattedValue = formatPrice(numericValue);

        setDisplayPrice(formattedValue);
        setData("price", numericValue);
        clearErrors("price");
    }

    const submit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        put(route("admin.punishment.update", punishment.id), {
            preserveScroll: true,
        });
    };
    const [open, setOpen] = useState(false);
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    {" "}
                    <button
                        onClick={() => setOpen(true)}
                        className=" hover:bg-red-100/20 border-red-500"
                    >
                        {" "}
                        <PenBoxIcon className="h-4  w-4 text-red-500" />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Denda</DialogTitle>
                    </DialogHeader>{" "}
                    <form
                        onSubmit={submit}
                        className="flex text-start mt-4 gap-5 flex-col "
                    >
                        <div className="flex flex-col gap-2">
                            <Label variant="wajib" htmlFor="price">
                                Denda/Hari
                            </Label>
                            <Input
                                value={displayPrice}
                                name="price"
                                id="price"
                                type="text"
                                placeholder="Rp 100.000"
                                onChange={handlePriceChange}
                            />
                            {inputError && <InputError message={inputError} />}
                            <InputError message={errors.price} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label variant={"wajib"} htmlFor="name">
                                Maksimal Denda
                            </Label>
                            <div className="flex">
                                <Select
                                    value={`${data.max_day}`}
                                    onValueChange={(value) =>
                                        setData("max_day", value as any)
                                    }
                                >
                                    <SelectTrigger className="bg-secondary rounded-l-lg rounded-r-none border-zinc-400/60">
                                        <SelectValue
                                            className="bg-secondary"
                                            placeholder="Pilih Berapa Hari"
                                        />
                                    </SelectTrigger>

                                    <SelectContent className=" bg-secondary">
                                        {hari.map((hari, index) => (
                                            <SelectItem
                                                className="bg-secondary"
                                                key={index}
                                                value={hari.toString()}
                                            >
                                                {hari.toString()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="border bg-secondary border-zinc-400/60 flex rounded-r-xl items-center justify-center px-4">
                                    <p>Hari</p>
                                </div>
                            </div>

                            <InputError message={errors.max_day} />
                        </div>
                        <div className="flex justify-end gap-2 mt-10">
                            <Button
                                className="px-10"
                                variant={"outline"}
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Tutup
                            </Button>
                            <Button
                                type="submit"
                                className="px-10"
                                disabled={processing || !!inputError}
                            >
                                Ubah
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Edit;
