import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { usePage } from "@inertiajs/react";
import {
    BoardingBranch,
    ContactAdmin,
    PageProps,
    PaymentGatewayProps,
    Punishment,
} from "@/types";
import { Info } from "lucide-react";
import BoardingBranchComponent from "./BoardingBranchComponent";
import PunishmentComponent from "./PunishmentComponent";
import { Button } from "@/Components/ui/button";
import Create from "./Create";
import ImageContactCenter from "../../../../../public/bg/contact-center.png";

import DeleteBranchComponent from "./DeleteBranchComponent";
import DeleteCard from "./DeleteBranchComponent";
import PaymentGateway from "./PaymentGateway";

interface Props {
    boardingBranches: BoardingBranch;
    punishments: Punishment;
    totalRoomQty: number;
    paymentGateway: PaymentGatewayProps;
}
const Index = ({
    boardingBranches,
    punishments,
    totalRoomQty,
    paymentGateway,
}: Props) => {
    const { room_qty } = usePage<PageProps>().props;
    const quota = room_qty.room_qty - totalRoomQty;

    const [tabs, setTabs] = React.useState("boardingBranch");
    return (
        <div className="lg:pl-[295px] px-5 pt-5 h-screen relative overflow-y-auto pb-10 md:pt-24 lg:pr-6 space-y-4">
            <div className="flex flex-col mb-5">
                <div className="flex flex-col md:flex-row bg-white justify-start gap-5  dark:bg-zinc-800 md:justify-between  rounded-lg p-4 items-center space-x-3">
                    <div className=" flex items-center gap-3 ">
                        <div className=" w-6">
                            <Info className="text-primary w-6 h-6" />
                        </div>

                        <div>
                            <p className="font-semibold text-lg">
                                Informasi Layanan
                            </p>
                            <p className="text-foreground/60">
                                Anda telah memilih layanan untuk{" "}
                                <span className="font-medium text-primary">
                                    {room_qty.room_qty} kamar
                                </span>
                                . Nikmati kenyamanan maksimal dengan layanan
                                kami.
                            </p>
                        </div>
                    </div>{" "}
                    <div className=" flex items-center gap-5 ">
                        <p className="font-semibold text-base md:text-lg">
                            Sisa {quota} Kuota Kamar
                        </p>
                        <Button variant={"outline"}>
                            <a href="https://wa.me/6285173173718?text=Halo%20min,%20saya%20ingin%20upgrade%20layanan%20akun%20saya.">
                                Upgrade Layanan
                            </a>
                        </Button>
                    </div>
                    <div className=" md:hidden  flex w-full  justify-end">
                        <Create
                            className="md:hidden  flex items-center gap-2"
                            quota={quota}
                        />
                    </div>
                </div>
            </div>

            <Tabs defaultValue={tabs}>
                <div className="flex items-center justify-between">
                    <TabsList className=" w-full md:w-auto overflow-auto">
                        <TabsTrigger
                            className=" ml-5 md:ml-0"
                            onClick={() => setTabs("boardingBranch")}
                            value="boardingBranch"
                        >
                            Cabang Kos
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setTabs("paymentGateway")}
                            value="paymentGateway"
                        >
                            Payment Gateway
                        </TabsTrigger>
                    </TabsList>
                    {tabs === "boardingBranch" && (
                        <Create
                            className="hidden md:flex items-center gap-2"
                            quota={quota}
                        />
                    )}
                </div>
                <TabsContent value="boardingBranch">
                    <>
                        <BoardingBranchComponent
                            boardingBranch={boardingBranches}
                        />
                        <PunishmentComponent punishment={punishments} />{" "}
                        <DeleteCard />
                    </>
                </TabsContent>
                <TabsContent value="paymentGateway">
                    <PaymentGateway paymentGateway={paymentGateway} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Index;

Index.layout = (page: React.ReactNode) => (
    <AdminLayout head="Pengaturan" children={page} />
);
