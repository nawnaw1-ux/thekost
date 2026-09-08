import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { CardContent } from "@/Components/ui/card";
import {
    ChartContainer,
    ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import Logo1 from "../../../../../public/assets/Logo/logo1.png";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
export interface Month {
    month: string;
    input: number;
    output: number;
}

const chartConfig = {
    input: {
        label: "Pemasukkan",
        color: "hsl(var(--chart-1))",
    },
    output: {
        label: "Pengeluaran",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function ChartDownloadPDF({
    months,
    selectedYear,
}: {
    months: Month[];
    selectedYear: string;
}) {
    const { active_boarding_branch } = usePage<PageProps>().props;
    return (
        <CardContent className="w-[1000px] bg-white p-6 rounded-lg">
            <div className="flex flex-col gap-4">
                <div className="flex mb-10 items-center justify-between">
                    <img
                        src="/assets/Logo/logo1.png"
                        alt="Logo1"
                        className="w-[120px]"
                    />
                    <p className="font-semibold text-black text-xl uppercase">
                        LAPORAN TAHUNAN {active_boarding_branch.name} -{" "}
                        {selectedYear}
                    </p>
                    <p className="bg-white text-white">LAPORAN</p>
                </div>
                <ChartContainer config={chartConfig}>
                    <BarChart data={months}>
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
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="input"
                            fill="var(--color-input)"
                            radius={4}
                        />
                        <Bar
                            dataKey="output"
                            fill="var(--color-output)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
        </CardContent>
    );
}
