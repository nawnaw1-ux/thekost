import type React from "react";
import { Badge } from "@/Components/ui/badge";
import { MapPin, Phone, Home, AlertCircle } from "lucide-react";
import ResidentLayout from "@/Layouts/ResidentLayout";

interface Punishment {
    id: number;
    price: number;
    boarding_branch_id: number;
    max_day: number;
    created_at: string;
    updated_at: string;
}

interface BoardingBranch {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    room_qty: number;
    is_activated: number;
    created_at: string;
    updated_at: string;
    punishments: Punishment[];
}

interface Props {
    boardingBranch: BoardingBranch;
}

const Index = ({ boardingBranch }: Props) => {
    // Format currency to Indonesian Rupiah
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="flex  lg:px-56  mt-2 flex-col w-full">
            {/* Header Section */}
            <div className="w-full p-0 m-0 overflow-hidden">
                <div className="pb-2  pt-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {boardingBranch.name}
                            </h2>
                            <div className="flex items-center mt-3">
                                <MapPin className="h-4 w-4 mr-1 text-primary" />
                                {boardingBranch.address}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                        <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-primary" />
                            <span>{boardingBranch.phone_number}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Punishments Section */}
            <div className="w-full">
                <div className=" pt-6 pb-2">
                    <h2 className="text-xl font-semibold">Informasi Denda</h2>
                    <p className="text-sm text-muted-foreground">
                        Daftar denda yang berlaku di cabang ini
                    </p>
                </div>
                <div className=" pb-6">
                    {boardingBranch.punishments.length > 0 ? (
                        <div className="space-y-4">
                            {boardingBranch.punishments.map((punishment) => (
                                <div
                                    key={punishment.id}
                                    className="bg-muted/50 rounded-lg border p-4"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                        <div className="flex items-center">
                                            <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                                            <div>
                                                <p className="font-medium">
                                                    Denda Keterlambatan
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Maksimal{" "}
                                                    {punishment.max_day} hari
                                                </p>
                                            </div>
                                        </div>
                                        <div className="md:text-right">
                                            <p className="text-lg font-bold text-primary">
                                                {formatCurrency(
                                                    punishment.price
                                                )}
                                                /hari
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            Tidak ada informasi denda untuk cabang ini
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Index;

// Maintain the original layout structure
Index.layout = (page: React.ReactNode) => (
    <ResidentLayout tittle="Info Kos" head="Info Kos" children={page} />
);
