import EditData from "@/Components/EditData";
import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { PageProps, Resident, Item } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import { router, useForm, usePage } from "@inertiajs/react";
import { useEffect, SyntheticEvent } from "react";

interface EditProps {
    resident: Resident;
}

interface Need {
    item_id: number;
}

const ResidentNeedForm = ({ resident }: EditProps) => {
    const { data, setData, errors, processing } = useForm<{
        needs: Need[];
        id_resident: number;
    }>({
        needs: [],
        id_resident: resident.id,
    });

    const { items } = usePage<PageProps>().props;

    // Sinkronisasi data awal dari resident.needs
    useEffect(() => {
        const initialNeeds = resident.needs.map((need) => ({
            item_id: need.item_id,
        }));
        setData("needs", initialNeeds);
    }, []);

    // Fungsi untuk submit form
    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        router.post(
            route("admin.updateNeedResident.update"),
            { ...(data as any) },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Data updated successfully.");
                },
            }
        );
    };

    // Fungsi untuk menangani perubahan checkbox
    const handleCheckboxChange = (itemId: number, isChecked: boolean) => {
        const newNeeds = isChecked
            ? [...data.needs, { item_id: itemId }]
            : data.needs.filter((need) => need.item_id !== itemId);
        setData("needs", newNeeds);
    };

    return (
        <form
            className="bg-background mt-4 relative flex flex-col gap-4 rounded-xl"
            onSubmit={submit}
        >
            {processing && (
                <Spinner className="absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/2" />
            )}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-3 w-full">
                    <Label variant={"wajib"} htmlFor="gender">
                        Keperluan
                    </Label>
                    <div className="flex dark:bg-zinc-900/40 rounded-lg border p-4 flex-col gap-3">
                        <div className="flex text-foreground/80 flex-col text-sm gap-2">
                            {items.map((item: Item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="w-4 h-4 rounded-full"
                                            type="checkbox"
                                            value={item.id}
                                            checked={data.needs.some(
                                                (need) =>
                                                    need.item_id === item.id
                                            )}
                                            onChange={(e) =>
                                                handleCheckboxChange(
                                                    item.id,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                    <FormatRupiah value={item.price} />
                                </div>
                            ))}{" "}
                            <InputError message={errors.needs} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex  md:justify-end w-full gap-3">
                <Button
                    type="reset"
                    className="w-1/2 md:w-auto"
                    disabled={processing}
                    size={"lg"}
                    variant={"outline"}
                >
                    Cancel
                </Button>
                <Button
                    className="w-1/2 md:w-auto"
                    type="submit"
                    disabled={processing}
                    size={"lg"}
                >
                    Simpan
                </Button>
            </div>
        </form>
    );
};

export default ResidentNeedForm;
