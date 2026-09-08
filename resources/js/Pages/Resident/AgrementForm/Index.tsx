import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { ModeToggle } from "@/Components/mode-toggle";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Head, router } from "@inertiajs/react";

interface Props {
    link_google_form: string;
}

const Index = ({ link_google_form }: Props) => {
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = () => {
        if (agreed) {
            router.post(route("kos.agreement.store"));
        }
    };

    return (
        <>
            <Head title="Upload Data" />
            <Card className="w-full dark:bg-zinc-900 relative border-none my-12 max-w-2xl mx-auto">
                <div className="absolute right-5">
                    <ModeToggle />
                </div>

                <CardHeader>
                    <CardTitle className="text-2xl font-semibold flex justify-center flex-col items-center text-center">
                        <ApplicationLogo className="h-16 mb-5" />
                        Upload Data Diri
                    </CardTitle>
                    <CardTitle className="text-sm md:text-base text-foreground/70 flex justify-center flex-col items-center text-center">
                        Halaman ini berfungsi sebagai halaman upload data diri
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">
                            Isi form dibawah ini
                        </h3>
                    </div>
                    <a
                        target="_blank"
                        href={link_google_form}
                        className=" p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border flex items-center gap-2.5"
                    >
                        <img
                            className=" size-7"
                            src={
                                "https://upload.wikimedia.org/wikipedia/commons/c/c2/Google_Forms_logo_%282014-2020%29.svg"
                            }
                            alt=""
                        />
                        Link Google Form
                    </a>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="agree"
                            checked={agreed}
                            onCheckedChange={(checked) => setAgreed(!!checked)}
                        />
                        <Label htmlFor="agree" className="text-sm">
                            Saya telah mengisi data diri, membaca dan menyetujui
                            peraturan kos.
                        </Label>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!agreed}
                    >
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default Index;
