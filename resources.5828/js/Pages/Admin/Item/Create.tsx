import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Plus } from "lucide-react";
import { PageProps } from "@/types";
const Create: React.FC = () => {
    const { data, setData, errors, processing, reset, post, clearErrors } =
        useForm({
            name: "",
            price: "",
        });

    const [displayPrice, setDisplayPrice] = useState("");

    function formatPrice(value: string): string {
        const numericValue = value.replace(/\D/g, "");
        // Format with thousand separators
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, "");
        const formattedValue = formatPrice(numericValue);

        setDisplayPrice(formattedValue);
        setData("price", numericValue);
        clearErrors("price");
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.item.store"), {
            data: {
                ...data,
                price: data.price,
            },
            forceFormData: true,
            onSuccess: () => {
                reset("name", "price");
                setDisplayPrice("");
            },
            preserveScroll: true,
            preserveState: true,
        });
    }
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {" "}
                <Button className=" hidden md:flex items-center gap-2">
                    <Plus size={18} />
                    <p> Tambah Item</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Item</DialogTitle>
                </DialogHeader>{" "}
                <form
                    onSubmit={handleSubmit}
                    className="flex mt-4 flex-col gap-5"
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
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
                        <Button type="submit" className=" w-20">
                            {processing ? (
                                <Spinner className="size-7" />
                            ) : (
                                "Simpan"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Create;
