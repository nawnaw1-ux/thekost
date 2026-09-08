import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { RecordTransaction } from "@/types";
import { DataTableCustom } from "@/Components/DataTableCustom";
import { Column } from "./Table";
import { Input } from "@/Components/ui/input";
import Create from "./Create";

interface Props {
    allTransactions: RecordTransaction[];
    startDate: string;
}
// admin.inputreport-update.update
const Index = ({ allTransactions, startDate }: Props) => {
    const [selectedMonth, setSelectedMonth] = useState<string>(startDate || "");
    const [tabsRecord, setTabsRecord] = useState<string>("all");

    const filterByMonth = (data: RecordTransaction[]) => {
        if (!selectedMonth) return data;
        const [year, month] = selectedMonth.split("-");
        return data.filter((item) => {
            const itemDate = new Date(item.date);
            return (
                itemDate.getFullYear() === parseInt(year) &&
                itemDate.getMonth() + 1 === parseInt(month)
            );
        });
    };

    const filtered = filterByMonth(allTransactions);

    return (
        <div className="lg:pl-[295px] mt-4 md:mt-0 px-4 md:px-0 lg:h-screen  lg:px-0 md:mb-16 lg:mb-0 md:pt-24 lg:pr-6 pb-4 space-y-4">
            <div className="flex justify-end items-center gap-2.5">
                {tabsRecord === "all" && <Create />}
                <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="input input-sm w-40 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-500"
                    placeholder="Pilih bulan dan tahun"
                />
            </div>

            <DataTableCustom data={filtered} columns={Column} />
        </div>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AdminLayout head="Laporan Pemasukkan" children={page} />
);

export default Index;
