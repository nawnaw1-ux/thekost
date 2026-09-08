import { ColumnDef } from "@tanstack/react-table";
import { Promo } from "@/types";

import DeleteData from "@/Components/DeleteData";
import Edit from "./Edit";
export const Column: ColumnDef<Promo>[] = [
    {
        id: "No",
        header: "No",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        enableHiding: false,
        sortUndefined: false,
    },
    {
        accessorKey: "image",
        header: "Gambar",
        cell: (props) => {
            return (
                <img
                    src={`/storage/${props.row.original.image}`}
                    alt="image"
                    className="w-40 object-contain"
                />
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
            const promo = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Edit promo={promo} />
                    <DeleteData paramId={`/admin/promosi/${promo.id}`} />
                </div>
            );
        },
    },
];
