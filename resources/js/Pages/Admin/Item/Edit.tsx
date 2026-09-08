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
import { BoardingBranch, Item } from "@/types";
import EditData from "@/Components/EditData";

interface Props {
    item: Item;
}
const Edit = ({ item }: Props) => {
    const [open, setOpen] = React.useState(false);
    const { data, post, setData, processing, errors, clearErrors } = useForm({
        id: item.id,
        name: item.name,
        price: item.price || "",
    });
    useEffect(() => {
        if (open) {
            setData("id", item.id);
            setData("name", item.name);
            setData("price", item.price);
        }
    }, [open]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.item.update-item"), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
            },
            preserveScroll: true,
            preserveState: true,
        });
    }
    const [displayPrice, setDisplayPrice] = useState(item.price);

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
        setData("price", numericValue);
        clearErrors("price");
    }
    return (
        <EditData
            className="h-auto w-[90%]"
            dialogTitle="Edit Data Kos"
            showModal={open}
            setShowModal={setOpen}
        >
            <form onSubmit={handleSubmit} className="flex  flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Label variant={"wajib"} htmlFor="name">
                        Nama Item
                    </Label>
                    <Input
                        type="text"
                        placeholder="Sewa Kos"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => {
                            setData("name", e.target.value);
                            clearErrors("name");
                        }}
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label variant={"wajib"} htmlFor="price">
                        Harga
                    </Label>
                    <Input
                        type="text"
                        placeholder="100.000"
                        id="price"
                        name="price"
                        value={displayPrice}
                        onChange={handlePriceChange}
                    />
                    <InputError message={errors.price} />
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
