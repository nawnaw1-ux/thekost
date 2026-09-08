import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { User } from "@/types";
import UpdatePasswordForm from "./UpdatePasswordForm";
import AdminLayout from "@/Layouts/AdminLayout";

interface Props {
    user: User;
}

const Index = ({ user }: Props) => {
    return (
        <div className=" lg:pl-[295px] px-4 h-screen pt-24 lg:pr-6 space-y-4">
            {" "}
            <div className="flex md:hidden items-center gap-3">
                <p className=" font-semibold">PROFILE ADMIN</p>{" "}
            </div>
            <div className="p-4 max-w-5xl sm:p-8 mt-3 bg-white dark:bg-secondary/10 shadow rounded-xl border">
                <UpdatePasswordForm />
            </div>
        </div>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AdminLayout
        tittle="Profile"
        head="Profile"
        description="Halaman ini berfungsi sebagai halaman Profile"
    >
        {page}
    </AdminLayout>
);

export default Index;
