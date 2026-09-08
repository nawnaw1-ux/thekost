import AdminLayout from "@/Layouts/AdminLayout";
import { FormatRupiah } from "@arismun/format-rupiah";
import React, { useState } from "react";
import { RadialChart } from "./RadialChart";
import {
    ChevronRight,
    DollarSign,
    Star,
    StarIcon,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { BarChartComponent } from "./BarChart";
import { RadialChartSmall } from "./RadialChartSmall";
import { Link } from "@inertiajs/react";
import DownloadExcelYear from "./DownloadExcelYear";
import DownloadExcelMonth from "./DownloadExcelMonth";
import OkupansiResident from "./OkupansiResident";
import { RadialChartTwo } from "./RadialChartTwo";
import MonthYear from "@/Components/large-ui/MonthYear";
import { RadialChartSmallTwo } from "./RadialChartSmallTwo";

interface Props {
    totalInputAmount: number;
    totalOutputAmount: number;
    monthlyData: any;
    formatted_data: any;
    residentData: any;
    startDate: any;
    endDate: any;
    result: any;
    boardingBranch: any;
    paidResidents: number;
    unpaidResidents: number;
    totalInputPunishmentAmount: number;
    groupedResidentYear: {
        year: string;
    }[];
    groupedRecordTransaction: {
        year: string;
    }[];

    total_rooms: number;
    occupied_rooms: number;
    empty_rooms: number;
}

const Index = ({
    totalInputAmount,
    totalOutputAmount,
    monthlyData,
    residentData,
    result,
    startDate,
    boardingBranch,
    paidResidents,
    unpaidResidents,
    groupedResidentYear,
    groupedRecordTransaction,
    totalInputPunishmentAmount,
    total_rooms,
    occupied_rooms,
    empty_rooms,
}: Props) => {
    const path = window.location.pathname;
    const reportMonth = startDate || new Date().toISOString().slice(0, 7);
    function formatShortRupiah(value: number) {
        if (value >= 1_000_000_000) {
            return `${value / 1_000_000_000}M`;
        } else if (value >= 1_000_000) {
            return `${value / 1_000_000}jt`;
        } else if (value >= 1_000) {
            return `${value / 1_000}rb`;
        } else {
            return value.toString();
        }
    }
    return (
        <div className="lg:pl-[295px] md:px-4 lg:px-0 md:mb-16 lg:mb-0 md:pt-24 lg:pr-6 pb-4 space-y-4">
            <div className="grid md:grid-rows-2 xl:grid-rows-1  xl:grid-cols-7 w-full  gap-4">
                {/* Main Content */}
                <div className="col-span-5 hidden md:flex rounded-lg  shadow bg-white dark:bg-zinc-800 p-6  flex-col h-full">
                    <div className="grid grid-cols-4 gap-4 ">
                        <div className="col-span-1 flex h-[140px] flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-zinc-800 bg-white p-4 ">
                            <div className="flex items-center gap-3">
                                <p className="text-lg  font-medium text-foreground/50">
                                    Pemasukan
                                </p>{" "}
                                <TrendingUp
                                    size={20}
                                    className="text-green-500"
                                />
                            </div>
                            <p className="text-2xl font-semibold">
                                <FormatRupiah value={totalInputAmount} />
                            </p>
                            <Link
                                className=" text-sm mt-2 flex items-center gap-1 font-medium text-blue-500"
                                href={`/admin/laporan/pemasukkan?start_date=${reportMonth}`}
                            >
                                Lihat Detail <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="col-span-1 flex h-[140px] flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-zinc-800 bg-white p-4 ">
                            <div className="flex items-center gap-3">
                                <p className="text-lg  font-medium text-foreground/50">
                                    Pengeluaran
                                </p>
                                <TrendingDown
                                    size={20}
                                    className="text-red-500"
                                />
                            </div>
                            <p className="text-2xl font-semibold">
                                <FormatRupiah value={totalOutputAmount} />
                            </p>{" "}
                            <Link
                                className=" text-sm mt-2 flex items-center gap-1 font-medium text-blue-500"
                                href={`/admin/laporan/pengeluaran?start_date=${reportMonth}`}
                            >
                                Lihat Detail <ChevronRight size={16} />
                            </Link>
                        </div>{" "}
                        <div className="col-span-1 flex h-[140px] flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-zinc-800 bg-white p-4 ">
                            <div className="flex items-center gap-3">
                                <p className="text-lg  font-medium text-foreground/50">
                                    Denda
                                </p>{" "}
                                <DollarSign
                                    size={20}
                                    className="text-red-500"
                                />
                            </div>
                            <p className="text-2xl font-semibold">
                                <FormatRupiah
                                    value={totalInputPunishmentAmount}
                                />
                            </p>
                            <Link
                                className=" text-sm mt-2 flex items-center gap-1 font-medium text-blue-500"
                                href={`/admin/laporan/pemasukkan-denda?start_date=${reportMonth}`}
                            >
                                Lihat Detail <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="col-span-1 flex h-[140px] items-center flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-zinc-800 bg-white p-4 ">
                            <p className="text-lg  flex items-center gap-2 font-medium text-foreground/50">
                                Total Keuntungan{" "}
                                <Star size={20} className="text-yellow-500" />
                            </p>
                            <p className="text-2xl font-semibold">
                                <FormatRupiah
                                    value={
                                        totalInputAmount +
                                        totalInputPunishmentAmount -
                                        totalOutputAmount
                                    }
                                />
                            </p>{" "}
                        </div>
                    </div>
                    <div className="text-center  mt-14 h-full ">
                        <p className="text-2xl font-semibold">OKUPANSI</p>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <RadialChart
                                total_rooms={
                                    total_rooms == empty_rooms ? 0 : total_rooms
                                }
                                occupied_rooms={occupied_rooms}
                                empty_rooms={
                                    total_rooms == empty_rooms ? 0 : empty_rooms
                                }
                            />
                            <RadialChartTwo
                                totalBill={unpaidResidents + paidResidents}
                                paidResidents={paidResidents}
                                unpaidResidents={unpaidResidents}
                            />
                        </div>
                    </div>{" "}
                    <div className=" h-full ">
                        <BarChartComponent
                            monthlyData={monthlyData}
                            groupedRecordTransaction={groupedRecordTransaction}
                        />
                    </div>
                </div>
                {/* Sidebar Content */}
                <div className=" md:col-span-5 pb-12 xl:col-span-2 flex flex-col  md:gap-4 h-full">
                    {" "}
                    <div className="  md:hidden bg-zinc-900 p-8 flex flex-col h-full">
                        <div
                            className="flex flex-col gap-4
                         text-white pb-10 "
                        >
                            <div className="flex items-center justify-between gap-6">
                                <div className=" flex  items-center justify-center flex-col gap-1 rounded-lg  ">
                                    <div className="flex items-center justify-center">
                                        <TrendingUp
                                            size={20}
                                            className="text-green-500"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-medium text-zinc-400">
                                            Pemasukan
                                        </p>
                                    </div>
                                    <p className="text-lg text-gray-300 font-semibold">
                                        <FormatRupiah
                                            value={totalInputAmount}
                                        />
                                    </p>
                                    <Link
                                        className=" text-sm flex items-center gap-1 font-medium text-blue-500"
                                        href={`/admin/laporan/pemasukkan?start_date=${reportMonth}`}
                                    >
                                        Lihat Detail <ChevronRight size={16} />
                                    </Link>
                                </div>{" "}
                                <div className=" flex  flex-col items-center justify-center gap-1 rounded-lg   ">
                                    <div className="flex items-center justify-center">
                                        <TrendingDown
                                            size={20}
                                            className="text-red-500"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-medium text-zinc-400">
                                            Pengeluaran
                                        </p>
                                    </div>
                                    <p className="text-lg text-gray-300 font-semibold">
                                        <FormatRupiah
                                            value={totalOutputAmount}
                                        />
                                    </p>
                                    <Link
                                        className=" text-sm flex items-center gap-1 font-medium text-blue-500"
                                        href={`/admin/laporan/pengeluaran?start_date=${reportMonth}`}
                                    >
                                        Lihat Detail <ChevronRight size={16} />
                                    </Link>
                                </div>{" "}
                            </div>{" "}
                            <div className="flex items-center justify-between ">
                                <div
                                    className=" flex  mr-12
                                  flex-col gap-1 items-center justify-between rounded-lg  "
                                >
                                    <div className="flex items-center justify-center">
                                        <DollarSign
                                            size={20}
                                            className="text-red-500"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-medium text-zinc-400">
                                            Denda
                                        </p>
                                    </div>
                                    <p className="text-lg text-gray-300 font-semibold">
                                        <FormatRupiah
                                            value={totalInputPunishmentAmount}
                                        />
                                    </p>
                                    <Link
                                        className=" text-sm flex items-center gap-1 font-medium text-blue-500"
                                        href={`/admin/laporan/pemasukkan-denda?start_date=${reportMonth}`}
                                    >
                                        Lihat Detail <ChevronRight size={16} />
                                    </Link>
                                </div>{" "}
                                <div className=" flex mb-6  items-center justify-center  flex-col gap-1 rounded-lg  ">
                                    <div className="flex  items-center justify-center">
                                        <StarIcon
                                            size={20}
                                            className="text-yellow-500 mr-1"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-medium text-zinc-400">
                                            Keuntungan
                                        </p>
                                    </div>
                                    <p className="text-lg text-gray-300 font-semibold">
                                        <FormatRupiah
                                            value={
                                                totalInputAmount +
                                                totalInputPunishmentAmount -
                                                totalOutputAmount
                                            }
                                        />
                                    </p>
                                </div>{" "}
                            </div>{" "}
                        </div>
                    </div>
                    <div className="bg-white -mt-10 md:hidden dark:bg-zinc-800 p-8 rounded-t-3xl md:rounded-lg flex flex-col h-full">
                        <div className="text-center  h-full">
                            <p className="text-xl font-semibold">OKUPANSI</p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <RadialChartSmall
                                    total_rooms={
                                        total_rooms == empty_rooms
                                            ? 0
                                            : total_rooms
                                    }
                                    occupied_rooms={occupied_rooms}
                                    empty_rooms={
                                        total_rooms == empty_rooms
                                            ? 0
                                            : empty_rooms
                                    }
                                />
                                <RadialChartSmallTwo
                                    totalBill={unpaidResidents + paidResidents}
                                    paidResidents={paidResidents}
                                    unpaidResidents={unpaidResidents}
                                />
                            </div>
                        </div>{" "}
                    </div>{" "}
                    <div className="bg-white  md:hidden dark:bg-zinc-800 p-8 md:rounded-lg flex flex-col items-center h-full">
                        <BarChartComponent
                            monthlyData={monthlyData}
                            groupedRecordTransaction={groupedRecordTransaction}
                        />
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-8 md:rounded-lg flex flex-col items-center h-full">
                        <DownloadExcelMonth
                            result={result}
                            startDate={reportMonth}
                        />
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-8 md:rounded-lg flex flex-col items-center h-full">
                        <OkupansiResident
                            residentData={residentData}
                            groupedResidentYear={groupedResidentYear}
                        />
                    </div>
                    <DownloadExcelYear
                        coming_soon={true}
                        groupedRecordTransaction={groupedRecordTransaction}
                    />
                </div>
            </div>{" "}
            <div className="flex md:hidden justify-center py-2  fixed  z-[9999] w-full  bottom-16 bg-white dark:bg-zinc-800  md:rounded-lg">
                {path === "/admin/laporan/pemasukkan" ||
                path === "/admin/laporan/pengeluaran" ? null : (
                    <div className="">
                        <MonthYear />
                    </div>
                )}
            </div>
        </div>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AdminLayout head="Laporan" children={page} />
);

export default Index;
