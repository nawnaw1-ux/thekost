import AdminLayout from "@/Layouts/AdminLayout";
import useLocalStorage from "use-local-storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Bill } from "@/types";
import { DataTableCustom } from "@/Components/DataTableCustom";
import { Column } from "./Table";
import Create from "./Create";

interface Props {
    bills: Bill[];
    thisMonth: string;
    nextMonth: string;
    filteredBills: Bill[];
    filteredBills2: Bill[];
}
export default function Dashboard({
    bills,
    filteredBills,
    thisMonth,
    nextMonth,
    filteredBills2,
}: Props) {
    const [tabsValue, setTabsValue] = useLocalStorage(
        "kost_table_bill",
        "kost_add_bill"
    );

    console.log(filteredBills);
    console.log(bills);
    const handleTabsChange = (value: string) => {
        setTabsValue(value);
    };
    return (
        <>
            <Tabs
                defaultValue={tabsValue}
                onValueChange={handleTabsChange}
                className="mt-5"
            >
                <TabsList className="w-full flex justify-between">
                    <div className="flex">
                        <TabsTrigger value="kost_table_active_bill">
                            {" "}
                            <p className="hidden md:block">
                                Tagihan Aktif Bulan ini
                            </p>
                            <p className="md:hidden">
                                {" "}
                                Tagihan Aktif Bulan ini
                            </p>
                        </TabsTrigger>{" "}
                        <TabsTrigger value="kost_table_active_next_month_bill">
                            {" "}
                            <p className="hidden md:block">
                                Tagihan Aktif Bulan Depan
                            </p>
                            <p className="md:hidden">
                                {" "}
                                Tagihan Aktif Bulan Depan
                            </p>
                        </TabsTrigger>{" "}
                        <TabsTrigger value="kost_table_bill">
                            {" "}
                            <p className="hidden md:block">
                                Semua Data Tagihan/History
                            </p>
                            <p className="md:hidden">Data History</p>
                        </TabsTrigger>
                    </div>

                    <TabsTrigger value="kost_add_bill">
                        + Tambah Tagihan
                    </TabsTrigger>
                </TabsList>{" "}
                <TabsContent value="kost_table_bill">
                    <DataTableCustom data={bills} columns={Column} />
                </TabsContent>
                <TabsContent value="kost_table_active_bill">
                    <div className="flex flex-col gap-2 mt-5">
                        <p className=" font-semibold text-lg lg:text-2xl">
                            {" "}
                            Bulan {thisMonth}
                        </p>
                        <DataTableCustom
                            data={filteredBills}
                            columns={Column}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="kost_table_active_next_month_bill">
                    <div className="flex flex-col gap-2 mt-5">
                        <p className=" font-semibold text-lg lg:text-2xl">
                            {" "}
                            Bulan {nextMonth}
                        </p>
                        <DataTableCustom
                            data={filteredBills2}
                            columns={Column}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="kost_add_bill">
                    <Create />
                </TabsContent>
            </Tabs>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AdminLayout
        tittle="Manajamen Tagihan"
        description="Halaman ini berfungsi sebagai halaman utama manajemen tagihan"
        head="tagihan"
        children={page}
    />
);
