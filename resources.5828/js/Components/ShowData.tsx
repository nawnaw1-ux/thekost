import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Info, PenBoxIcon } from "lucide-react";
import { ReactNode } from "react";

interface DialogProps {
    children?: ReactNode;
    dialogTitle: string;
    showModal: boolean;
    className?: string;
    setShowModal: (value: boolean) => void;
}
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { cn } from "@/lib/utils";

const ShowData = ({
    children,
    className,
    dialogTitle,
    showModal,
    setShowModal,
}: DialogProps) => {
    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger>
                {" "}
                <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger>
                            {" "}
                            <Button
                                variant={"outline"}
                                onClick={() => setShowModal(true)}
                                size={"sm"}
                                className="hover:bg-red-100/10 border-blue-500"
                            >
                                {" "}
                                <Info className="h-4 w-4 text-blue-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Detail</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>{" "}
            </DialogTrigger>
            <DialogContent
                className={cn(
                    " bg-background top-[50%]  overflow-y-auto",
                    className
                )}
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

export default ShowData;
