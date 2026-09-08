import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ContactAdmin } from "@/types";
import { useForm } from "@inertiajs/react";
import React from "react";

interface PageProps {
    contactAdmin: ContactAdmin;
}

const Edit = ({ contactAdmin }: PageProps) => {
    const { data, setData, processing, errors, reset, put } = useForm({
        phone: contactAdmin.phone,
        name: contactAdmin.name,
    });

    const submit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        put(route("admin.contact-admin.update", contactAdmin.id), {
            preserveScroll: true,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Hanya mengizinkan angka
        if (/^\d*$/.test(value)) {
            setData("phone", value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(
                e.key
            )
        ) {
            return;
        }

        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <>
            {processing && (
                <Spinner className="absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2" />
            )}
            <form onSubmit={submit}>
                <div className="flex flex-col gap-2">
                    <Label variant="wajib" htmlFor="name">
                        Nama kontak
                    </Label>
                    <Input
                        value={data.name}
                        name="name"
                        id="name"
                        type="text"
                        placeholder="6281234567890"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="flex flex-col mt-5 gap-2">
                    <Label variant="wajib" htmlFor="phone">
                        Nomor kontak center
                    </Label>
                    <Input
                        value={data.phone}
                        name="phone"
                        id="phone"
                        type="text"
                        placeholder="6281234567890"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <InputError message={errors.phone} />
                </div>
                <div className="flex justify-end gap-2 mt-10">
                    <Button
                        className="px-10"
                        variant={"outline"}
                        type="button"
                        onClick={() => reset()}
                    >
                        Reset
                    </Button>{" "}
                    <Button
                        type="submit"
                        className="px-10"
                        disabled={processing}
                    >
                        Ubah
                    </Button>
                </div>
            </form>
        </>
    );
};

export default Edit;
