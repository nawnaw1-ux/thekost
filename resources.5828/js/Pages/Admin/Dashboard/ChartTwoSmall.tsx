import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/Components/ui/chart";
import { FormatRupiah } from "@arismun/format-rupiah";

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
    money: number;
}
export function ChartTwoSmall({ unpaid, unpaidPercentage, money }: Props) {
    const circle = 360;
    const paidDegrees = (unpaidPercentage / 100) * circle;
    return (
        <div className="  grid grid-cols-2 pr-2 items-center h-16 w-full ">
            <div className="flex w-14 max-w-[250px] mx-auto">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square max-h-[200px] w-14"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={paidDegrees}
                        innerRadius={25}
                        outerRadius={42}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-zinc-700 last:fill-zinc-900 last:dark:fill-zinc-800"
                            polarRadius={[22, 17]} // ukuran lebih kecil
                        />
                        <RadialBar
                            dataKey="visitors"
                            background
                            cornerRadius={0}
                        />
                        <PolarRadiusAxis
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                            className=" fill-black"
                        >
                            {" "}
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
                                                    y={viewBox.cy}
                                                    className="fill-white text-[12px] text-white font-semibold"
                                                >
                                                    {unpaidPercentage}
                                                    <tspan>%</tspan>
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
            <div className="flex flex-col text-zinc-300">
                <p className="text-[12px]">{unpaid} Penghuni</p>
                <p className="text-zinc-400 text-xs">
                    <FormatRupiah value={money} />
                </p>
            </div>
        </div>
    );
}
