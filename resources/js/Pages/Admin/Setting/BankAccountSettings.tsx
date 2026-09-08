import { useState } from "react";

import { BankAccountProps } from "@/types";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";

interface Props {
    bankAccount: BankAccountProps;
}

const BankAccountSettings = ({ bankAccount }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        bank_account: bankAccount?.bank_account || "",
        bank_account_name: bankAccount?.bank_account_name || "",
        bank_type: bankAccount?.bank_type || "",
    });

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("admin.setting.updateBankAccount"));
    };
    return (
        <div className="p-6 bg-white dark:bg-zinc-800 mt-4 rounded-md space-y-6 mx-auto shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">Pengaturan Rekening</h2>
                </div>
                <button
                    onClick={handleEditToggle}
                    className="px-4 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    {isEditing ? "Kembali" : "Ubah"}
                </button>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nomor Rekening
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="bank_account"
                            disabled={!isEditing}
                            value={data.bank_account}
                            onChange={(e) =>
                                setData(
                                    "bank_account",
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            className={`w-full px-3 py-2 border rounded-md ${
                                isEditing
                                    ? "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                                    : "bg-gray-100 dark:bg-zinc-700 border-transparent"
                            } focus:outline-none`}
                        />
                    </div>
                    <InputError message={errors.bank_account} />
                </div>

                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Jenis Bank
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            name="bank_type"
                            disabled={!isEditing}
                            value={data.bank_type}
                            onChange={(e) => {
                                setData(
                                    "bank_type",
                                    e.target.value.toUpperCase()
                                );
                            }}
                            placeholder="Contoh: BCA, MANDIRI"
                            className={`w-full px-3 py-2 border rounded-md ${
                                isEditing
                                    ? "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                                    : "bg-gray-100 dark:bg-zinc-700 border-transparent"
                            } focus:outline-none`}
                        />
                    </div>
                    <InputError message={errors.bank_type} />
                </div>

                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Pemilik Rekening
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            name="bank_account_name"
                            disabled={!isEditing}
                            value={data.bank_account_name}
                            onChange={(e) => {
                                setData(
                                    "bank_account_name",
                                    e.target.value.toUpperCase()
                                );
                            }}
                            className={`w-full px-3 py-2 border rounded-md ${
                                isEditing
                                    ? "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                                    : "bg-gray-100 dark:bg-zinc-700 border-transparent"
                            } focus:outline-none`}
                        />

                    </div>
                    <InputError message={errors.bank_account_name} />
                </div>
                {isEditing && (
                    <div className="flex justify-end">
                        <Button disabled={processing} type="submit">
                            Simpan
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default BankAccountSettings;
