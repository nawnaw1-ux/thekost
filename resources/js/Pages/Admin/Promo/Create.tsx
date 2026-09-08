import FileInput from "@/Components/FileInput";
import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { useCallback } from "react";

const Create: React.FC = () => {
    const { data, setData, errors, processing, reset, post, clearErrors } =
        useForm({
            image: "",
        });
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.promo.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset("image");
            },
            preserveScroll: true,
        });
    }

    const handleDrop = useCallback(
        (acceptedFiles: any) => {
            setData("image", acceptedFiles[0]);
        },
        [setData]
    );

    return (
        <form
            className="bg-background border relative mt-4 space-y-4 rounded-xl p-4"
            onSubmit={handleSubmit}
        >
            {processing && (
                <Spinner className="absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2" />
            )}
            <div className="flex flex-col gap-4 ">
                <div className="flex flex-col  gap-3">
                    <div className="flex items-center gap-2">
                        {" "}
                        <Label>Upload Gambar</Label>
                    </div>
                    <FileInput onDrop={handleDrop} accept="image/*" />
                    <InputError message={errors.image} />
                </div>
            </div>
            <div className="flex justify-end w-full gap-3">
                <Button
                    type="reset"
                    disabled={processing}
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => {
                        reset();
                    }}
                    className="mt-5"
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    size={"lg"}
                    className=" mt-5"
                >
                    Simpan
                </Button>
            </div>
        </form>
    );
};

export default Create;
