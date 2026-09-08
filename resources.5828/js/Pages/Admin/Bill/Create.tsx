import InputError from "@/Components/InputError";
import SelectOptionCustom from "@/Components/SelectOptionCustom";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { PageProps } from "@/types";
import { useForm, usePage } from "@inertiajs/react";

const Create: React.FC = () => {
    const { data, setData, errors, processing, reset, post, clearErrors } =
        useForm({
            resident_id: "",
            end_date: "",
        });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.bill.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset("end_date", "resident_id");
            },
            preserveScroll: true,
            preserveState: true,
        });
    }

    const { residents } = usePage<PageProps>().props;

    return (
        <form
            className=" bg-background border relative mt-4 flex flex-col gap-4 rounded-xl p-4"
            onSubmit={handleSubmit}
        >
            {processing && (
                <Spinner className="absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2" />
            )}

            <SelectOptionCustom
                labelVariant="wajib"
                optionName="Pilih Penghuni"
                htmlFor="resident_id"
                labelName="Penghuni"
                optionMap={residents.map((group, groupIndex) => (
                    <option key={groupIndex} value={group.id}>
                        {group.user.name}
                    </option>
                ))}
                errors={errors.resident_id}
                selectOptionProps={{
                    name: "resident_id",
                    value: data.resident_id,
                    onChange: (e: any) => {
                        setData({
                            ...data,
                            resident_id: e.target.value,
                        });
                    },
                }}
            />
            <div className="flex flex-col gap-3">
                <Label variant={"wajib"} htmlFor="end_date">
                    Tagihan pertama
                </Label>
                <Input
                    type="date"
                    placeholder="2022-12-31"
                    id="name"
                    className="bg-secondary"
                    name="name"
                    value={data.end_date}
                    onChange={(e) => {
                        setData("end_date", e.target.value);
                        clearErrors("end_date");
                    }}
                />
                <InputError message={errors.end_date} />
            </div>
            <div className="flex mt-5 justify-end w-full gap-3">
                <Button
                    type="reset"
                    disabled={processing}
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => {
                        reset();
                    }}
                >
                    Reset
                </Button>
                <Button type="submit" disabled={processing} size={"lg"}>
                    Simpan
                </Button>
            </div>
        </form>
    );
};

export default Create;
