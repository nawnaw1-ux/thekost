import React from "react";
import { Punishment } from "@/types";
import { Home, Phone, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { FormatRupiah } from "@arismun/format-rupiah";
import Edit from "../Punishment/Edit";

interface Props {
    punishment: Punishment;
}

const PunishmentComponent = (props: Props) => {
    const { punishment } = props;
    return (
        <div className="p-6 bg-white dark:bg-zinc-800 mt-4 rounded-md space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <DollarSign className="text-green-500 w-6 h-6" />
                    <div>
                        <p className="text-lg font-semibold text-foreground/80">
                            Denda: <FormatRupiah value={punishment.price} />
                        </p>
                        <p className="text-sm text-gray-500">
                            Maksimal DENDA : {punishment.max_day} hari
                        </p>
                    </div>
                </div>
                <Edit punishment={punishment} />
            </div>
        </div>
    );
};

export default PunishmentComponent;
