import { FormatRupiah } from "@arismun/format-rupiah";
import "./ProgressCircle.css";

interface Props {
    paidPercentage: number;
    variant?: "primary" | "gray";
    money: number;
    paid: number;
}

const ProgressCircle = ({
    paidPercentage,
    variant = "primary",
    money,
    paid,
}: Props) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (paidPercentage / 100) * circumference;

    // Tentukan warna stroke berdasarkan varian
    const strokeColorClass =
        variant === "primary"
            ? "text-primary"
            : variant === "gray"
            ? "text-zinc-400"
            : "";

    return (
        <div className="  grid grid-cols-2 pr-2 items-center  h-16    w-full ">
            {/* Chart Container */}
            <div className="flex   w-14  max-w-[250px] mx-auto">
                <div className="relative size-12">
                    <div className="absolute inset-0 rounded-full bg-zinc-700"></div>
                    <div className="absolute inset-1 rounded-full bg-zinc-800"></div>
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <svg
                            className="w-full h-full -rotate-90"
                            viewBox="0 0 36 36"
                        >
                            <circle
                                className="text-transparent"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                cx="18"
                                cy="18"
                                r="16"
                            />
                            <circle
                                className={`${strokeColorClass} transition-all duration-1000`}
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                cx="18"
                                cy="18"
                                r="16.4"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                            />
                        </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                        {paidPercentage}%
                    </div>
                </div>
            </div>
            <div className="flex flex-col text-zinc-300">
                <p className="text-[12px]">{paid} Penghuni</p>
                <p className="text-zinc-400 text-xs">
                    <FormatRupiah value={money} />
                </p>
            </div>
        </div>
    );
};

export default ProgressCircle;
