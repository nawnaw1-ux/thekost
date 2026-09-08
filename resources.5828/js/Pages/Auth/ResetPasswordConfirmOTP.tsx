import { FormEventHandler, useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import AuthLayout from "@/Layouts/AuthLayout";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import InputError from "@/Components/InputError";

const ResetPasswordConfirmOTP = () => {
    const { data, setData, post, processing, errors } = useForm({
        new_password: "",
        new_password_confirmation: "",
        token: "",
        id: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("resetPasswordOTP.store"));
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setData((prevData) => ({
            ...prevData,
            token: searchParams.get("token") || "",
            id: searchParams.get("id") || "",
        }));
    }, []);
    return (
        <AuthLayout head="Reset Password">
            <form
                onSubmit={submit}
                className="w-[90%] flex flex-col lg:w-full max-w-md p-5"
            >
                <div className="flex mb-7 justify-center items-center">
                    <ApplicationLogo className="w-24 md:w-32" />
                </div>
                <h1 className="font-semibold text-2xl mb-1">Password Baru</h1>

                {/* Input Password Baru */}
                <div className="flex mt-4 flex-col gap-2.5">
                    <Label>Password Baru</Label>
                    <div className="relative">
                        <Input
                            id="new_password"
                            type={showPassword ? "text" : "password"}
                            name="new_password"
                            value={data.new_password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("new_password", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-6 -translate-y-1/2"
                        >
                            {showPassword ? (
                                <EyeIcon size={20} />
                            ) : (
                                <EyeOffIcon size={20} />
                            )}
                        </button>
                    </div>
                    {errors.new_password && (
                        <InputError message={errors.new_password} />
                    )}
                </div>

                {/* Input Konfirmasi Password Baru */}
                <div className="flex mt-4 flex-col gap-2.5">
                    <Label>Konfirmasi Password Baru</Label>
                    <div className="relative">
                        <Input
                            id="new_password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            name="new_password_confirmation"
                            value={data.new_password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData(
                                    "new_password_confirmation",
                                    e.target.value
                                )
                            }
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-2 top-6 -translate-y-1/2"
                        >
                            {showConfirmPassword ? (
                                <EyeIcon size={20} />
                            ) : (
                                <EyeOffIcon size={20} />
                            )}
                        </button>
                    </div>
                    {errors.new_password_confirmation && (
                        <InputError
                            message={errors.new_password_confirmation}
                        />
                    )}
                </div>

                <Button disabled={processing} className="mt-7" type="submit">
                    Submit
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordConfirmOTP;
