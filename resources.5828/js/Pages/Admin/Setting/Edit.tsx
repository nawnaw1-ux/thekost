import React, { useEffect } from "react";
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
import { BoardingBranch } from "@/types";
import EditData from "@/Components/EditData";

interface Props {
    boardingBranch: BoardingBranch;
}
const Edit = ({ boardingBranch }: Props) => {
    const [open, setOpen] = React.useState(false);
    const { data, post, setData, processing, errors, clearErrors } = useForm({
        id: boardingBranch.id,
        name: boardingBranch.name,
        address: boardingBranch.address,
        phone_number: boardingBranch.phone_number,
    });
    useEffect(() => {
        if (open) {
            setData("id", boardingBranch.id);
            setData("name", boardingBranch.name);
            setData("address", boardingBranch.address);
            setData("phone_number", boardingBranch.phone_number);
        }
    }, [open]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.boardingbranch.update", boardingBranch.id), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
            },
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <EditData
            className="h-auto w-[90%]"
            dialogTitle={`Edit Cabang -  ${boardingBranch.name}`}
            showModal={open}
            setShowModal={setOpen}
        >
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col  gap-3">
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
                <div className="flex flex-col mt-6 gap-3">
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
                <div className="flex flex-col mt-6 gap-3">
                    <Label variant={"wajib"} htmlFor="phone_number">
                        No Telepon Owner Kos
                    </Label>
                    <Input
                        type="text"
                        placeholder="Nomor Telepon"
                        id="phone_number"
                        className="bg-secondary"
                        name="phone_number"
                        value={data.phone_number}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, ""); // Hanya angka
                            setData("phone_number", value);

                            // Validasi menggunakan regex untuk nomor telepon Indonesia
                            const indonesianPhoneRegex =
                                /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
                            if (
                                !indonesianPhoneRegex.test(value) &&
                                value !== ""
                            ) {
                                errors.phone_number =
                                    "Nomor telepon tidak valid";
                            } else {
                                clearErrors("phone_number");
                            }
                        }}
                    />
                    <InputError message={errors.phone_number} />
                </div>
                <div className="flex mt-10 items-center gap-3 justify-end">
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
