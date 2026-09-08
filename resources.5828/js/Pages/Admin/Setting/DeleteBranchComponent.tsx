import { Button } from "@/Components/ui/button";
import { Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { router, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { useState } from "react";

const DeleteBranchComponent = () => {
    const { active_boarding_branch } = usePage<PageProps>().props;
    const [inputValue, setInputValue] = useState("");
    const isMatch =
        inputValue.toUpperCase() === active_boarding_branch.name.toUpperCase();

    return (
        <div className="p-6 bg-white dark:bg-zinc-800 border mt-4 rounded-md space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Trash className="text-red-500 w-6 h-6" />
                    <div>
                        <p className="text-lg font-semibold text-foreground/80">
                            Hapus Cabang
                        </p>
                        <p className="text-sm text-gray-500">
                            Perhatian: Bila Anda menghapus cabang kos, maka
                            semua data yang terkait akan ikut terhapus.
                        </p>
                    </div>
                </div>{" "}
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant={"destructive"}>Hapus</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Apakah anda yakin
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Ketik Sesuai Nama Cabang Kos yang akan dihapus{" "}
                                <span className=" text-red-500 font-semibold uppercase">
                                    {active_boarding_branch.name}{" "}
                                </span>
                                lalu klik lanjutkan
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={(e) => setInputValue("")}
                                className=" bg-white text-black border border-red-500 hover:bg-gray-100"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    router.delete(
                                        `/admin/pengaturan/${active_boarding_branch.id}`
                                    );
                                }}
                                className=" bg-red-500 hover:bg-red-600"
                                disabled={!isMatch}
                            >
                                Lanjutkan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default DeleteBranchComponent;
