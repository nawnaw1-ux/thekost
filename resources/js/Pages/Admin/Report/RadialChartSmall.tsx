"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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
    total_rooms: number;
    occupied_rooms: number;
    empty_rooms: number;
}
const chartData = [{ month: "january", desktop: 1260, mobile: 570 }];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function RadialChartSmall({
    total_rooms,
    occupied_rooms,
    empty_rooms,
}: Props) {
    const chartData = [
        {
            name: "Room Occupancy",
            occupied: occupied_rooms,
            empty: empty_rooms,
        },
    ];

    // Update chart config to use occupied and empty rooms
    const chartConfig = {
        occupied: {
            label: "Kamar Terisi",
            color: "hsl(var(--chart-1))",
        },
        empty: {
            label: "Kamar Kosong",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;
    return (
        <div className="flex flex-col w-full justify-center items-center relative gap-4">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[200px]" // Ukuran lebih kecil
            >
                <RadialBarChart
                    data={chartData}
                    endAngle={180}
                    innerRadius={60} // Radius lebih kecil
                    outerRadius={90} // Radius lebih kecil
                >
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) - 6} // Posisi teks disesuaikan
                                                className="fill-foreground text-2xl font-bold" // Teks lebih kecil
                                            >
                                                {total_rooms}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 6} // Posisi teks disesuaikan
                                                className="fill-muted-foreground text-sm" // Ukuran teks lebih kecil
                                            ></tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </PolarRadiusAxis>
                    <RadialBar
                        dataKey="occupied"
                        stackId="a"
                        cornerRadius={5}
                        fill="var(--color-occupied)"
                        className="stroke-transparent stroke-2"
                    />
                    <RadialBar
                        dataKey="empty"
                        fill="var(--color-empty)"
                        stackId="a"
                        cornerRadius={5}
                        className="stroke-transparent stroke-2"
                    />
                </RadialBarChart>
            </ChartContainer>
            <div className="flex absolute text-sm w-full font-medium left-1/2 -translate-x-1/2 -bottom-1 flex-col items-center justify-center">
                <p> {occupied_rooms} Kamar Terisi</p>
                <p> {empty_rooms} Kamar Kosong</p>
            </div>
        </div>
    );
}
