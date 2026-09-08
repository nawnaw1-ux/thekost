import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Button } from "@/Components/ui/button";
import { ModeToggle } from "@/Components/mode-toggle";
import { ChevronLeft } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        phone_number: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <AuthLayout head="Forgot Password">
            <div className=" absolute left-10 md:left-[52%] z-[999] top-[49px]">
                <Link href="/">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
            </div>
            <form
                onSubmit={submit}
                className="w-[90%] flex-col flex lg:w-full max-w-md p-5"
            >
                <div className="flex mb-7 justify-center items-center">
                    <ApplicationLogo className="w-24 md:w-32" />
                </div>
                <h1 className=" font-semibold text-2xl mb-1">Lupa Password</h1>
                <p className="text-sm font-normal  text-foreground/70 mb-7">
                    Masukkan No telepon anda dan kami akan mengirimkan link
                    reset password{" "}
                    <strong>Cek Whatsapp anda bila terkirim</strong>
                </p>
                {status && (
                    <div className="mb-4  font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}
                <TextInput
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    value={data.phone_number}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("phone_number", e.target.value)}
                />
                <InputError message={errors.phone_number} className="mt-2" />
                <div className="flex items-center justify-end mt-4">
                    <Button className="ms-4" disabled={processing}>
                        Submit
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
