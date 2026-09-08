import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { PageProps } from "@/types";
import SorryImage from "../../../../../public/assets/Logo/sorry.png";
import { cn } from "@/lib/utils";
interface Props {
    quota: number;
    className: string;
}

const hari = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const Create = ({ quota, className }: Props) => {
    const [open, setOpen] = React.useState(false);
    const { room_qty } = usePage<PageProps>().props;

    const [displayItemPrices, setDisplayItemPrices] = useState<string[]>([""]);
    const { data, post, setData, reset, processing, errors, clearErrors } =
        useForm({
            name: "",
            address: "",
            phone_number: "",
            room_qty: "",
            punishment: "",
            max_day: "",
            items: [{ name: "", price: "" }],
        });
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.boardingbranch.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset("name", "address", "phone_number");
                setOpen(false);
            },
            preserveScroll: true,
            preserveState: true,
        });
    }
    function formatPrice(value: string): string {
        const numericValue = value.replace(/\D/g, "");
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const formatNumber = (value: any) => {
        if (!value) return "";
        return new Intl.NumberFormat("id-ID").format(value);
    };

    const parseNumber = (value: any) => {
        return value.replace(/\./g, ""); // Hapus titik dari format angka
    };
    const handleItemChange = (index: number, field: string, value: string) => {
        const updatedItems = data.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData("items", updatedItems);

        if (field === "price") {
            const updatedDisplayPrices = displayItemPrices.map((price, i) =>
                i === index ? formatPrice(value) : price
            );
            setDisplayItemPrices(updatedDisplayPrices);
        }
    };
    const removeItem = (index: number) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index)
        );
        setDisplayItemPrices(displayItemPrices.filter((_, i) => i !== index));
    };
    const addItem = () => {
        setData("items", [...data.items, { name: "", price: "" }]);
        setDisplayItemPrices([...displayItemPrices, ""]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {" "}
                <Button className={className}>
                    <Plus size={18} />
                    <p> Tambah Kos</p>
                </Button>
            </DialogTrigger>
            <DialogContent className=" max-w-2xl h-[500px]  md:h-[70vh] overflow-y-auto">
                {quota === 0 ? (
                    <div
                        className="flex flex-col justify-center items-center text-center py-6  gap-2
                    "
                    >
                        <img className="w-24" src={SorryImage} alt="Sorry" />
                        <p className="text-lg mt-2  w-4/5">
                            Mohon maaf tidak bisa menambah cabang kos, Kuota
                            cabang kos telah terpenuhi
                        </p>
                        <Button className=" mt-4">Upgrade Layanan</Button>
                    </div>
                ) : (
                    <>
                        {" "}
                        <DialogHeader>
                            <DialogTitle>Tambah Cabang Kos </DialogTitle>
                        </DialogHeader>{" "}
                        <form
                            onSubmit={handleSubmit}
                            className="flex mt-4 flex-col gap-5"
                        >
                            {" "}
                            <div className="flex flex-col mt-3 gap-3">
                                <Label variant={"wajib"} htmlFor="name">
                                    Nama
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Nama Kos"
                                    id="name"
                                    className="bg-secondary"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData("name", e.target.value);
                                        clearErrors("name");
                                    }}
                                />
                                <InputError message={errors.name} />
                            </div>{" "}
                            <div className="flex flex-col mt-3 gap-3">
                                <Label variant={"wajib"} htmlFor="name">
                                    Alamat Kos
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Alamat Kos"
                                    id="address"
                                    className="bg-secondary"
                                    name="address"
                                    value={data.address}
                                    onChange={(e) => {
                                        setData("address", e.target.value);
                                        clearErrors("address");
                                    }}
                                />
                                <InputError message={errors.address} />
                            </div>{" "}
                            <div className="flex flex-col mt-3 gap-3">
                                <Label variant={"wajib"} htmlFor="name">
                                    No Telepon Owner Kos
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Sewa Kos"
                                    id="name"
                                    className="bg-secondary"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={(e) => {
                                        setData("phone_number", e.target.value);
                                        clearErrors("phone_number");
                                    }}
                                />
                                <InputError message={errors.phone_number} />
                            </div>{" "}
                            <div className="flex flex-col mt-3 gap-3">
                                <Label variant={"wajib"} htmlFor="name">
                                    Jumlah Kamar{" "}
                                    <span className=" uppercase b">
                                        (Quota tersedia {quota} kamar)
                                    </span>
                                </Label>
                                <Input
                                    type="number"
                                    min={1}
                                    id="name"
                                    className="bg-secondary"
                                    name="room_qty"
                                    placeholder="1"
                                    max={quota}
                                    value={data.room_qty}
                                    onChange={(e) => {
                                        setData("room_qty", e.target.value);
                                        clearErrors("room_qty");
                                    }}
                                />
                                <InputError message={errors.room_qty} />
                            </div>{" "}
                            <div className="flex flex-col md:flex-row  md:items-center p-4 gap-5 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                                <div className="flex flex-1 flex-col gap-3">
                                    <Label variant={"wajib"} htmlFor="name">
                                        Denda
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Sewa Kos"
                                        id="name"
                                        className="bg-secondary"
                                        name="punishment"
                                        value={formatNumber(data.punishment)}
                                        onChange={(e) => {
                                            const rawValue = parseNumber(
                                                e.target.value
                                            );
                                            if (!isNaN(rawValue)) {
                                                setData("punishment", rawValue);
                                                clearErrors("punishment");
                                            }
                                        }}
                                    />
                                    <InputError message={errors.punishment} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label variant={"wajib"} htmlFor="name">
                                        Maksimal Denda
                                    </Label>
                                    <div className="flex">
                                        <Select
                                            onValueChange={(value) =>
                                                setData("max_day", value)
                                            }
                                        >
                                            <SelectTrigger className="bg-secondary w-44 rounded-l-lg rounded-r-none border-zinc-400/60">
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
                            </div>{" "}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Item</h3>
                                {data.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-md "
                                    >
                                        <Label>Nama Item</Label>
                                        <Input
                                            className=" my-3"
                                            value={item.name}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Masukkan nama item"
                                        />
                                        <InputError
                                            className=" my-3"
                                            message={
                                                (errors as any)[
                                                    `items.${index}.name`
                                                ]
                                            }
                                        />

                                        <Label>Harga Item</Label>
                                        <Input
                                            className=" mt-3"
                                            type="text"
                                            value={
                                                displayItemPrices[index] || ""
                                            }
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "price",
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="Masukkan harga item"
                                        />
                                        <InputError
                                            className=" my-3"
                                            message={
                                                (errors as any)[
                                                    `items.${index}.price`
                                                ]
                                            }
                                        />
                                        <div className="flex justify-end">
                                            {data.items.length > 1 && (
                                                <Button
                                                    className=" mt-5"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />{" "}
                                                    Hapus Item
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {errors.items && (
                                    <InputError message={errors.items} />
                                )}
                                <Button
                                    type="button"
                                    onClick={addItem}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Tambah
                                    Item
                                </Button>
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
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Create;
