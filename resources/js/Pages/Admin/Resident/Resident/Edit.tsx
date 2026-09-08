import EditData from "@/Components/EditData";
import InputError from "@/Components/InputError";
import Spinner from "@/Components/Spinner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Resident } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { Key } from "lucide-react";
import { useEffect, useState, SyntheticEvent } from "react";
import ResidentForm from "./ResidentForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ResidentNeedForm from "./ResidentNeedForm";

interface EditProps {
    resident: Resident;
}

const Edit = ({ resident }: EditProps) => {
    const { data, setData, errors, processing, reset, clearErrors } = useForm({
        name: resident.user.name,
        email: resident.user.email,
        phone_number: resident.phone_number,
        gender: resident.gender,
        id: resident.id,
        password: resident.user.copy_password,
        surname: resident.user.surname,
        number_plat: resident.number_plat,
    });

    const [showModal, setShowModal] = useState(false);

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        router.post(
            route("admin.resident.updateResident"),
            {
                ...data,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                },
            }
        );
    };

    return (
        <EditData
            className=" h-[600px] overflow-y-auto max-w-3xl flex flex-col"
            dialogTitle="Edit Penghuni"
            showModal={showModal}
            setShowModal={setShowModal}
        >
            <Tabs defaultValue="resident">
                <TabsList>
                    <TabsTrigger value="resident">Penghuni</TabsTrigger>
                    <TabsTrigger value="need">Kebutuhan</TabsTrigger>
                </TabsList>
                <TabsContent value="resident">
                    <ResidentForm resident={resident} />
                </TabsContent>
                <TabsContent value="need">
                    <ResidentNeedForm resident={resident} />
                </TabsContent>
            </Tabs>
        </EditData>
    );
};

export default Edit;
