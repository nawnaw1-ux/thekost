import React, { useEffect, useState } from "react";

import { Button } from "@/Components/ui/button";
import { ChevronLeft, Key, Plus, Settings } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Link, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { BoardingBranch, PageProps, Room } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { FormatRupiah } from "@arismun/format-rupiah";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface Props {
    active_boarding_branch: BoardingBranch;
    roomEmpty: Room[];
}
const Create = ({ active_boarding_branch, roomEmpty }: Props) => {
    const { items, residentDontHaveRoomInBoardingBranch } =
        usePage<PageProps>().props;
    const [selectedItem, setSelectedItem] = React.useState<{ id: number }[]>(
        []
    );
    const { data, setData, errors, processing, reset, post, clearErrors } =
        useForm({
            boarding_branch_id: active_boarding_branch.id,
            name: "",
            email: "",
            phone_number: "",
            number_plat: "",
            gender: "",
            password: "",
            surname: "",
            end_date: "",
            room_id: "",
            needs: selectedItem,
        });

    useEffect(() => {
        setData("needs", selectedItem);
    }, [selectedItem]);
    const [generatedPassword, setGeneratedPassword] = useState("");
    useEffect(() => {
        if (data.name) {
            const [firstName] = data.name.split(" ");
            setData("surname", firstName);
        }
    }, [data.name]);
    function generatePassword() {
        const randomPassword = Math.random().toString(36).slice(-10);
        setGeneratedPassword(randomPassword);
        setData({
            ...data,
            password: randomPassword,
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setData("needs", selectedItem);
        // Konversi selectedItem ke array ID saja jika diperlukan
        const needsArray = selectedItem.map((item) => item.id);

        post(route("admin.resident.storeResident"), {
            forceFormData: true,
            data: {
                ...data,
                needs: needsArray,
            },
            onSuccess: () => {
                reset(
                    "email",
                    "gender",
                    "name",
                    "surname",
                    "password",
                    "phone_number",
                    "needs"
                );
            },
            preserveScroll: true,
            preserveState: true,
        });
    }
    const toggleItemSelection = (item: { id: number }) => {
        setSelectedItem((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) {
                return prev.filter((i) => i.id !== item.id);
            }
            return [...prev, item];
        });
    };
    return (
        <div className="lg:pl-[295px]  h-screen  relative overflow-y-auto pb-10 md:pt-24 lg:pr-6 space-y-4">
            <form
                onSubmit={handleSubmit}
                className="flex bg-white pt-4 md:py-6 rounded-lg dark:bg-transparent md:dark:bg-zinc-800 max-w-4xl px-6 mx-auto mt-4 flex-col gap-5"
            >
                <Link
                    href="/admin/penghuni"
                    className="flex text-sm items-center gap-1"
                >
                    <ChevronLeft size={24} />
                    <p>Kembali</p>
                </Link>
                <div className="flex mt-2  flex-col w-full md:flex-row gap-3">
                    <div className="flex flex-col  flex-1  gap-3">
                        <Label variant={"wajib"} htmlFor="name">
                            Nama
                        </Label>
                        <Input
                            type="text"
                            placeholder="Nama Penghuni"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => {
                                setData("name", e.target.value);
                                clearErrors("name");
                            }}
                        />
                        <InputError message={errors.name} />
                    </div>{" "}
                    <div className="flex flex-col flex-1  gap-3">
                        <Label variant={"wajib"} htmlFor="surname">
                            Nama Panggilan
                        </Label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            id="surname"
                            name="surname"
                            value={data.surname}
                            onChange={(e) => {
                                setData("surname", e.target.value);
                                clearErrors("surname");
                            }}
                        />
                        <InputError message={errors.surname} />
                    </div>{" "}
                </div>{" "}
                <div className="flex flex-col w-full md:flex-row gap-3">
                    {" "}
                    <div className="flex flex-col  flex-1  gap-3">
                        <Label variant={"wajib"} htmlFor="email">
                            Email
                        </Label>
                        <Input
                            type="email"
                            placeholder="example@mail.com"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => {
                                setData("email", e.target.value);
                                clearErrors("email");
                            }}
                        />
                        <InputError message={errors.email} />
                    </div>{" "}
                    <div className="flex flex-col  flex-1  gap-3">
                        <Label variant={"wajib"} htmlFor="phone_number">
                            Nomor Telepon
                        </Label>
                        <Input
                            type="text"
                            placeholder="08123456789"
                            id="phone_number"
                            name="phone_number"
                            value={data.phone_number}
                            onChange={(e) => {
                                setData("phone_number", e.target.value);
                                clearErrors("phone_number");
                            }}
                        />
                        <InputError message={errors.phone_number} />
                    </div>{" "}
                </div>
                <div className="flex flex-col  flex-1  gap-3">
                    <Label variant={"wajib"} htmlFor="phone_number">
                        Kamar
                    </Label>
                    <Select
                        onValueChange={(value) => setData("room_id", value)}
                    >
                        <SelectTrigger className="bg-transparent border-zinc-400/60 border rounded-md">
                            <SelectValue placeholder="Pilih Kamar" />
                        </SelectTrigger>
                        <SelectContent>
                            {roomEmpty.map((room) => (
                                <SelectItem key={room.id} value={`${room.id}`}>
                                    Kamar {room.number_room}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.room_id} />
                </div>{" "}
                <div className="flex flex-col gap-3">
                    <Label variant={"wajib"} htmlFor="gender">
                        Jenis Kelamin
                    </Label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="Laki-laki"
                                checked={data.gender === "Laki-laki"}
                                onChange={(e) => {
                                    setData("gender", e.target.value);
                                    clearErrors("gender");
                                }}
                                className="mr-2"
                            />
                            <label htmlFor="male">Laki-laki</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="Perempuan"
                                checked={data.gender === "Perempuan"}
                                onChange={(e) => {
                                    setData("gender", e.target.value);
                                    clearErrors("gender");
                                }}
                                className="mr-2"
                            />
                            <label htmlFor="female">Perempuan</label>
                        </div>
                    </div>
                    <InputError message={errors.gender} />
                </div>{" "}
                <div className="flex flex-col gap-3">
                    <Label variant={"optional"} htmlFor="number_plat">
                        Plat Nomor Kendaraan
                    </Label>
                    <Input
                        type="text"
                        placeholder="L 1234 AB"
                        id="number_plat"
                        name="number_plat"
                        value={data.number_plat}
                        onChange={(e) => {
                            setData("number_plat", e.target.value);
                            clearErrors("number_plat");
                        }}
                    />
                    <InputError message={errors.number_plat} />
                </div>{" "}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                    <div className="md:mb-4 flex flex-col gap-2 w-full">
                        <Label
                            variant={"wajib"}
                            className="font-medium text-sm "
                        >
                            Password
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full">
                                <Key className=" size-5 text-gray-600 absolute z-10 top-2.5 left-2.5" />
                                <Input
                                    type="text"
                                    className="w-full px-4 py-2 pl-9"
                                    name="password"
                                    value={data.password || generatedPassword}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                            </div>

                            <Button
                                type="button"
                                className="bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600"
                                onClick={generatePassword}
                            >
                                {" "}
                                <Settings className=" size-5" />
                                Generated
                            </Button>
                        </div>
                        <InputError message={errors.password} />
                    </div>
                </div>{" "}
                <Label>Keperluan</Label>
                <div className="flex dark:bg-zinc-900/40 rounded-lg border p-4 flex-col gap-3">
                    <div className="flex text-foreground/80 flex-col text-sm gap-2">
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
                                            })
                                        }
                                    />
                                    <span>{item.name}</span>
                                </div>
                                <FormatRupiah value={item.price} />
                            </div>
                        ))}
                    </div>{" "}
                    <InputError message={errors.needs} />
                </div>{" "}
                <Label>
                    Tagihan Pertama <span className="text-red-500">*</span>
                </Label>
                <div className="flex dark:bg-zinc-900/40 rounded-lg border p-4 flex-col gap-3">
                    <div className="flex flex-col gap-3">
                        <Input
                            type="date"
                            placeholder="2022-12-31"
                            id="name"
                            className="bg-secondary"
                            name="name"
                            value={data.end_date}
                            onChange={(e) => {
                                setData("end_date", e.target.value);
                                clearErrors("end_date");
                            }}
                        />
                        <InputError message={errors.end_date} />
                    </div>
                </div>
                <div className="flex mt-4 items-center gap-3 justify-end">
                    <Button type="submit" className=" w-20">
                        {processing ? <Spinner className="size-7" /> : "Simpan"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Create;

Create.layout = (page: React.ReactNode) => (
    <AdminLayout head="Tambah Penghuni" children={page} />
);
