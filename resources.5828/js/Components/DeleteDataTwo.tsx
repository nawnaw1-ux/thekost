import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "./ui/button";
import { Trash2, TrashIcon } from "lucide-react";
import { router } from "@inertiajs/react";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface Props {
    paramId: string;
    content?: string;
}
const DeleteDataTwo = ({ paramId, content }: Props) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <Dialog onOpenChange={setShowModal} open={showModal}>
                <DialogTrigger>
                    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant={"outline"}
                                    onClick={() => setShowModal(true)}
                                    size={"sm"}
                                    className="hover:bg-red-100/10 border-red-500"
                                >
                                    {" "}
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Hapus</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>{" "}
                </DialogTrigger>
                <DialogContent className="bg-background">
                    <DialogHeader>
                        <DialogTitle className="mt-2 text-start leading-6">
                            Apakah anda yakin ingin menghapus?
                        </DialogTitle>
                    </DialogHeader>
                    <p className=" text-sm text-foreground/70">{content}</p>
                    <div className="mt-4 flex items-center justify-end gap-4">
                        <Button
                            variant={"outline"}
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                router.delete(`${paramId}`, {
                                    preserveScroll: true,
                                });
                                setShowModal(false);
                            }}
                        >
                            Continue
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteDataTwo;
