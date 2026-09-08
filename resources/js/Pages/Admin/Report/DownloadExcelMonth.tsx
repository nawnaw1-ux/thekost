import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import ExcelIcon from "../../../../../public/pdf.png";
import { PageProps } from "@/types";
import { Progress } from "@/Components/ui/progress";

interface result {
    pemasukkan: {
        total: number;
        details: { id: number; amount: number; date: string }[];
    };
    pengeluaran: {
        total: number;
        details: { id: number; amount: number; date: string }[];
    };
    keuntungan: number;
}

const DownloadExcelMonth = ({
    result,
    startDate: startDateFromProps,
}: {
    result: result;
    startDate: string;
}) => {
    const { active_boarding_branch } = usePage<PageProps>().props;
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = startDateFromProps || urlParams.get("start_date") || "";

    const [progress, setProgress] = useState<number>(0);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const isDatesMissing = !startDate;

    return (
        <>
            <p className="text-base font-semibold">DOWNLOAD LAPORAN BULANAN</p>
            <hr className="mt-4 border w-[90%] h-px border-foreground/5" />
            <div className="flex h-full mt-9 items-center justify-center flex-col">
                <img src={ExcelIcon} className="w-32" alt="Excel Icon" />
                <p className="text-base text-center font-medium  mt-4">
                    RoomWise ({active_boarding_branch.name}) - Laporan{" "}
                    {startDate}
                </p>
                {isDownloading && (
                    <Progress value={progress} className="w-60 mt-4" />
                )}
                <a
                    className={`py-2 text-center w-44 mt-5 text-base border border-gray-300 font-medium rounded-full ${
                        isDatesMissing
                            ? "disabled:opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    target="_blank"
                    href={
                        isDatesMissing
                            ? "#"
                            : route("admin.download.monthly", {
                                  start_date: startDate,
                              })
                    }
                    onClick={(e) => {
                        if (isDatesMissing) {
                            e.preventDefault();
                        }
                    }}
                >
                    {isDownloading ? "Downloading..." : "DOWNLOAD"}
                </a>
            </div>
        </>
    );
};

export default DownloadExcelMonth;
