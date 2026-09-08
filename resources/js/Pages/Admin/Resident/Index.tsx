import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Bill, Resident, User } from "@/types";

import Index from "./Resident";
import IndexBill from "./Bills/Index";
import { Link } from "@inertiajs/react";

interface Props {
    residents: Resident[];
    users: User[];
    message: string;
    duplicates: User[];
    total: number[];
    bills: Bill[];
    thisMonth: string;
    filteredBills3: Bill[];
    nextMonth: string;
    filteredBills: Bill[];
    filteredBills2: Bill[];
    beforeMonth: string;
}

export default function Dashboard({
    residents,
    bills,
    thisMonth,
    nextMonth,
    filteredBills3,
    filteredBills,
    filteredBills2,
    beforeMonth,
}: Props) {
    const urlParams = new URLSearchParams(window.location.search);
    const tagihan = urlParams.get("tagihan");

    const [tabsSelect, setTab] = useState(() => {
        return tagihan === "1"
            ? "bill"
            : localStorage.getItem("dashboardTab") || "resident";
    });

    useEffect(() => {
        localStorage.setItem("dashboardTab", tabsSelect);
    }, [tabsSelect]);

    return (
        <div className="lg:pl-[295px] mt-4 md:mt-0 px-4 md:px-0  h-screen  relative overflow-y-auto pb-10 md:pt-24 lg:pr-6 space-y-4">
            <Tabs defaultValue={tabsSelect} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="resident">Penghuni</TabsTrigger>
                    <TabsTrigger value="bill">Tagihan</TabsTrigger>
                </TabsList>
                <TabsContent value="resident">
                    <Index residents={residents} />
                </TabsContent>
                <TabsContent value="bill">
                    <IndexBill
                        beforeMonth={beforeMonth}
                        thisMonth={thisMonth}
                        nextMonth={nextMonth}
                        filteredBills={filteredBills}
                        filteredBills2={filteredBills2}
                        filteredBills3={filteredBills3}
                        bills={bills}
                    />
                </TabsContent>
            </Tabs>
            {tabsSelect === "resident" && (
                <Link href={route("admin.resident.create")}>
                    <Button className="flex md:hidden justify-center px-3 py-6 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-500 rounded-full shadow-sm text-primary fixed right-6 z-20 bottom-20 items-center">
                        <Plus size={24} />
                    </Button>
                </Link>
            )}
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AdminLayout head="Penghuni dan Tagihan" children={page} />
);
