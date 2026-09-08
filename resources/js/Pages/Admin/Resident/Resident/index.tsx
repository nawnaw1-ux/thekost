import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import Womanicon from "../../../../../../public/assets/Logo/woman.png";
import Manicon from "../../../../../../public/assets/Logo/man.png";
import { Search, Mail, Phone, ArrowDownUp } from "lucide-react";
import {
    addMonths,
    endOfMonth,
    format,
    getDate,
    getDaysInMonth,
} from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "@inertiajs/react";
import { Resident } from "@/types";
import { Button } from "@/Components/ui/button";
import Edit from "./Edit";
import Show from "./Show";
import DeleteData from "@/Components/DeleteData";

interface Props {
    residents: Resident[];
}
const addOneMonth = (dateString: string): string => {
    const date = new Date(dateString);
    const nextMonth = addMonths(date, 0);
    const daysInNextMonth = getDaysInMonth(nextMonth);

    // Jika tanggal awal lebih besar dari jumlah hari di bulan berikutnya, gunakan tanggal terakhir bulan tersebut
    const adjustedDate =
        getDate(date) > daysInNextMonth
            ? new Date(
                  nextMonth.getFullYear(),
                  nextMonth.getMonth(),
                  daysInNextMonth
              )
            : new Date(
                  nextMonth.getFullYear(),
                  nextMonth.getMonth(),
                  getDate(date)
              );

    return format(adjustedDate, "d MMMM yyyy", { locale: id });
};
const Index = ({ residents }: Props) => {
    const [search, setSearch] = useState("");
    const [filteredResidents, setFilteredResidents] = useState(residents);
    const [addModeMobile, setAddModeMobile] = useState(false);
    const [isSortedAscending, setIsSortedAscending] = useState(true);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredResidents(
            residents.filter((resident) =>
                resident.user.name.toLowerCase().includes(value)
            )
        );
    };
    const handleSort = () => {
        const sortedResidents = [...filteredResidents].sort((a, b) => {
            if (isSortedAscending) {
                return a.user.name.localeCompare(b.user.name);
            } else {
                return b.user.name.localeCompare(a.user.name);
            }
        });
        setIsSortedAscending(!isSortedAscending);
        setFilteredResidents(sortedResidents);
    };

    return (
        <>
            <div className="flex flex-col-reverse mt-3 md:flex-row gap-3  md:gap-0 md:justify-between md:items-center bg-white dark:bg-transparent lg:dark:bg-zinc-800 p-3 rounded-lg">
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
                            placeholder="Cari Nama Penghuni..."
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

                <div className="hidden lg:flex items-center gap-2.5">
                    <Link href={route("admin.resident.create")}>
                        <Button>+ Tambah Penghuni</Button>
                    </Link>
                </div>
            </div>

            {filteredResidents.length > 0 ? (
                <div className="grid gap-2 mt-4 px-3 lg:px-0 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResidents.map((resident) => {
                        const nextBillingDate =
                            resident.bills.length > 0
                                ? addOneMonth(resident.bills[0].end_date)
                                : "-";

                        return (
                            <div key={resident.id}>
                                <div className="bg-white group w-full relative border hover:border-primary cursor-pointer hover:bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg flex justify-between items-center">
                                    <div className="w-full">
                                        {resident.room_id !== null ? (
                                            <div className="absolute top-2 right-0 font-semibold text-white bg-primary py-2 pr-4 pl-4 rounded-l-full">
                                                {resident.room.number_room}
                                            </div>
                                        ) : (
                                            <div className="absolute top-2 right-0 font-semibold text-white bg-gray-500 py-2 pr-4 pl-4 rounded-l-full">
                                                Kosong
                                            </div>
                                        )}

                                        <div className="flex justify-between w-full">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                    {resident.gender ===
                                                    "Laki-laki" ? (
                                                        <img
                                                            src={Manicon}
                                                            alt="Man"
                                                            className="size-8"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={Womanicon}
                                                            alt="Woman"
                                                            className="size-8"
                                                        />
                                                    )}
                                                    {resident.user.name}
                                                </div>
                                                <div className="flex flex-col gap-1 mt-3 text-sm text-gray-500 dark:text-zinc-300">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={16} />
                                                        <p>
                                                            {
                                                                resident.user
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center w-full justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={16} />
                                                            <p>
                                                                {
                                                                    resident.phone_number
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center w-full justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <p>
                                                                Tagihan Pertama
                                                            </p>
                                                            <p>
                                                                {nextBillingDate ||
                                                                    "-"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" hidden  group-hover:flex items-center mt-[90px] gap-2">
                                        <Show resident={resident} />
                                        <Edit resident={resident} />
                                        <DeleteData
                                            content="Data yang terkait dengan penghuni ini akan dihapus (Tagihan). Apakah anda yakin?"
                                            paramId={`/admin/penghuni/${resident.id}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    No residents found.
                </div>
            )}
        </>
    );
};

export default Index;
