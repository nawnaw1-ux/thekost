import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

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

interface Props {
    totalBill: number;
    paidResidents: number;
    unpaidResidents: number;
}
export function RadialChartTwo({
    totalBill,
    paidResidents,
    unpaidResidents,
}: Props) {
    const chartData = [
        {
            name: "Total",
            paid: paidResidents,
            unpaid: unpaidResidents,
        },
    ];

    const chartConfig = {
        paid: {
            label: "Lunas",
            color: "hsl(var(--chart-1))",
        },
        unpaid: {
            label: "Belum Lunas",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <div className="flex flex-col w-full justify-center items-center relative gap-6">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[400px]" // Ukuran diperbesar
            >
                <RadialBarChart
                    data={chartData}
                    endAngle={180}
                    innerRadius={120} // Radius diperbesar
                    outerRadius={150} // Radius diperbesar
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
                                                y={(viewBox.cy || 0) - 10} // Posisi teks disesuaikan
                                                className="fill-foreground text-5xl font-bold" // Teks lebih besar
                                            >
                                                {totalBill}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 10} // Posisi teks disesuaikan
                                                className="fill-muted-foreground text-lg" // Ukuran teks lebih besar
                                            ></tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </PolarRadiusAxis>
                    <RadialBar
                        dataKey="paid"
                        stackId="a"
                        cornerRadius={5}
                        fill="var(--color-paid)"
                        className="stroke-transparent stroke-2"
                    />
                    <RadialBar
                        dataKey="unpaid"
                        fill="var(--color-unpaid)"
                        stackId="a"
                        cornerRadius={5}
                        className="stroke-transparent stroke-2"
                    />
                </RadialBarChart>
            </ChartContainer>
            <div className="flex absolute text-xl font-medium left-1/2 -translate-x-1/2 md:bottom-14 lg:bottom-0 xl:bottom-28 flex-col items-center justify-center">
                <p>{paidResidents} Lunas</p>
                <p>{unpaidResidents} Belum Lunas</p>
            </div>
        </div>
    );
}
