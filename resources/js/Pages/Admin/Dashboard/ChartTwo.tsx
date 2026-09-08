"use client";
import { ChevronRight } from "lucide-react";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/Components/ui/chart";
import { Link } from "@inertiajs/react";

const chartData = [
    { browser: "safari", visitors: 40, fill: "hsl(var(--chart-6))" },
];

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface Props {
    unpaid: number;
    unpaidPercentage: number;
}
export function ChartTwo({ unpaid, unpaidPercentage }: Props) {
    const circle = 360;
    const unpaidDegrees = (unpaidPercentage / 100) * circle;
    return (
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 md:gap-10 w-full md:h-32">
            {/* Chart Container */}
            <div className="flex h-20 md:h-48  w-36 max-w-[250px] mx-auto">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square max-h-[200px] w-full"
                >
                    <RadialBarChart
                        className=""
                        data={chartData}
                        startAngle={0}
                        endAngle={unpaidDegrees}
                        innerRadius={58} // menggunakan persentase untuk fleksibilitas
                        outerRadius={100} // fleksibilitas
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-black last:fill-white last:dark:fill-zinc-800"
                            polarRadius={[57, 50]} // ukuran lebih kecil
                        />
                        <RadialBar
                            dataKey="visitors"
                            background
                            cornerRadius={0} // mengatur radius sudut lebih besar
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
                                                    y={(viewBox.cy || 0) + -10}
                                                    className="fill-foreground  text-xl md:text-2xl font-semibold"
                                                >
                                                    {unpaidPercentage}
                                                    <tspan>%</tspan>
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 14}
                                                    className="fill-muted-foreground  text-sm md:text-base"
                                                >
                                                    Penghuni
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </div>

            {/* Details */}

            <div className="flex flex-col w-full items-center md:items-start justify-center gap-1">
                <p className="text-lg xl:text-xl font-medium text-center md:text-left">
                    {unpaid} Penghuni{" "}
                    <span className="text-foreground/50 font-semibold">
                        Belum Lunas
                    </span>
                </p>
                <Link
                    href="/admin/penghuni?status=belum+lunas&tagihan=1"
                    className="flex items-center gap-2.5"
                >
                    <p className="text-sm xl:text-base text-blue-500">
                        Lihat detail{" "}
                    </p>
                    <ChevronRight size={16} className="mt-0.5" />
                </Link>
            </div>
        </div>
    );
}
