import AdminLayout from "@/Layouts/AdminLayout";
import useLocalStorage from "use-local-storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { DataTableCustom } from "@/Components/DataTableCustom";
import Create from "./Create";
import { Column } from "./Table";
import { Promo } from "@/types";

interface Props {
    promos: Promo[];
}
export default function Dashboard({ promos }: Props) {
    const [tabsValue, setTabsValue] = useLocalStorage(
        "kost_table_promo",
        "kost_add_promo"
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
                    className="mt-5"
                >
                    <TabsList className="bg-brandy-rose-100">
                        {" "}
                        <TabsTrigger value="kost_table_promo">Data</TabsTrigger>
                        <TabsTrigger value="kost_add_promo">Tambah</TabsTrigger>
                    </TabsList>{" "}
                    <TabsContent value="kost_table_promo">
                        <DataTableCustom data={promos} columns={Column} />
                    </TabsContent>
                    <TabsContent value="kost_add_promo">
                        <Create />
                    </TabsContent>
                </Tabs>
            </>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AdminLayout
        tittle="Manajamen Promosi"
        description="Halaman ini berfungsi sebagai halaman utama manajemen promosi"
        head="promosi"
        children={page}
    />
);
