import { FormEventHandler, useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import AuthLayout from "@/Layouts/AuthLayout";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/Components/ui/input-otp";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";

const ConfirmOTPPassword = () => {
    const { data, setData, post, processing, errors } = useForm({
        otp: "",
        id: "",
        phone_number: "",
    });

    const handleOTPChange = (otpValue: string) => {
        setData("otp", otpValue);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("confirmOTP.store"));
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setData((prevData) => ({
            ...prevData,
            id: searchParams.get("id") || "",
            phone_number: searchParams.get("pn") || "",
        }));
    }, []);

    return (
        <AuthLayout head="Reset Password">
            <form
                onSubmit={submit}
                className="w-[90%] flex-col flex lg:w-full max-w-md p-5"
            >
                <div className="flex mb-7 justify-center items-center">
                    <ApplicationLogo className="w-24 md:w-32" />
                </div>
                <h1 className="font-semibold text-2xl mb-1">Reset Password</h1>
                <p className="text-sm font-normal text-foreground/70 mb-7">
                    Masukkan Kode OTP yang sudah terkirim di Whatsapp{" "}
                    <strong>Cek Whatsapp anda bila terkirim</strong>
                </p>
                <div className="flex justify-center">
                    <InputOTP
                        maxLength={6}
                        onChange={handleOTPChange}
                        value={data.otp}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                {errors.otp && (
                    <p className="text-red-500 text-sm">{errors.otp}</p>
                )}
                <Button
                    disabled={processing || data.otp.length < 6}
                    className="mt-7"
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ConfirmOTPPassword;
