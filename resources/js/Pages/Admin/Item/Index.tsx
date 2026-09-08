import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, Plus, ArrowDownUp } from "lucide-react";

import { Input } from "@/Components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Item } from "@/types";
import { FormatRupiah } from "@arismun/format-rupiah";
import Create from "./Create";
import DeleteData from "@/Components/DeleteData";
import Edit from "./Edit";
import CreateMobile from "./CreateMobile";

interface Props {
    items: Item[];
}
export default function Dashboard({ items }: Props) {
    const [search, setSearch] = useState("");
    const [filteredItem, setfilteredItem] = useState(items);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setfilteredItem(
            items.filter((resident) =>
                resident.name.toLowerCase().includes(value)
            )
        );
    };
    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        const sorted = [...filteredItem].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return newSortOrder === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        });

        setfilteredItem(sorted);
    };
    return (
        <div className="lg:pl-[295px]  h-screen  relative overflow-y-auto pb-10 md:pt-24 lg:pr-6 space-y-4">
            <CreateMobile />
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
                            placeholder="Cari Item..."
                            className="w-full pl-12 "
                        />
                    </div>
                    <Button
                        variant={"outline"}
                        className="text-foreground/60"
                        onClick={handleSort}
                    >
                        <ArrowDownUp size={20} />
                    </Button>
                </div>

                <Create />
            </div>

            {/* Residents List */}
            <div className="grid gap-2 px-4 lg:px-0 sm:grid-cols-1">
                {filteredItem.length > 0 ? (
                    filteredItem.map((resident) => (
                        <div
                            key={resident.id}
                            className="bg-white w-full relative border hover:border-primary cursor-pointer hover:bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg  flex justify-between items-center"
                        >
                            <div className="flex w-full md:w-[90%] md:flex-row flex-col items-start justify-between">
                                <p className=" text-foreground/70">
                                    {resident.name}
                                </p>
                                <p>
                                    <FormatRupiah value={resident.price} />
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Edit item={resident} />
                                <DeleteData
                                    paramId={`/admin/item/${resident.id}`}
                                />
                            </div>
                        </div>
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
    <AdminLayout head="Item" children={page} />
);
