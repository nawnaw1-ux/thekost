import AdminLayout from "@/Layouts/AdminLayout";
import useLocalStorage from "use-local-storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { DataTableCustom } from "@/Components/DataTableCustom";
import Create from "./Create";
import { Column } from "./Table";
import { Resident } from "@/types";

interface Props {
    userNeeds: Resident[];
}
export default function Dashboard({ userNeeds }: Props) {
    const [tabsValue, setTabsValue] = useLocalStorage(
        "kost_table_residentNeed",
        "kost_add_residentNeed"
    );

    const handleTabsChange = (value: string) => {
        setTabsValue(value);
    };

    return (
        <>
            <>
                <Tabs
                    defaultValue={tabsValue}
                    onValueChange={handleTabsChange}
                    className="mt-5 w-full"
                >
                    <TabsList className="w-full flex justify-between">
                        {" "}
                        <TabsTrigger value="kost_table_residentNeed">
                            <p className="hidden md:block"> Data Keperluan</p>
                            <p className="md:hidden">Data</p>
                        </TabsTrigger>
                        <TabsTrigger value="kost_add_residentNeed">
                            + Tambah Keperluan
                        </TabsTrigger>
                    </TabsList>{" "}
                    <TabsContent value="kost_table_residentNeed">
                        <DataTableCustom data={userNeeds} columns={Column} />
                    </TabsContent>
                    <TabsContent value="kost_add_residentNeed">
                        <Create />
                    </TabsContent>
                </Tabs>
            </>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AdminLayout
        tittle="Manajamen Keperluan Penghuni"
        description="Halaman ini berfungsi sebagai halaman utama manajemen keperluan penghuni"
        head="Keperluan penghuni"
        children={page}
    />
);
