import React, { useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";

import { PageProps } from "@/types";
import InputError from "@/Components/InputError";

interface Props {
    number_room: string;
    boarding_branch_id: number;
}

const Create = ({ number_room, boarding_branch_id }: Props) => {
    const { items, residentDontHaveRoomInBoardingBranch } =
        usePage<PageProps>().props;

    const [selectedItem, setSelectedItem] = React.useState<
        { id: number; name: string; price: number }[]
    >([]);
    const [totalBill, setTotalBill] = React.useState(0);

    const { data, setData, errors, processing, reset, post, clearErrors } =
        useForm({
            number_room: number_room,
            boarding_branch_id: boarding_branch_id,
            item: selectedItem as any,
            resident_1: "",
            resident_2: "",
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setData("item", selectedItem as any);
        post(route("admin.room.store"), {
            data: {
                ...data,
            },
            forceFormData: true,
            onSuccess: () => {},
            preserveScroll: true,
            preserveState: true,
        });
    };

    useEffect(() => {
        setData("boarding_branch_id", boarding_branch_id);
        setData("number_room", number_room);
        setData("item", selectedItem as any);
    }, [number_room, boarding_branch_id, selectedItem, totalBill]);

    useEffect(() => {
        const total = selectedItem.reduce((acc, item) => acc + item.price, 0);
        setTotalBill(total);
    }, [selectedItem]);

    const toggleItemSelection = (item: {
        id: number;
        name: string;
        price: number;
    }) => {
        setSelectedItem((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) {
                return prev.filter((i) => i.id !== item.id);
            }
            return [...prev, item];
        });
    };
    console.log(errors);
    return (
        <form onSubmit={handleSubmit} className="flex mt-2 flex-col gap-5">
            <div className="flex flex-col gap-3">
                <Label htmlFor="resident_1">Penghuni 1</Label>
                <Select onValueChange={(value) => setData("resident_1", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Penghuni 1" />
                    </SelectTrigger>
                    <SelectContent>
                        {residentDontHaveRoomInBoardingBranch.map((item) => (
                            <SelectItem key={item.id} value={`${item.id}`}>
                                {item.user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.resident_1} />
            </div>
            <div className="flex flex-col gap-3">
                <Label htmlFor="resident_2">
                    Penghuni 2
                    <span className="text-red-500 ml-2">
                        (Optional jika ada)
                    </span>
                </Label>
                <Select onValueChange={(value) => setData("resident_2", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Penghuni 2" />
                    </SelectTrigger>
                    <SelectContent>
                        {residentDontHaveRoomInBoardingBranch.map((item) => (
                            <SelectItem key={item.id} value={`${item.id}`}>
                                {item.user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>{" "}
                <InputError message={errors.resident_2} />
            </div>
            <div className="flex flex-col gap-3">
                <Label>Keperluan</Label>
                <div className="flex text-foreground/80 h-20 overflow-y-auto flex-col text-sm gap-2">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    className="w-4 h-4 rounded-full"
                                    type="checkbox"
                                    value={item.id}
                                    onChange={() =>
                                        toggleItemSelection({
                                            id: item.id,
                                            name: item.name,
                                            price: item.price,
                                        })
                                    }
                                />
                                <span>{item.name}</span>
                            </div>
                            <FormatRupiah value={item.price} />
                        </div>
                    ))}
                </div>
                <InputError message={errors.item} />
            </div>
            <div className="flex items-center justify-between text-sm">
                <Label>Total Tagihan/Bulan</Label>
                <div className="text-lg font-semibold">
                    <FormatRupiah value={totalBill} />
                </div>
            </div>
            <div className="flex mt-4 items-center gap-3 justify-end">
                <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => reset()}
                >
                    Tutup
                </Button>
                <Button type="submit">Simpan</Button>
            </div>
        </form>
    );
};

export default Create;
