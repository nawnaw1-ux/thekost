import Toastify from "@/Components/Toastify";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect } from "react";
import Swal from "sweetalert2";

export default function RootLayout({ children }: PropsWithChildren) {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash && flash?.error) {
            Swal.fire({
                icon: "error",
                title: flash.error,
                showConfirmButton: false,
                timer: 1100,
            }).then(() => {
                window.location.reload();
            });
        } else if (flash && flash?.success) {
            if (flash.success === "Branch status updated successfully.") {
                window.location.reload();
            } else {
                Swal.fire({
                    icon: "success",
                    title: flash.success,
                    showConfirmButton: false,
                    timer: 1100,
                }).then(() => {
                    window.location.reload();
                });
            }
        }
    }, [flash]);

    return (
        <div>
            {flash?.success && <Toastify />}
            {flash?.error && <Toastify />}
            {children}
        </div>
    );
}
