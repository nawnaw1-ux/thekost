import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import ResidentLayout from "@/Layouts/ResidentLayout";
import { Resident } from "@/types";
import UpdatePasswordForm from "./UpdatePasswordForm";

interface Props {
    resident: Resident;
}

const Index = ({ resident }: Props) => {
    return (
        <div className="lg:px-56">
            <div className="mt-5  p-4 sm:p-8 rounded-xl bg-secondary/10  border flex max-w-5xl flex-col gap-4">
                {" "}
                <header>
                    <h2 className="text-lg font-medium">Informasi Akun</h2>

                    <p className="mt-1 text-sm text-foreground/70">
                        Mengatur informasi akun
                    </p>
                </header>
                <div className="flex flex-col gap-3">
                    <Label className="text-foreground/70">Nama</Label>
                    <Input disabled value={resident.user.name} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label className="text-foreground/70">Nama Panggilan</Label>
                    <Input disabled value={resident.user.surname} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label className="text-foreground/70">Email</Label>
                    <Input disabled value={resident.user.email} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label className="text-foreground/70">Nomor Telepon</Label>
                    <Input disabled value={resident.phone_number} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label className="text-foreground/70">Jenis Kelamin</Label>
                    <Input disabled value={resident.gender} />
                </div>
            </div>{" "}
            <div className="p-4 max-w-5xl sm:p-8 mt-3 bg-secondary/10 shadow rounded-xl border">
                <UpdatePasswordForm />
            </div>
        </div>
    );
};

Index.layout = (page: React.ReactNode) => (
    <ResidentLayout tittle="Profile" head="Profile">
        {page}
    </ResidentLayout>
);

export default Index;
