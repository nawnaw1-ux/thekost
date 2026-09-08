"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

import MonthRange from "./MonthRange";

const chartConfig = {
    totalInput: {
        label: "Pemasukan",
        color: "hsl(var(--chart-1))",
    },
    totalOutput: {
        label: "Pengeluaran",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface Props {
    monthlyData: any;
    groupedRecordTransaction: {
        year: string;
    }[];
}
export function BarChartComponent({
    monthlyData,
    groupedRecordTransaction,
}: Props) {
    return (
        <div className="flex flex-col w-full  gap-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-0  items-center justify-between">
                <p className=" text-xl md:text-2xl font-medium">
                    PEMASUKAN & PENGELUARAN
                </p>
                <MonthRange
                    groupedRecordTransaction={groupedRecordTransaction}
                />
            </div>
            <ChartContainer config={chartConfig} className="  w-full mt-7 ">
                <BarChart
                    accessibilityLayer
                    data={monthlyData}
                    barCategoryGap={30}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: "14px" }}
                        tickFormatter={(value) =>
                            value >= 1000000
                                ? `${(value / 1000000).toFixed(0)} jt`
                                : value
                        }
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar
                        dataKey="totalInput"
                        fill="var(--color-totalInput)"
                        radius={4}
                    />{" "}
                    <Bar
                        dataKey="totalOutput"
                        fill="var(--color-totalOutput)"
                        radius={4}
                    />
                </BarChart>
            </ChartContainer>
            <div className="flex items-center justify-center text-sm font-medium gap-4">
                <div className="flex items-center gap-2 ">
                    <span className="w-4 h-4 rounded-full bg-primary"></span>
                    <span>Pemasukan</span>
                </div>{" "}
                <div className="flex items-center gap-2 ">
                    <span className="w-4 h-4 rounded-full bg-[#e1afd1]"></span>
                    <span>Pengeluaran</span>
                </div>
            </div>
        </div>
    );
}
