import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { router, useForm } from "@inertiajs/react";
import React, { useState } from "react";

interface Props {
    groupedRecordTransaction: {
        year: string;
    }[];
}
const MonthRange = ({ groupedRecordTransaction }: Props) => {
    const initialYear =
        groupedRecordTransaction.length > 0
            ? groupedRecordTransaction[0].year
            : "";

    const { data, setData } = useForm({
        monthRange: "januari-juni",
        year: initialYear,
    });

    const [position, setPosition] = useState("januari-juni");
    const [selectedYear, setSelectedYear] = useState<string>(initialYear);

    // Function untuk update query tanpa reload halaman
    const updateQueryParams = (key: string, value: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.replaceState({}, "", url.toString());
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value;
        setSelectedYear(year);
        setData("year", year);

        updateQueryParams("year", year);
        router.post(
            route("admin.report.monthlyReport"),
            {
                monthRange: data.monthRange,
                year: year,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleMonthRangeChange = (value: string) => {
        setPosition(value);
        setData("monthRange", value);

        updateQueryParams("monthRange", value);
        router.post(
            route("admin.report.monthlyReport"),
            {
                monthRange: value,
                year: data.year,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };
    return (
        <div className="flex items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{position}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Pilih bulan</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={position}
                        onValueChange={handleMonthRangeChange}
                    >
                        <DropdownMenuRadioItem value="Januari - Juni">
                            Januari - Juni
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Juli - Desember">
                            Juli - Desember
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>{" "}
            <div className="flex flex-col items-start">
                <select
                    id="year-dropdown"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="dark:bg-zinc-800 font-semibold py-[9px] text-sm bg-white rounded-md border border-zinc-400/60 w-[90px] px-4"
                >
                    {groupedRecordTransaction.map((year, index) => (
                        <option key={index} value={year.year}>
                            {year.year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MonthRange;
