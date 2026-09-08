import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { PenBoxIcon } from "lucide-react";
import { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { cn } from "@/lib/utils";
interface DialogProps {
    children?: ReactNode;
    dialogTitle: string;
    className?: string;
    showModal: boolean;
    setShowModal: (value: boolean) => void;
}

const EditData = ({
    children,
    dialogTitle,
    showModal,
    className,
    setShowModal,
}: DialogProps) => {
    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger>
                <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger>
                            {" "}
                            <button
                                onClick={() => setShowModal(true)}
                                className=" hover:bg-red-100/20 border-red-500"
                            >
                                {" "}
                                <PenBoxIcon className="h-4  w-4 text-red-500" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>{" "}
            </DialogTrigger>
            <DialogContent
                className={`${
                    className
                        ? className
                        : cn(
                              "z-[120] max-w-xs sm:max-w-[600px] h-[80vh] md:h-auto max-h-sm overflow-y-auto rounded-lg overflow-auto bg-background"
                          )
                } `}
            >
                <DialogHeader>
                    <DialogTitle className="py-3 text-xl">
                        {dialogTitle}
                    </DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default EditData;
