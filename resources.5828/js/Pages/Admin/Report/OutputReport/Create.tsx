import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { PageProps } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";

const Create = () => {
    const { active_boarding_branch } = usePage<PageProps>().props;

    const { data, setData, post, clearErrors, errors, reset } = useForm({
        amount: "",
        boarding_branch_id: active_boarding_branch.id,
        date: "",
        type: "manual",
        description: "",
        note: "",
    });
    const [displayPrice, setDisplayPrice] = useState("");
    const [open, setOpen] = useState(false);

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
        setData("amount", numericValue);
        clearErrors("amount");
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.outputreport.store"), {
            data: {
                ...data,
                price: data.amount,
            },
            forceFormData: true,
            onSuccess: () => {
                reset("amount");
                setDisplayPrice("");
            },
            preserveScroll: true,
            preserveState: true,
        });
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Tambah
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Input Pengeluaran</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex mt-4 flex-col gap-5"
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            {" "}
                            <div className="flex flex-col gap-3">
                                <Label variant={"wajib"} htmlFor="amount">
                                    Nominal
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="100.000"
                                    id="amount"
                                    name="amount"
                                    value={displayPrice}
                                    onChange={handlePriceChange}
                                />
                                <InputError message={errors.amount} />
                            </div>
                        </div>{" "}
                        <div className="flex flex-col gap-4">
                            {" "}
                            <div className="flex flex-col gap-3">
                                <Label variant={"wajib"} htmlFor="description">
                                    Deskripsi
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Token Listrik, dll"
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => {
                                        setData("description", e.target.value);
                                        clearErrors("description");
                                    }}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label variant={"wajib"} htmlFor="date">
                                Tanggal
                            </Label>
                            <Input
                                type="date"
                                placeholder="Tanggal"
                                id="date"
                                name="date"
                                value={data.date}
                                onChange={(e) => {
                                    setData("date", e.target.value);
                                    clearErrors("date");
                                }}
                            />
                            <InputError message={errors.date} />
                        </div>{" "}
                        <div className="flex flex-col gap-4">
                            {" "}
                            <div className="flex flex-col gap-3">
                                <Label variant={"optional"} htmlFor="note">
                                    Keterangan
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Masukkan keterangan"
                                    id="note"
                                    name="note"
                                    value={data.note}
                                    onChange={(e) => {
                                        setData("note", e.target.value);
                                        clearErrors("note");
                                    }}
                                />
                                <InputError message={errors.note} />
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
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Create;
