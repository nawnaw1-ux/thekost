import React from "react";
import { BoardingBranch } from "@/types";
import { Home, Phone, Calendar, CheckCircle, Bed } from "lucide-react";
import Edit from "./Edit";

interface Props {
    boardingBranch: BoardingBranch;
}

const BoardingBranchComponent = (props: Props) => {
    const { boardingBranch } = props;

    return (
        <div className="p-6 bg-white dark:bg-zinc-800  mt-4 rounded-md space-y-4">
            <p className="text-lg font-semibold text-foreground/80">
                {boardingBranch.name}
            </p>
            <div className="flex items-center space-x-3">
                <Home className="text-blue-500 w-6 h-6" />
                <div>
                    <p className="text-sm  text-foreground/70">
                        {boardingBranch.address}
                    </p>
                </div>
            </div>

            {/* Contact Information */}
            <div className="flex items-center space-x-3">
                <Phone className="text-yellow-500 w-6 h-6" />
                <p className="text-sm  text-foreground/70">
                    {boardingBranch.phone_number}
                </p>
            </div>

            <div className="flex items-center justify-between">
                {" "}
                <div className="flex items-center space-x-3">
                    <Bed className=" text-purple-500 text-foreground/70 w-6 h-6" />
                    <p className="text-sm  text-foreground/70">
                        Jumlah kamar: {boardingBranch.room_qty}
                    </p>
                </div>
                <Edit boardingBranch={boardingBranch} />
            </div>
        </div>
    );
};

export default BoardingBranchComponent;
