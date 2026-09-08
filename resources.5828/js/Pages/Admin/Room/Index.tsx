import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Search,
    Plus,
    PenBox,
    Trash2Icon,
    ArrowDownUp,
    ArrowLeftRightIcon,
    Pen,
} from "lucide-react";

import { Input } from "@/Components/ui/input";
import Womanicon from "../../../../../public/assets/Logo/woman.png";
import Manicon from "../../../../../public/assets/Logo/man.png";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { PageProps, Room } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import DeleteData from "@/Components/DeleteData";
import { router, usePage } from "@inertiajs/react";
import Edit from "./Edit";
import EditEmptyRoom from "./EditEmptyRoom";

interface Props {
    rooms: Room[];
    totalRoomQty: number;
}
export default function Dashboard({ rooms, totalRoomQty }: Props) {
    const [search, setSearch] = useState("");
    const [filteredRoom, setFilteredRoom] = useState(rooms);

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const { room_qty } = usePage<PageProps>().props;
    const quota = room_qty.room_qty - totalRoomQty;

    // Update the filtered list when rooms data changes
    useEffect(() => {
        setFilteredRoom(rooms);
    }, [rooms]);

    // Handle the search input and update the filtered room list
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().toLowerCase(); // Hilangkan spasi & lowercase
        setSearch(value);

        if (value === "") {
            setFilteredRoom(rooms);
            return;
        }

        const filtered = rooms.filter((room) => {
            const roomNumber = room.number_room?.toString().toLowerCase();
            return roomNumber.includes(value);
        });

        setFilteredRoom(filtered);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        const sorted = [...filteredRoom].sort((a, b) => {
            const roomA = parseInt(a.number_room, 10);
            const roomB = parseInt(b.number_room, 10);

            return newSortOrder === "asc" ? roomA - roomB : roomB - roomA;
        });

        setFilteredRoom(sorted);
    };
    return (
        <div className="lg:pl-[295px]  h-screen  relative overflow-y-auto pb-10 md:pt-24 lg:pr-6 space-y-4">
            <Button
                disabled={quota <= 0}
                onClick={() => {
                    if (quota <= 0) return; // Prevent trigger
                    router.post("tambah-kamar", {
                        lastRoom:
                            filteredRoom[filteredRoom.length - 1]?.number_room,
                    });
                }}
                className="flex md:hidden justify-center  px-3 py-6 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-500 rounded-full  text-primary fixed right-6 z-20 bottom-20 items-center"
            >
                <Plus size={24} />
            </Button>

            <div className="flex flex-col-reverse md:flex-row gap-3  md:gap-0 md:justify-between md:items-center bg-white dark:bg-transparent lg:dark:bg-zinc-800 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-52">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Cari Nomor Kamar..."
                            className="w-full pl-12 "
                        />
                    </div>
                    <Button
                        variant={"outline"}
                        className="text-foreground/60"
                        onClick={handleSort} // Attach the sorting logic here
                    >
                        <ArrowDownUp size={20} />
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <p className=" font-semibold">Tersedia {quota} kamar</p>
                    <Button
                        className="hidden md:block"
                        disabled={quota <= 0}
                        onClick={() => {
                            if (quota <= 0) return; // Prevent trigger
                            router.post("tambah-kamar", {
                                lastRoom:
                                    filteredRoom[filteredRoom.length - 1]
                                        ?.number_room,
                            });
                        }}
                    >
                        + Tambah Kamar
                    </Button>
                </div>
            </div>

            {/* Residents List */}
            <div className="grid gap-2 px-4 lg:px-0 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoom.length > 0 ? (
                    filteredRoom.map((room) => (
                        <Dialog key={room.id}>
                            <DialogTrigger>
                                <div
                                    className={`
                            relative border group  hover:border-primary h-36 cursor-pointer hover:bg-gray-50 p-4 rounded-lg 
                            ${
                                room.residents.length > 0
                                    ? "bg-white  dark:bg-zinc-800"
                                    : "flex items-center justify-center bg-white dark:bg-zinc-800/60"
                            }
                        `}
                                >
                                    <div className="flex  items-center gap-3">
                                        {room.residents.length > 0 ? (
                                            room.residents.map(
                                                (resident, index) => (
                                                    <>
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-3"
                                                        >
                                                            {resident.gender ===
                                                            "Laki-laki" ? (
                                                                <img
                                                                    src={
                                                                        Manicon
                                                                    }
                                                                    alt="Man"
                                                                    className="size-6"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        Womanicon
                                                                    }
                                                                    alt="Woman"
                                                                    className="size-6"
                                                                />
                                                            )}
                                                            <p className="text-sm">
                                                                {
                                                                    resident
                                                                        .user
                                                                        .surname
                                                                }
                                                            </p>
                                                        </div>
                                                        {index === 1 ? (
                                                            ""
                                                        ) : (
                                                            <span className="w-px h-7 bg-gray-500 rounded-full"></span>
                                                        )}
                                                    </>
                                                )
                                            )
                                        ) : (
                                            <div className="flex w-full flex-col  justify-center items-center gap-3">
                                                <p className="text-foreground/50">
                                                    Kamar {room.number_room}
                                                </p>{" "}
                                                <div className="flex items-center mt-1.5 gap-3 ">
                                                    <EditEmptyRoom
                                                        room={room}
                                                    />
                                                    <div>
                                                        <DeleteData
                                                            paramId={`/admin/kamar/${room.id}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {room.residents.length > 0 && (
                                        <div className="flex mt-4">
                                            <p className="text-2xl text-foreground/80">
                                                <FormatRupiah
                                                    value={room.residents.reduce(
                                                        (total, resident) => {
                                                            return (
                                                                total +
                                                                resident.needs.reduce(
                                                                    (
                                                                        sum,
                                                                        need
                                                                    ) =>
                                                                        sum +
                                                                        need
                                                                            .item
                                                                            .price,
                                                                    0
                                                                )
                                                            );
                                                        },
                                                        0
                                                    )}
                                                />
                                            </p>
                                        </div>
                                    )}
                                    {room.residents.length > 0 && (
                                        <div className="absolute w-20 flex justify-center items-center text-white text-3xl font-bold h-full bg-primary top-0 right-0 md:right-14">
                                            {room.number_room}
                                        </div>
                                    )}
                                    {room.residents.length > 0 && (
                                        <div className="absolute w-14 md:bg-transparent gap-2 group-hover:flex hidden md:flex-col   justify-center items-center text-foreground text-3xl font-bold h-full top-12 md:top-0 left-3 md:left-auto md:right-0">
                                            <Edit room={room} />
                                            <DeleteData
                                                content="Data yang terkait dengan kamar . Apakah anda yakin?"
                                                paramId={`/admin/kamar/${room.id}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </DialogTrigger>
                        </Dialog>
                    ))
                ) : (
                    <div className="text-center text-gray-500">
                        No residents found.
                    </div>
                )}
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AdminLayout head="Kamar" children={page} />
);
