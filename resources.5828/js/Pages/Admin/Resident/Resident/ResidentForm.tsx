import EditData from "@/Components/EditData";
import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Resident } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { Key } from "lucide-react";
import { useEffect, useState, SyntheticEvent } from "react";

interface EditProps {
    resident: Resident;
}
const ResidentForm = ({ resident }: EditProps) => {
    const { data, setData, errors, processing, reset, clearErrors } = useForm({
        name: resident.user.name,
        email: resident.user.email,
        phone_number: resident.phone_number,
        gender: resident.gender,
        id: resident.id,
        password: resident.user.copy_password,
        surname: resident.user.surname,
        number_plat: resident.number_plat,
    });

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        router.post(
            route("admin.resident.updateResident"),
            {
                ...data,
            },
            {
                preserveScroll: true,
                onSuccess: () => {},
            }
        );
    };
    return (
        <form
            className="bg-background mt-4 relative space-y-4 rounded-xl"
            onSubmit={submit}
        >
            {processing && (
                <Spinner className="absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2" />
            )}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col md:w-1/2 gap-6">
                    <div className="flex flex-col gap-3">
                        <Label variant={"wajib"} htmlFor="name">
                            Nama
                        </Label>
                        <Input
                            type="text"
                            placeholder="John Doe"
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
                        <Label variant={"wajib"} htmlFor="surname">
                            Nama panggilan
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
                    </div>
                    <div className="flex flex-col gap-3">
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
                    </div>
                    <div className="flex flex-col gap-3">
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
                </div>{" "}
                <div className="flex flex-col md:w-1/2 gap-6">
                    <div className="flex flex-col gap-3">
                        <Label variant={"wajib"} htmlFor="gender">
                            Jenis Kelamin
                        </Label>
                        <div className="flex mt-2 items-center gap-4">
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
                            <div className="flex mt-1.5 items-center">
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
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label variant={"wajib"} htmlFor="number_plat">
                            Plat Nomor
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
                                    <Key className=" size-5 text-gray-600 absolute z-10 top-2.5  left-2.5" />
                                    <Input
                                        type="text"
                                        className="w-full px-4 py-2  pl-9"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                {errors && errors.password && (
                                    <span className="text-red-500 mt-2 text-sm font-normal bg-red-50 py-2 px-6 border-red-300">
                                        {errors.password}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex  mt-5 justify-end w-full gap-3">
                <Button
                    className="w-1/2 md:w-auto"
                    type="submit"
                    disabled={processing}
                    size={"lg"}
                >
                    Simpan
                </Button>
            </div>
        </form>
    );
};

export default ResidentForm;
