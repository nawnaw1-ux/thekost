import { ColumnDef } from "@tanstack/react-table";
import { UserNeed } from "@/types";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown } from "lucide-react";
import DeleteData from "@/Components/DeleteData";
import { FormatRupiah } from "@arismun/format-rupiah";

export const Column: ColumnDef<UserNeed>[] = [
    {
        id: "No",
        header: "No",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        enableHiding: false,
        sortUndefined: false,
    },
    {
        accessorKey: "resident.user.name",
        header(props) {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        props.column.toggleSorting(
                            props.column.getIsSorted() === "asc"
                        )
                    }
                >
                    Nama Penghuni
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "item.name",
        header(props) {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        props.column.toggleSorting(
                            props.column.getIsSorted() === "asc"
                        )
                    }
                >
                    Nama Item
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "item.price",
        header(props) {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        props.column.toggleSorting(
                            props.column.getIsSorted() === "asc"
                        )
                    }
                >
                    Harga
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell(props) {
            return <FormatRupiah value={props.row.original.item.price} />;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
            const resident = row.original;

            return (
                <div className="flex items-center gap-2">
                    {/* <Edit resident={resident} /> */}
                    <DeleteData
                        paramId={`/admin/keperluan-penghuni/${resident.id}`}
                    />
                </div>
            );
        },
    },
];
