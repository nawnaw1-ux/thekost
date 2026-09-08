import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { Label } from "@/Components/ui/label"; // Adjust the import path as necessary
import InputError from "./InputError";

interface Props {
    labelName?: string;
    optionMap: any[];
    errors?: any;
    selectOptionProps: any;
    htmlFor?: string;
    optionName?: string;
    className?: string;
    labelVariant?: "wajib" | "optional" | "none"; // Add this prop for label variants
}

const SelectOptionCustom: React.FC<Props> = ({
    labelName,
    optionMap,
    errors,
    selectOptionProps,
    htmlFor,
    optionName,
    className,
    labelVariant = "none", // Default to "none" variant
}: Props) => {
    return (
        <div className={cn("flex flex-col gap-2.5", className)}>
            {labelName && (
                <Label
                    htmlFor={htmlFor}
                    variant={labelVariant}
                    className="font-medium text-sm"
                >
                    {labelName}
                </Label>
            )}

            <div className="flex items-center gap-4">
                <select
                    className="w-full bg-secondary text-sm border-zinc-400 rounded-md"
                    id={htmlFor}
                    {...selectOptionProps}
                >
                    {optionName && <option value="">- {optionName} -</option>}
                    {optionMap}
                </select>
            </div>
            {errors && <InputError message={errors} />}
        </div>
    );
};

export default SelectOptionCustom;
