import { useState } from "react";
import { Trash, Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { router, useForm, usePage } from "@inertiajs/react";
import { PageProps, Room } from "@/types";
import EditData from "@/Components/EditData";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

interface RoomDetailsProps {
    room: Room;
}

export default function EditEmptyRoom({ room }: RoomDetailsProps) {
    const [showModal, setShowModal] = useState(false);
    const [showAddResident, setShowAddResident] = useState(true);
    const { resident_no_room } = usePage<PageProps>().props;

    const [selectResident1, setSelectResident1] = useState<string | null>(null);
    const [selectResident2, setSelectResident2] = useState<string | null>(null);

    // Filter residents for each select dropdown
    const filteredResidentsForSelect1 = resident_no_room.filter(
        (item) => item.id !== (selectResident2 as any)
    );
    const filteredResidentsForSelect2 = resident_no_room.filter(
        (item) => item.id !== (selectResident1 as any)
    );

    // Handle resident selection for the first select
    const handleSelectResident1 = (residentId: string) => {
        setSelectResident1(residentId);
        if (residentId === selectResident2) {
            setSelectResident2(null); // Clear the second select if the same resident is selected
        }
    };

    // Handle resident selection for the second select
    const handleSelectResident2 = (residentId: string) => {
        setSelectResident2(residentId);
        if (residentId === selectResident1) {
            setSelectResident1(null); // Clear the first select if the same resident is selected
        }
    };

    const handleAddResident = (residentId: string, roomId: string) => {
        router.post("tambah-penghuni", {
            room_id: roomId,
            resident_id: residentId,
        });
    };

    const { data, setData, post } = useForm({
        id: room.id,
        number_room: room.number_room,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("admin.room.editRoom"), {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(false);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <EditData
            className="overflow-y-auto max-w-3xl flex flex-col"
            dialogTitle="Edit Kamar"
            showModal={showModal}
            setShowModal={setShowModal}
        >
            <form onSubmit={submit} className="flex flex-col">
                <div className="flex flex-col gap-3">
                    <Label>No Kamar</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            required
                            type="number"
                            value={data.number_room}
                            onChange={(e) =>
                                setData("number_room", e.target.value)
                            }
                        />
                        <Button>Simpan</Button>
                    </div>
                </div>
            </form>

            <div>
                {room.residents.length > 0 ? (
                    room.residents.map((resident) => (
                        <div
                            key={resident.id}
                            className="flex items-start mt-4 space-x-4 p-4 rounded-lg border"
                        >
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">
                                        {resident.user.name}
                                    </h4>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                router.post("hapus-penghuni", {
                                                    id: resident.id,
                                                });
                                            }}
                                            className="flex items-center gap-1"
                                        >
                                            <Trash className="h-4 w-4" />
                                            <span>Hapus</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col gap-3">
                        {/* First Select Dropdown */}
                        <div className="flex items-start mt-4 space-x-4 p-4 rounded-lg border border-dashed">
                            <Select onValueChange={handleSelectResident1}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Penghuni 1" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredResidentsForSelect1.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >
                                            {item.user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                disabled={!selectResident1}
                                onClick={() =>
                                    handleAddResident(
                                        selectResident1!,
                                        room.id.toString()
                                    )
                                }
                            >
                                Simpan
                            </Button>
                        </div>

                        {/* Second Select Dropdown */}
                        <div className="flex items-start mt-4 space-x-4 p-4 rounded-lg border border-dashed">
                            <Select onValueChange={handleSelectResident2}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Penghuni 2" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredResidentsForSelect2.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >
                                            {item.user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                disabled={!selectResident2}
                                onClick={() =>
                                    handleAddResident(
                                        selectResident2!,
                                        room.id.toString()
                                    )
                                }
                            >
                                Simpan
                            </Button>
                        </div>
                    </div>
                )}

                {/* Show "Tambah Penghuni" card if only 1 resident exists */}
                {room.residents.length === 1 && showAddResident && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddResident(false)}
                        className="flex w-full py-6 mt-5 items-center gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Penghuni</span>
                    </Button>
                )}

                {room.residents.length === 1 && !showAddResident && (
                    <div className="flex items-start mt-4 space-x-4 p-4 rounded-lg border border-dashed">
                        <Select onValueChange={handleSelectResident1}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Penghuni" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredResidentsForSelect1.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                    >
                                        {item.user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            disabled={!selectResident1}
                            onClick={() =>
                                handleAddResident(
                                    selectResident1!,
                                    room.id.toString()
                                )
                            }
                        >
                            Simpan
                        </Button>
                    </div>
                )}
            </div>
        </EditData>
    );
}
