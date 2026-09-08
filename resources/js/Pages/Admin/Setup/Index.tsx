"use client";

import type React from "react";
import { useState } from "react";
import { ThumbsUp, Send, Plus, Trash2, X, ChevronUp, Info } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import ApplicationLogo from "@/Components/ApplicationLogo";
import { ModeToggle } from "@/Components/mode-toggle";
import { BoardingService } from "@/types";
import { Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
interface Props {
    branchService: BoardingService;
}

const hari = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export default function Setup({ branchService }: Props) {
    const { post, setData, data, errors, processing } = useForm({
        name_branch: "",
        phone_branch: "",
        address_branch: "",
        room_qty_branch: "",
        punishment: "",
        date_punishment: "",
        items: [{ name: "", price: "" }],
        bank_account: "",
        bank_account_name: "",
        bank_type: "",
    });

    const [displayItemPrices, setDisplayItemPrices] = useState<string[]>([""]);
    const [displayPrice, setDisplayPrice] = useState("");
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (processing) return; // prevent double submit

        // Convert display prices (string with dot separators) to numbers
        const cleanedItems = data.items.map((item) => ({
            ...item,
            price: item.price.toString().replace(/\D/g, ""), // clean format
        }));

        post(route("admin.setup.store"), {
            data: {
                ...data,
                punishment: data.punishment.toString().replace(/\D/g, ""),
                items: cleanedItems,
            },
            forceFormData: true,
            preserveScroll: true,
        });
    }

    const addItem = () => {
        setData("items", [...data.items, { name: "", price: "" }]);
        setDisplayItemPrices([...displayItemPrices, ""]);
    };

    const removeItem = (index: number) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index)
        );
        setDisplayItemPrices(displayItemPrices.filter((_, i) => i !== index));
    };

    function formatPrice(value: string): string {
        const numericValue = value.replace(/\D/g, "");
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, "");
        const formattedValue = formatPrice(numericValue);

        setDisplayPrice(formattedValue);
        setData("punishment", numericValue);
    }
    const handleItemChange = (index: number, field: string, value: string) => {
        const updatedItems = data.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData("items", updatedItems);

        if (field === "price") {
            const numeric = value.replace(/\D/g, "");
            const formatted = formatPrice(numeric);
            const updatedDisplayPrices = displayItemPrices.map((price, i) =>
                i === index ? formatted : price
            );
            setDisplayItemPrices(updatedDisplayPrices);
        }
    };
    return (
        <Card className="w-full  dark:bg-zinc-900 relative border-none my-12 max-w-2xl mx-auto">
            <div className="absolute right-5 ">
                <ModeToggle />
            </div>

            <CardHeader>
                <CardTitle className="text-2xl font-semibold flex justify-center flex-col items-center text-center">
                    <ApplicationLogo className="h-16 mb-5" />
                    Form Kos Pertama
                </CardTitle>
                <CardTitle className="text-sm md:text-base text-foreground/70 flex justify-center flex-col items-center text-center">
                    Halaman ini bertujuan untuk membuat Cabang kos pertamamu!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div className="space-y-4">
                        <Label>Nama Kos</Label>
                        <Input
                            value={data.name_branch}
                            onChange={(e) =>
                                setData("name_branch", e.target.value)
                            }
                            placeholder="Masukkan Nama Kos"
                        />
                        <InputError message={errors.name_branch} />
                    </div>{" "}
                    <div className="space-y-4">
                        <Label>No Telepon</Label>
                        <Input
                            value={data.phone_branch}
                            onChange={(e) =>
                                setData("phone_branch", e.target.value)
                            }
                            placeholder="Masukkan No Telepon"
                        />
                        <InputError message={errors.phone_branch} />
                    </div>{" "}
                    <div className="space-y-4">
                        <Label>Alamat Kos</Label>
                        <Input
                            value={data.address_branch}
                            onChange={(e) =>
                                setData("address_branch", e.target.value)
                            }
                            placeholder="Masukkan Alamat Kos"
                        />
                        <InputError message={errors.address_branch} />
                    </div>
                    <div className="space-y-4">
                        <Label>
                            Jumlah Kamar{" "}
                            <span className="text-red-500 font-normal ml-2">
                                *Kuota {branchService.room_qty} Kamar
                            </span>
                        </Label>
                        <Input
                            max={branchService.room_qty}
                            min={1}
                            type="number"
                            value={data.room_qty_branch}
                            onChange={(e) =>
                                setData("room_qty_branch", e.target.value)
                            }
                            placeholder="Masukkan Jumlah Kamar"
                        />
                        <InputError message={errors.room_qty_branch} />
                    </div>
                    <div className="space-y-4">
                        <Label>Nominal Denda</Label>
                        <Input
                            type="text"
                            value={displayPrice}
                            onChange={handlePriceChange}
                            placeholder="100.000"
                        />
                        <InputError message={errors.punishment} />
                    </div>
                    <div className="space-y-4">
                        <Label>Maksimal Denda</Label>
                        <div className="flex">
                            <Select
                                onValueChange={(value) =>
                                    setData("date_punishment", value)
                                }
                            >
                                <SelectTrigger className="bg-transparent w-44 rounded-l-lg rounded-r-none border-zinc-400/60">
                                    <SelectValue placeholder="Pilih Berapa Hari" />
                                </SelectTrigger>

                                <SelectContent>
                                    {hari.map((hari, index) => (
                                        <SelectItem
                                            key={index}
                                            value={hari.toString()}
                                        >
                                            {hari.toString()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="border border-zinc-400/60 flex rounded-r-xl items-center justify-center px-4">
                                <p>Hari</p>
                            </div>
                        </div>

                        <InputError message={errors.date_punishment} />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Item</h3>
                        {data.items.map((item, index) => (
                            <div key={index} className="p-4 border rounded-md ">
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
                                        (errors as any)[`items.${index}.name`]
                                    }
                                />

                                <Label>Harga Item</Label>
                                <Input
                                    className=" mt-3"
                                    type="text"
                                    value={displayItemPrices[index] || ""}
                                    onChange={(e) =>
                                        handleItemChange(
                                            index,
                                            "price",
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    placeholder="Masukkan harga item"
                                />
                                <InputError
                                    className=" my-3"
                                    message={
                                        (errors as any)[`items.${index}.price`]
                                    }
                                />
                                <div className="flex justify-end">
                                    {data.items.length > 1 && (
                                        <Button
                                            className=" mt-5"
                                            variant="destructive"
                                            onClick={() => removeItem(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />{" "}
                                            Hapus Item
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            onClick={addItem}
                            className="w-full"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Item
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Bank Account</h3>
                        <div className="p-4 space-y-4 rounded-lg border">
                            {" "}
                            <div className="space-y-4">
                                <Label>Bank Account</Label>
                                <Input
                                    type="text"
                                    value={data.bank_account}
                                    onChange={(e) =>
                                        setData("bank_account", e.target.value)
                                    }
                                    placeholder="Masukkan nomor rekening"
                                />
                                <InputError message={errors.bank_account} />
                            </div>{" "}
                            <div className="space-y-4">
                                <Label>Jenis Bank</Label>
                                <Input
                                    type="text"
                                    value={data.bank_type}
                                    onChange={(e) =>
                                        setData(
                                            "bank_type",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Contoh: BCA, MANDIRI"
                                />
                                <InputError message={errors.bank_type} />
                            </div>{" "}
                            <div className="space-y-4">
                                <Label>Name Bank Account</Label>
                                <Input
                                    type="text"
                                    value={data.bank_account_name}
                                    onChange={(e) =>
                                        setData(
                                            "bank_account_name",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Masukkan nama bank"
                                />
                                <InputError
                                    message={errors.bank_account_name}
                                />
                            </div>{" "}
                        </div>
                    </div>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
