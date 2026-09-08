import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Resident } from "@/types";
import Womanicon from "../../../../../../public/assets/Logo/woman.png";
import Manicon from "../../../../../../public/assets/Logo/man.png";
import { Button } from "@/Components/ui/button";
import { FormatRupiah } from "@arismun/format-rupiah";
import { CreditCard, InfoIcon, Mail, Phone } from "lucide-react";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
interface Props {
    resident: Resident;
}
const Show = ({ resident }: Props) => {
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <Dialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            key={resident.id}
        >
            <DialogTrigger className=" w-full">
                <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger>
                            {" "}
                            <button
                                onClick={() => setOpenDialog(true)}
                                className=" hover:bg-blue-100/20 border-blue-500"
                            >
                                {" "}
                                <InfoIcon className="h-4  w-4 text-blue-500" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Detail</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>{" "}
            </DialogTrigger>
            <DialogContent className=" max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        Detail Penghuni
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 ">
                    {/* User Details */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full">
                            {resident.gender === "Laki-laki" ? (
                                <img
                                    src={Manicon}
                                    alt="Man Icon"
                                    className="w-8 h-8"
                                />
                            ) : (
                                <img
                                    src={Womanicon}
                                    alt="Woman Icon"
                                    className="w-8 h-8"
                                />
                            )}
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {resident.user.name}
                            </p>
                        </div>
                    </div>
                    {/* Contact Info */}
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-primary" />
                            <p className="text-sm text-gray-900 dark:text-white">
                                {resident.user.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-primary" />
                            <p className="text-sm text-gray-900 dark:text-white">
                                {resident.phone_number}
                            </p>
                        </div>{" "}
                        <div className="flex  items-center w-full justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard
                                    size={16}
                                    className="text-primary"
                                />
                                <p className=" px-3 border py-1 font-semibold rounded-md bg-white text-black">
                                    {resident.number_plat}
                                </p>
                            </div>{" "}
                        </div>
                    </div>
                    <hr className="border border-foreground/10 " />
                    <div className="flex flex-col gap-2.5">
                        <p>Keperluan</p>
                        {resident.needs.map((need) => (
                            <div
                                className="flex justify-between items-center gap-2"
                                key={need.id}
                            >
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {need.item.name}
                                </p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    <FormatRupiah value={need.item.price} />
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Show;
