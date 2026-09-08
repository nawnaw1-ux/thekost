"use client";

import { useForm } from "@inertiajs/react";
import { Input } from "../ui/input";
import { useEffect, useRef } from "react";

const MonthYear = () => {
    // Get current date
    const currentDate = new Date();

    // Format current month as YYYY-MM
    const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    // Get next month
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);

    // Track if this is the initial render
    const isInitialMount = useRef(true);

    const { post, setData, data } = useForm({
        start_date: currentMonth,
    });

    useEffect(() => {
        // Skip the effect on the initial render
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only post if both dates are set and this isn't the initial render
        if (data.start_date) {
            post(route("admin.report.index"), {
                preserveScroll: true,
                preserveState: true,
            });
        }
    }, [data.start_date]);

    return (
        <div className="flex items-center gap-4">
            <Input
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="rounded-full"
                type="month"
                name="start_date"
            />{" "}
        </div>
    );
};

export default MonthYear;
