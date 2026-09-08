import { ColumnDef } from "@tanstack/react-table";
import { Bill, Item, User } from "@/types";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, CheckIcon, CircleX, ClockIcon } from "lucide-react";
import DeleteData from "@/Components/DeleteData";
import { FormatRupiah } from "@arismun/format-rupiah";
import Show from "./Show";
import DeleteDataTwo from "@/Components/DeleteDataTwo";

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
        id: "Nama Penghuni",
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
                    No. Invoice
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
        id: "Tanggal Jatuh tempo",
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
            return row.original.end_date;
        },
    },
    {
        id: "Tanggal Bayar",
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
            return row.original.date_pay;
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
                            ? "text-blue-500 "
                            : row.getValue("status") === "denda"
                            ? "text-red-500"
                            : row.getValue("status") === "belum lunas"
                            ? " text-yellow-500"
                            : " text-gray-500"
                    }`}
                >
                    <div className="flex justify-center items-center gap-2 ">
                        {row.getValue("status") === "lunas" ? (
                            <>
                                <CheckIcon className="h-4 w-4 text-blue-500" />
                                <span className="font-semibold">
                                    {row.getValue("status")}
                                </span>
                            </>
                        ) : row.getValue("status") === "denda" ? (
                            <>
                                <CircleX className="h-4 w-4 text-red-500" />
                                <span className="font-semibold">
                                    {row.getValue("status")}
                                </span>
                            </>
                        ) : row.getValue("status") === "belum lunas" ? (
                            <div className="w-28 flex items-center gap-3">
                                <ClockIcon className="h-4 w-4 text-yellow-500" />
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
                    <Show bill={bill} />{" "}
                    <div>
                        <DeleteDataTwo
                            content="Data tagihan ini akan dihapus, Apakah anda yakin?"
                            paramId={`/admin/tagihan/${bill.id}`}
                        />
                    </div>
                </div>
            );
        },
    },
];
