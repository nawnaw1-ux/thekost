import { ColumnDef } from "@tanstack/react-table";
import { Resident } from "@/types";
import { Button } from "@/Components/ui/button";
import { ArrowUpDown, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import DeleteData from "@/Components/DeleteData";

import Edit from "./Resident/Edit";

export const Column: ColumnDef<Resident>[] = [
    {
        id: "No",
        header: "No",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        enableHiding: false,
        sortUndefined: false,
    },

    {
        accessorKey: "user.name",
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
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },

    {
        accessorKey: "user.email",
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
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "number_room",
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
                    No. Kamar
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "phone_number",
        header: "No Whatsapp",
        cell(props) {
            return (
                <>
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://wa.me/${props.row.original.phone_number}`}
                            className="text-blue-500 underline"
                            target={"_blank"}
                            rel={"noreferrer"}
                        >
                            {props.row.original.phone_number}
                        </a>
                    </div>
                </>
            );
        },
    },

    {
        accessorKey: "gender",
        header: ({ column }) => {
            return (
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Jenis Kelamin
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell(props) {
            return (
                <span
                    className={`font-semibold  px-2 py-1 rounded-lg ${
                        props.row.original.gender === "Laki-laki"
                            ? "text-blue-500 bg-blue-100"
                            : "text-red-500 bg-red-100"
                    }`}
                >
                    {props.row.original.gender}
                </span>
            );
        },
    },
    {
        accessorKey: "needs",
        header: "Keperluan",
        cell(props) {
            return props.row.original.needs.length + " keperluan";
        },
    },
    {
        accessorKey: "user.copy_password",
        header: "Password",
        cell(props) {
            const [copyPassword, setCopyPassword] = useState(false);
            return (
                <>
                    <div className="flex items-center gap-2">
                        <span>
                            {copyPassword
                                ? props.row.original.user.copy_password
                                : "••••••••••••"}
                        </span>
                        <button onClick={() => setCopyPassword(!copyPassword)}>
                            {copyPassword ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                    </div>
                </>
            );
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
                    <Edit resident={resident} />
                    <DeleteData paramId={`/admin/penghuni/${resident.id}`} />
                </div>
            );
        },
    },
];
