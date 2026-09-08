import { ColumnDef } from "@tanstack/react-table";
import { RecordTransaction } from "@/types";
import DeleteData from "@/Components/DeleteData";
import { FormatRupiah } from "@arismun/format-rupiah";
import Edit from "./Edit";

export const Column: ColumnDef<RecordTransaction>[] = [
    {
        id: "No",
        header: "No",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        enableHiding: false,
        sortUndefined: false,
    },
    {
        id: "Nominal",
        accessorKey: "amount",
        header: "Nominal",
        cell(props) {
            return (
                <p>
                    <FormatRupiah value={props.row.original.amount} />
                </p>
            );
        },
    },
    {
        id: "deskripsi",
        accessorKey: "description",
        header: "Deskripsi",
        cell(props) {
            return <p>{props.row.original.description}</p>;
        },
    },
    {
        id: "keterangan",
        accessorKey: "note",
        header: "Keterangan",
        cell(props) {
            return <p>{props.row.original.note || "-"}</p>;
        },
    },
    {
        id: "tanggal",
        accessorKey: "date",
        header: "Tanggal",
        cell(props) {
            return <p>{props.row.original.date}</p>;
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
                    <Edit record={resident} />
                    <DeleteData
                        paramId={`/admin/laporan/pengeluaran/${resident.id}`}
                    />
                </div>
            );
        },
    },
];
