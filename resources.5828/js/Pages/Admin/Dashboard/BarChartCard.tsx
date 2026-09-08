import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { CardContent } from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
interface Month {
    month: string;
    input: number;
    output: number;
}

const chartConfig = {
    input: {
        label: "Pemasukan",
        color: "hsl(var(--chart-1))",
    },
    output: {
        label: "Pengeluaran",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function BarChartCard({ months }: { months: Month[] }) {

    return (
        <div>
            <CardContent className="p-0 md:p-6">
                <ChartContainer
                    className="h-[300px] w-full"
                    config={chartConfig}
                >
                    <BarChart accessibilityLayer data={months}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />{" "}
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: "14px" }}
                            tickFormatter={(value) => {
                                if (value >= 1_000_000) {
                                    return `${(value / 1_000_000).toFixed(
                                        0
                                    )} jt`;
                                } else if (value >= 1_000) {
                                    return `${(value / 1_000).toFixed(0)}k`;
                                }
                                return value;
                            }}
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
            </CardContent>
        </div>
    );
}
