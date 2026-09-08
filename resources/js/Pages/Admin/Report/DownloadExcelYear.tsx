import React, { useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { ChartDownloadPDF, Month } from "./ChartDownloadPDF";
import ExcelIcon from "../../../../../public/pdf.png";
import { DownloadIcon, Timer } from "lucide-react";

interface Props {
    groupedRecordTransaction: { year: string }[];
    coming_soon: boolean;
}

const FetchExcelData = ({
    groupedRecordTransaction,
    coming_soon = false,
}: Props) => {
    const { active_boarding_branch } = usePage<PageProps>().props;
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [chartData, setChartData] = useState<Month[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const chartRef = useRef<HTMLDivElement>(null);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    const handleDownload = async () => {
        if (!selectedYear) return;

        setIsProcessing(true);

        try {
            const response = await axios.get<Month[]>(
                `${window.location.origin}/api/laporan/download-excel-tahunan`,
                { params: { year: selectedYear } }
            );

            setChartData(response.data);
            setShowModal(true); // Show chart modal to render it visibly

            setTimeout(async () => {
                if (!chartRef.current) return;

                const canvas = await html2canvas(chartRef.current, {
                    backgroundColor: "#ffffff",
                    useCORS: true,
                    scale: 2,
                });

                const link = document.createElement("a");
                link.download = `laporan-tahunan-${selectedYear}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();

                setShowModal(false);
                setIsProcessing(false);
            }, 3000); // Give chart time to render
        } catch (error) {
            console.error("Download gagal:", error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-800 p-8 md:rounded-lg flex flex-col items-center h-full">
            <p className="text-base font-semibold">DOWNLOAD REKAP TAHUNAN</p>
            <hr className="mt-4 border w-[90%] h-px border-foreground/5" />
            {coming_soon ? (
                <div className="flex mt-2 h-full items-center justify-center flex-col">
                    <Timer className="size-32 text-primary" />
                    <p className="text-base text-center font-semibold bg-primary/10 py-2 px-4 rounded-full mt-2">
                        Coming Soon
                    </p>
                    <p
                        className="text-sm text-center  mt-3 text-foreground/70
                    "
                    >
                        Fitur ini masih dalam proses pengembangan.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex mt-9 h-full items-center justify-center flex-col">
                        <DownloadIcon className="size-32 text-primary" />
                        <div className="flex flex-col items-start mt-5">
                            <select
                                id="year-dropdown"
                                value={selectedYear}
                                name="year"
                                onChange={handleYearChange}
                                className="dark:bg-zinc-800 border border-zinc-400/60 bg-white rounded-md w-60 px-4 py-2"
                            >
                                <option value="" disabled>
                                    Pilih Tahun
                                </option>
                                {groupedRecordTransaction.map((year, index) => (
                                    <option key={index} value={year.year}>
                                        Tahun {year.year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="text-base text-center font-medium  mt-4">
                            RoomWise ({active_boarding_branch.name}) - Rekap
                            Tahun {selectedYear}
                        </p>

                        <button
                            onClick={handleDownload}
                            className="py-2 w-44 mt-5 text-base border border-gray-300 font-medium rounded-full"
                            disabled={!selectedYear || isProcessing}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <span>MEMPROSES...</span>
                                </div>
                            ) : (
                                "DOWNLOAD"
                            )}
                        </button>
                    </div>

                    {/* Modal dengan Animasi Halus */}
                    {showModal && (
                        <div
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300 opacity-100"
                            style={{ opacity: showModal ? 1 : 0 }}
                        >
                            <div
                                ref={chartRef}
                                className="bg-white p-4 rounded-md shadow-xl animate-fadeIn"
                                style={{ animationDuration: "0.5s" }}
                            >
                                <ChartDownloadPDF
                                    months={chartData}
                                    selectedYear={selectedYear}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FetchExcelData;
