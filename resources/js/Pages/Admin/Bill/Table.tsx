import { ColumnDef } from "@tanstack/react-table";
import { Bill, Item, User } from "@/types";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, CheckIcon, CircleX, ClockIcon } from "lucide-react";
import DeleteData from "@/Components/DeleteData";
import { FormatRupiah } from "@arismun/format-rupiah";
import Show from "./Show";

export const Column: ColumnDef<Bill>[] = [
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
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama penghuni
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell(props) {
            return (
                <>
                    <div className="flex items-center gap-2">
                        {props.row.original.resident.user.name}
                    </div>
                </>
            );
        },
    },
    {
        accessorKey: "invoice",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    kode tagihan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("invoice");
        },
    },
    {
        accessorKey: "subtotal",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tagihan/Bulan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <FormatRupiah value={row.getValue("subtotal")} />;
        },
    },
    {
        accessorKey: "date_invoice",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Invoice dibuat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("date_invoice");
        },
    },
    {
        accessorKey: "end_date",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tgl Jatuh tempo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("end_date");
        },
    },
    {
        accessorKey: "date_pay",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tgl Bayar
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return row.getValue("date_pay");
        },
    },

    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div
                    className={`font-semibold  px-2 py-2 rounded-lg ${
                        row.getValue("status") === "lunas"
                            ? "text-blue-600 bg-blue-100"
                            : row.getValue("status") === "denda"
                            ? "text-red-600 bg-red-100"
                            : row.getValue("status") === "belum lunas"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    <div className="flex justify-center items-center gap-1.5">
                        {row.getValue("status") === "lunas" ? (
                            <>
                                <CheckIcon className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold">
                                    {row.getValue("status")}
                                </span>
                            </>
                        ) : row.getValue("status") === "denda" ? (
                            <>
                                <CircleX className="h-4 w-4 text-red-600" />
                                <span className="font-semibold">
                                    {row.getValue("status")}
                                </span>
                            </>
                        ) : row.getValue("status") === "belum lunas" ? (
                            <div className="w-32 flex items-center gap-3">
                                <ClockIcon className="h-4 w-4 text-yellow-600" />
                                <span className="font-semibold">
                                    {row.getValue("status")}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
            );
        },
    },

    {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
            const bill = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Show bill={bill} />
                    {/* <Edit user={user} /> */}
                    <DeleteData paramId={`/admin/tagihan/${bill.id}`} />
                </div>
            );
        },
    },
];
