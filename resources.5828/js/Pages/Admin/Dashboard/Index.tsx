import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ChevronRight } from "lucide-react";
import { FormatRupiah } from "@arismun/format-rupiah";
import "./ProgressCircle.css"; // buat file CSS ini untuk animasi

import { Chart } from "./Chart";
import { ChartTwo } from "./ChartTwo";
import { BarChartCard } from "./BarChartCard";
import ProgressCircle from "./ProgressCircle";

interface Month {
    month: string;
    input: number;
    output: number;
}

interface Props {
    emptyRooms: number;
    occupiedRooms: number;
    emptyPercentage: number;
    occupiedPercentage: number;
    months: Month[];
    paid_residents: number;
    unpaid_residents: number;
    percentagePaid: number;
    percentageUnpaid: number;
    totalPaid: number;
    totalUnpaid: number;
}

export default function Dashboard({
    emptyRooms,
    occupiedRooms,
    emptyPercentage,
    occupiedPercentage,
    months,
    paid_residents,
    unpaid_residents,
    percentagePaid,
    percentageUnpaid,
    totalPaid,
    totalUnpaid,
}: Props) {
    return (
        <div className=" lg:pl-[295px] md:px-4  overflow-y-hidden hover:overflow-y-auto md:h-screen -mt-3 md:mt-0  container-scroll   md:pt-24  lg:pr-6 md:space-y-4">
            <div className="grid grid-cols-1   md:grid-cols-2 md:gap-4">
                <div className="  h-96 md:h-auto  bg-zinc-900 md:bg-white md:dark:bg-zinc-800  md:rounded-lg  flex flex-col md:gap-2">
                    <div className="flex md:p-4 flex-col items-center mt-3 md:mt-0 justify-center md:items-start md:justify-start ">
                        <p className=" font-semibold hidden md:block lg:text-base xl:text-lg tracking-normal">
                            Total Pemasukan Diterima
                        </p>
                        <p className="  hidden md:block text-foreground/70 text-sm">
                            Diterima dalam bulan ini
                        </p>
                    </div>
                    <div className=" w-full mt-5 md:mt-0 flex flex-col items-center justify-center">
                        <p className=" text-center text-primary text-3xl md:text-4xl xl:text-5xl font-bold">
                            <FormatRupiah value={totalPaid} />
                        </p>{" "}
                        <p className=" md:hidden mt-1  md:text-base xl:text-2xl text-zinc-400 text-right font-semibold">
                            {" "}
                            Total Pemasukan Diterima
                        </p>
                        <p className=" hidden md:block text-lg  md:text-xl lg:text-2xl text-foreground/60 text-right font-semibold">
                            <FormatRupiah value={totalUnpaid} />
                        </p>
                    </div>

                    <div className=" mx-5 mt-2 md:hidden  ">
                        {" "}
                        <div className="flex  justify-around  w-full mt-5 font-semibold text-zinc-400 text-xs">
                            <p className=" text-center  text-green-400    px-2 py-1 rounded-full ">
                                SUDAH BAYAR
                            </p>
                            <p className=" text-center text-red-400  px-2 py-1 rounded-full ">
                                BELUM BAYAR
                            </p>
                        </div>{" "}
                        <div className="flex mt-3 rounded-xl items-center  border border-zinc-700  justify-around  w-full  font-semibold text-zinc-500 text-xs">
                            <ProgressCircle
                                money={totalPaid}
                                paid={paid_residents}
                                variant="primary"
                                paidPercentage={percentagePaid}
                            />{" "}
                            <span className=" w-px h-20 bg-zinc-700"></span>
                            <ProgressCircle
                                money={totalUnpaid}
                                paid={unpaid_residents}
                                variant="gray"
                                paidPercentage={percentageUnpaid}
                            />
                        </div>
                    </div>
                    <div className="md:flex hidden items-center gap-4 justify-center mt-2 md:mt-3">
                        <div className="flex items-center gap-2">
                            <span className=" w-6 h-3 bg-primary"></span>
                            <p>Lunas</p>
                        </div>{" "}
                        <div className="flex items-center gap-2">
                            <span className=" w-6 h-3 bg-foreground/60"></span>
                            <p>Belum Lunas</p>
                        </div>
                    </div>
                </div>{" "}
                <div className="bg-white -mt-24 md:mt-0 rounded-t-3xl  dark:bg-zinc-800 p-6 md:p-4 md:rounded-lg md:shadow flex flex-col gap-2">
                    <div className="flex flex-col">
                        <p className=" font-semibold lg:text-base xl:text-lg">
                            Jumlah Kamar
                        </p>
                        <p className="  text-foreground/70 text-sm">
                            Memiliki {emptyRooms + occupiedRooms} Kamar Kost
                        </p>
                    </div>
                    <div className=" flex flex-col gap-3 w-full mt-3">
                        <div className=" w-full rounded-full overflow-hidden h-8 border border-gray-400 dark:bg-zinc-200 relative ">
                            <div
                                className={` h-full bg-primary `}
                                style={{ width: `${occupiedPercentage}%` }}
                            ></div>
                            <p className=" absolute text-black font-semibold -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                {occupiedRooms} Kamar Terisi
                            </p>
                        </div>{" "}
                        <div className=" w-full h-8 rounded-full overflow-hidden  border border-gray-400 dark:bg-zinc-200 relative ">
                            <div
                                style={{ width: `${emptyPercentage}%` }}
                                className={` h-full bg-zinc-400 dark:bg-zinc-600`}
                            ></div>
                            <p className=" absolute font-semibold text-black -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                {emptyRooms} Kamar Kosong
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center mt-7">
                        <Link
                            href="/admin/kamar"
                            className=" flex text-blue-500 items-center gap-2"
                        >
                            <p>Lihat Detail</p>
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>{" "}
            </div>{" "}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-2 md:gap-4">
                <div className="bg-white py-4  flex dark:bg-zinc-800 p-3 md:rounded-lg md:shadow">
                    <ChartTwo
                        unpaid={unpaid_residents}
                        unpaidPercentage={percentageUnpaid}
                    />
                </div>{" "}
                <div className="bg-white py-4 dark:bg-zinc-800 p-3 rounded-lg md:shadow">
                    <Chart
                        paid={paid_residents}
                        paidPercentage={percentagePaid}
                    />
                </div>
            </div>{" "}
            <div className=" w-full ">
                <div className="bg-white  dark:bg-zinc-800 p-3 md:rounded-lg  md:shadow">
                    <BarChartCard months={months} />{" "}
                    <div className=" flex w-full text-sm md:hidden py-4  font-semibold  justify-center">
                        © 2025 - Room Wise All rights reserved
                    </div>
                </div>{" "}
            </div>{" "}
            <div className=" hidden md:flex w-full pb-4  font-semibold  justify-center">
                © 2025 - Room Wise All rights reserved
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AdminLayout head="Dashboard" children={page} />
);
