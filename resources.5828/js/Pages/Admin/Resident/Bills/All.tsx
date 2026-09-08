import { DataTableCustom } from "@/Components/DataTableCustom";
import { Bill, PageProps } from "@/types";
import React, { useState } from "react";
import { Column } from "./Table";
import { usePage } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id"; // Bahasa Indonesia
dayjs.extend(customParseFormat);
dayjs.locale("id");
interface Props {
    bills: Bill[];
}

const All = ({ bills }: Props) => {
    console.log(bills);
    const { residentBoardingBranch } = usePage<PageProps>().props;
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedResidentId, setSelectedResidentId] = useState<string | null>(
        null
    );

    const filteredData = bills.filter((bill) => {
        const endDate = dayjs(bill.end_date, "DD MMMM YYYY", "id"); // ✅ pakai format dan locale yang benar
        const monthMatch = selectedMonth
            ? endDate.format("MM") === selectedMonth
            : true;
        const yearMatch = selectedYear
            ? endDate.format("YYYY") === selectedYear
            : true;
        const residentMatch = selectedResidentId
            ? bill.resident?.id === parseInt(selectedResidentId)
            : true;
        return monthMatch && yearMatch && residentMatch;
    });
    // Extract unique months and years
    const monthOrder = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
    ];

    const months = Array.from(
        new Set(
            bills.map((bill) =>
                dayjs(bill.end_date, "DD MMMM YYYY", "id").format("MM")
            )
        )
    ).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    const years = Array.from(
        new Set(
            bills.map((bill) =>
                dayjs(bill.end_date, "DD MMMM YYYY", "id").format("YYYY")
            )
        )
    );

    return (
        <div className="flex flex-col mt-3">
            <div className="flex items-center gap-3 justify-end text-lg font-semibold px-4 py-2 rounded-lg shadow-sm bg-white dark:bg-zinc-800 text-foreground/80">
                <Select onValueChange={(value) => setSelectedMonth(value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month) => (
                            <SelectItem key={month} value={month}>
                                {dayjs(month, "MM").locale("id").format("MMMM")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={(value) => setSelectedYear(value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={(value) => setSelectedResidentId(value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Nama" />
                    </SelectTrigger>
                    <SelectContent>
                        {residentBoardingBranch
                            .slice()
                            .sort((a, b) =>
                                a.user.name.localeCompare(b.user.name)
                            )
                            .map((item) => (
                                <SelectItem key={item.id} value={`${item.id}`}>
                                    {item.user.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            <DataTableCustom data={filteredData} columns={Column} />
        </div>
    );
};

export default All;
