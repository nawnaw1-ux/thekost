import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { DataTableCustom } from "@/Components/DataTableCustom";
import { Bill, PageProps } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Column } from "./Table";

interface Props {
    month: string;
    filteredMonth: Bill[];
}

const ThisMonth = ({ month, filteredMonth }: Props) => {
    const { residentBoardingBranch } = usePage<PageProps>().props;
    console.log(residentBoardingBranch);
    const [selectedResidentId, setSelectedResidentId] = useState<string | null>(
        null
    );
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const statusParam = urlParams.get("status");
        if (statusParam) {
            setSelectedStatus(statusParam);
        }
    }, []);

    const filteredData = filteredMonth.filter((bill) => {
        const matchResident = selectedResidentId
            ? bill.resident?.id === parseInt(selectedResidentId)
            : true;
        const matchStatus = selectedStatus
            ? selectedStatus === "semuanya"
                ? true
                : selectedStatus === "denda"
                ? bill.penalty > 0
                : bill.status === selectedStatus
            : true;
        return matchResident && matchStatus;
    });

    return (
        <div className="flex flex-col mt-3">
            <div className="flex flex-col gap-3 md:flex-row  items-center justify-between text-lg font-semibold px-4 py-2 rounded-lg shadow-sm bg-white dark:bg-zinc-800 text-foreground/80">
                <p>{month}</p>
                <div className="flex items-center gap-3">
                    <Select
                        onValueChange={(value) => {
                            setSelectedResidentId(value);
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Nama Penghuni" />
                        </SelectTrigger>
                        <SelectContent>
                            {residentBoardingBranch
                                .slice()
                                .sort((a, b) =>
                                    a.user.name.localeCompare(b.user.name)
                                )
                                .map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={`${item.id}`}
                                    >
                                        {item.user.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedStatus || ""}
                        onValueChange={(value) => {
                            setSelectedStatus(value);
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semuanya">Semuanya</SelectItem>
                            <SelectItem value="lunas">Lunas</SelectItem>
                            <SelectItem value="belum lunas">
                                Belum Lunas
                            </SelectItem>
                            <SelectItem value="denda">Denda</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="">
                <DataTableCustom data={filteredData} columns={Column} />
            </div>
        </div>
    );
};

export default ThisMonth;
