import { FormEventHandler, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import { Link, useForm, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import useLocalStorage from "use-local-storage";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import AuthLayout from "@/Layouts/AuthLayout";
import { PageProps } from "@/types";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [email, setEmail] = useLocalStorage("email", "");
    const [password, setPassword] = useLocalStorage("password", "");
    const [rememberMe, setRememberMe] = useLocalStorage("rememberMe", false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email || "",
        password: password || "",
        remember: rememberMe,
    });

    const [handleShowPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onError: () => reset("password"),
        });
        const rememberMeCheckbox = document.getElementById(
            "terms"
        ) as HTMLInputElement;
        if (rememberMeCheckbox.checked) {
            setEmail(data.email);
            setPassword(data.password);
            setRememberMe(true);
        } else {
            setEmail("");
            setPassword("");
            setRememberMe(false);
        }
    };
    const { promos, contact } = usePage<PageProps>().props;

    return (
        <AuthLayout head="Login">
            {" "}
            <form
                className=" w-[90%] lg:w-full max-w-md p-5"
                onSubmit={submit}
                method="post"
            >
                <div className="flex mb-7 justify-center items-center">
                    <ApplicationLogo className="w-24 md:w-32" />
                </div>
                {status && (
                    <div className="mt-2 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}
                <div className="flex flex-col gap-2.5">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>{" "}
                <div className="flex mt-4 flex-col gap-2.5">
                    <Label>Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={handleShowPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />{" "}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!handleShowPassword)}
                            className="absolute right-2 top-6 -translate-y-1/2"
                        >
                            {handleShowPassword ? (
                                <EyeIcon size={20} />
                            ) : (
                                <EyeOffIcon size={20} />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} />
                </div>{" "}
                <div className="flex items-center justify-between">
                    <div className="block mt-4 w-1/2">
                        <label className="flex items-center">
                            <Checkbox
                                id="terms"
                                checked={data.remember}
                                name="remember"
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-foreground/70">
                                Ingat Saya
                            </span>
                        </label>
                    </div>
                    {canResetPassword && (
                        <Link
                            className="text-sm mt-3 text-end inline-block w-full text-foreground/70 decoration-2 hover:underline font-medium"
                            href={route("password.request")}
                        >
                            Lupa Password ?
                        </Link>
                    )}
                </div>
                <Button type="submit" className="mt-6 w-full">
                    Login
                </Button>
            </form>
        </AuthLayout>
    );
}
