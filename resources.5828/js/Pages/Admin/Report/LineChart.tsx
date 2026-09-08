"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

interface Props {
    residentData: any;
}

const chartConfig = {
    residentCount: {
        label: "Total Penghuni",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function LineChartComponent({ residentData }: Props) {
    return (
        <Card className=" border-none p-0 m-0 shadow-none w-full bg-transparent">
            <CardContent className=" border-none p-0 m-0 shadow-none w-full bg-transparent">
                <ChartContainer
                    config={chartConfig}
                    className="w-full bg-transparent"
                >
                    <LineChart
                        accessibilityLayer
                        data={residentData}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                            dataKey="residentCount"
                            type="bump" // Changed from "natural" to "linear"
                            stroke="var(--color-residentCount)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-residentCount)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
