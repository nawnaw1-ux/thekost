import React, { useEffect, useState } from "react";
import ThisMonth from "./ThisMonth";
import { Bill } from "@/types";
import All from "./All";

interface Props {
    thisMonth: string;
    nextMonth: string;
    beforeMonth: string;
    filteredBills: Bill[];
    filteredBills2: Bill[];
    bills: Bill[];
    filteredBills3: Bill[];
}
const IndexBill = ({
    thisMonth,
    nextMonth,
    beforeMonth,
    filteredBills3,
    filteredBills,
    bills,
    filteredBills2,
}: Props) => {
    // Initialize tabs state from localStorage or fallback to "monthnow"
    const [tabs, setTabs] = useState(
        () => localStorage.getItem("indexBillTab") || "monthnow"
    );

    useEffect(() => {
        localStorage.setItem("indexBillTab", tabs);
    }, [tabs]);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex mt-3 items-center">
                <button
                    onClick={() => setTabs("monthnow")}
                    className={`px-7 text-sm font-semibold text-primary pb-3 border-b ${
                        tabs === "monthnow"
                            ? "border-primary"
                            : "border-zinc-300"
                    }`}
                >
                    Bulan ini
                </button>{" "}
                <button
                    onClick={() => setTabs("all")}
                    className={`px-7 text-sm font-semibold text-primary pb-3 border-b ${
                        tabs === "all" ? "border-primary" : "border-zinc-300"
                    }`}
                >
                    Semua
                </button>
            </div>
            {tabs === "monthnow" && (
                <ThisMonth month={thisMonth} filteredMonth={filteredBills} />
            )}
            {tabs === "all" && <All bills={bills} />}{" "}
            {tabs === "yearNow" && <All bills={bills} />}
        </div>
    );
};

export default IndexBill;
