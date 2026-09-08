import { useState } from "react";

import XenditLogo from "../../../../../public/XENDIT.png";
import { PaymentGatewayProps } from "@/types";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";

interface Props {
    paymentGateway: PaymentGatewayProps;
}

const PaymentGateway = ({ paymentGateway }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [showCallbackToken, setShowCallbackToken] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        XENDIT_API_KEY: paymentGateway.XENDIT_API_KEY,
        XENDIT_CALLBACK_TOKEN: paymentGateway.XENDIT_CALLBACK_TOKEN,
    });

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const toggleShowApiKey = () => {
        setShowApiKey((prev) => !prev);
    };

    const toggleShowCallbackToken = () => {
        setShowCallbackToken((prev) => !prev);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("admin.setting.updatePaymentGateway"));
    };
    return (
        <div className="p-6 bg-white dark:bg-zinc-800 mt-4 rounded-md space-y-6 mx-auto shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-center md:space-x-3">
                    <img
                        className=" w-40 -ml-5 md:ml-0"
                        src={XenditLogo}
                        alt="Xendit"
                    />
                    <h2 className="text-xl font-semibold">Pengaturan Xendit</h2>
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
                        API Key
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type={showApiKey ? "text" : "password"}
                            name="XENDIT_API_KEY"
                            disabled={!isEditing}
                            value={data.XENDIT_API_KEY}
                            onChange={(e) =>
                                setData("XENDIT_API_KEY", e.target.value)
                            }
                            className={`w-full px-3 py-2 border rounded-md ${
                                isEditing
                                    ? "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                                    : "bg-gray-100 dark:bg-zinc-700 border-transparent"
                            } focus:outline-none`}
                        />
                        <button
                            type="button"
                            onClick={toggleShowApiKey}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {showApiKey ? "Sembunyikan" : "Tampilkan"}
                        </button>
                    </div>
                    <InputError message={errors.XENDIT_API_KEY} />
                </div>

                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Callback Token
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type={showCallbackToken ? "text" : "password"}
                            name="XENDIT_CALLBACK_TOKEN"
                            disabled={!isEditing}
                            value={data.XENDIT_CALLBACK_TOKEN}
                            onChange={(e) => {
                                setData(
                                    "XENDIT_CALLBACK_TOKEN",
                                    e.target.value
                                );
                            }}
                            className={`w-full px-3 py-2 border rounded-md ${
                                isEditing
                                    ? "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                                    : "bg-gray-100 dark:bg-zinc-700 border-transparent"
                            } focus:outline-none`}
                        />

                        <button
                            type="button"
                            onClick={toggleShowCallbackToken}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {showCallbackToken ? "Sembunyikan" : "Tampilkan"}
                        </button>
                    </div>
                    <InputError message={errors.XENDIT_CALLBACK_TOKEN} />
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

export default PaymentGateway;
