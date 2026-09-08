import { ColumnDef } from "@tanstack/react-table";
import { Item } from "@/types";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown } from "lucide-react";
import DeleteData from "@/Components/DeleteData";
import { FormatRupiah } from "@arismun/format-rupiah";
import Edit from "./Edit";

export const Column: ColumnDef<Item>[] = [
    {
        id: "No",
        header: "No",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        enableHiding: false,
        sortUndefined: false,
    },

    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Harga/Item
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell(props) {
            return <FormatRupiah value={props.row.original.price} />;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Edit item={item} />
                    <DeleteData paramId={`/admin/item/${item.id}`} />
                </div>
            );
        },
    },
];
