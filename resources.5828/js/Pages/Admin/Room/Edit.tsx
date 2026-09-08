import { useState } from "react";
import { User, Phone, Package, Trash, Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import EditData from "@/Components/EditData";
import { PageProps, type Room } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

interface RoomDetailsProps {
    room: Room;
}

export default function RoomDetails({ room }: RoomDetailsProps) {
    const [showModal, setShowModal] = useState(false);
    const [showAddResident, setShowAddResident] = useState(true);
    const { resident_no_room } = usePage<PageProps>().props;
    const [selectResident, setSelectResident] = useState<string>();

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
                {room.residents.map((resident) => (
                    <div
                        key={resident.id}
                        className="flex items-start mt-4 space-x-4 p-4 rounded-lg border"
                    >
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                {" "}
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">
                                        {resident.user.name}
                                    </h4>
                                </div>
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
                ))}
                {/* Show "Tambah Penghuni" card if only 1 resident exists */}
                {room.residents.length === 1 && showAddResident && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddResident(false)}
                        className="flex w-full py-6 mt-5  items-center gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Penghuni</span>
                    </Button>
                )}{" "}
                {room.residents.length === 1 && showAddResident === false && (
                    <div className="flex items-start mt-4 space-x-4 p-4 rounded-lg border border-dashed">
                        <Select onValueChange={setSelectResident}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Penghuni" />
                            </SelectTrigger>
                            <SelectContent>
                                {resident_no_room.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={`${item.id}`}
                                    >
                                        {item.user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            disabled={!selectResident}
                            onClick={() => {
                                router.post("tambah-penghuni", {
                                    room_id: room.id,
                                    resident_id: selectResident,
                                });
                            }}
                        >
                            Simpan
                        </Button>
                    </div>
                )}
            </div>
        </EditData>
    );
}
