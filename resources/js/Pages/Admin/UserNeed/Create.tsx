import SelectOptionCustom from "@/Components/SelectOptionCustom";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { PageProps } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import { useForm, usePage } from "@inertiajs/react";
import { CircleX, PlusIcon } from "lucide-react";
import { useState } from "react";

const Create: React.FC = () => {
    const { data, setData, errors, processing, reset, post, clearErrors } =
        useForm({
            resident_id: "",
            items_id: [],
        });

    const [itemFields, setItemFields] = useState([0]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route("admin.userneed.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset("items_id", "resident_id");
                setItemFields([0]); // Reset item fields
            },
            preserveScroll: true,
            preserveState: true,
        });
    }

    const { residents, items } = usePage<PageProps>().props;

    const handleAddItemField = () => {
        setItemFields([...itemFields, itemFields.length]);
    };

    const handleRemoveItemField = (index: number) => {
        const newFields = [...itemFields];
        newFields.splice(index, 1);
        setItemFields(newFields);
    };

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
            {itemFields.map((field, index) => (
                <div className="flex w-full items-center gap-3" key={index}>
                    <SelectOptionCustom
                        labelVariant="wajib"
                        className="w-full"
                        optionName="Pilih Item"
                        htmlFor={`items_id_${index}`}
                        labelName={`Item ${index + 1}`}
                        optionMap={items.map((group, groupIndex) => (
                            <option key={groupIndex} value={group.id}>
                                {group.name} -{" "}
                                <FormatRupiah value={group.price} />
                            </option>
                        ))}
                        errors={errors.items_id}
                        selectOptionProps={{
                            name: `items_id_${index}`,
                            value: data.items_id[index] || "",
                            onChange: (e: any) => {
                                const newItemsId: any = [...data.items_id];
                                newItemsId[index] = e.target.value;
                                setData({
                                    ...data,
                                    items_id: newItemsId,
                                });
                            },
                        }}
                    />
                    {index === itemFields.length - 1 ? (
                        <Button
                            className={`bg-green-500 text-white hover:bg-green-600 ${
                                errors.items_id ? "mt-0" : "mt-7"
                            } `}
                            type="button"
                            onClick={handleAddItemField}
                        >
                            <PlusIcon className="w-5 h-5" />
                        </Button>
                    ) : (
                        <Button
                            className={`bg-red-500 text-white hover:bg-red-600 ${
                                errors.items_id ? "mt-0" : "mt-7"
                            } `}
                            type="button"
                            onClick={() => handleRemoveItemField(index)}
                        >
                            <CircleX className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            ))}

            <div className="flex mt-5 justify-end w-full gap-3">
                <Button
                    type="reset"
                    disabled={processing}
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => {
                        reset();
                        setItemFields([0]);
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
