import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import ImageContactCenter from "../../../../../public/bg/contact-center.png";
import { ContactAdmin } from "@/types";
import Edit from "./Edit";

interface PageProps {
    contactAdmin: ContactAdmin;
}
const Index = ({ contactAdmin }: PageProps) => {
    return (
        <>
            <div className="mt-5  relative flex flex-col max-w-4xl items-center md:flex-row md:items-start gap-5 md:gap-12 rounded-lg p-5 bg-brandy-rose-100">
                <img
                    className=" w-[185px] lg:mt-14 h-40"
                    src={ImageContactCenter}
                    alt=""
                />
                <div className="flex flex-col gap-7 w-full">
                    <span className=" font-semibold text-xl">
                        Informasi Layanan
                    </span>
                    <div className=",">
                        <Edit contactAdmin={contactAdmin} />
                    </div>
                </div>
            </div>
        </>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AdminLayout
        tittle="Manajamen Kontak Admin"
        description="Halaman ini berfungsi sebagai halaman utama manajemen kontak admin"
        head="kontak admin"
        children={page}
    />
);
export default Index;
