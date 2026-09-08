"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

interface Props {
    total_rooms: number;
    occupied_rooms: number;
    empty_rooms: number;
}

export function RadialChart({
    total_rooms,
    occupied_rooms,
    empty_rooms,
}: Props) {
    // Create chart data based on room occupancy
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
        <div className="flex flex-col w-full justify-center items-center relative gap-6">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[400px]"
            >
                <RadialBarChart
                    data={chartData}
                    endAngle={180}
                    innerRadius={120}
                    outerRadius={150}
                    barSize={15}
                    startAngle={0}
                >
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
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
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) - 20}
                                                className="fill-foreground text-5xl font-bold"
                                            >
                                                {total_rooms}
                                            </tspan>
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
            </ChartContainer>{" "}
            <div className="flex absolute text-xl font-medium left-1/2 -translate-x-1/2 md:bottom-14 lg:bottom-0 xl:bottom-28 flex-col items-center justify-center">
                <p> {occupied_rooms} Kamar Terisi</p>
                <p> {empty_rooms} Kamar Kosong</p>
            </div>
        </div>
    );
}
