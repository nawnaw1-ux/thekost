import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { Punishment } from "@/types";
import Edit from "./Edit";
import ImageContactCenter from "../../../../../public/bg/11107.jpg";
interface PageProps {
    punishment: Punishment;
}
const Index = ({ punishment }: PageProps) => {
    return (
        <>
            <div className="mt-5  relative flex flex-col max-w-4xl items-center md:flex-row md:items-start gap-5 md:gap-12 rounded-lg p-5 bg-brandy-rose-100">
                <img
                    className=" w-[200px]  h-36"
                    src={ImageContactCenter}
                    alt=""
                />
                <div className="flex flex-col gap-7 w-full">
                    <span className=" font-semibold text-xl">Atur Denda</span>
                    <div className=",">
                        <Edit punishment={punishment} />
                    </div>
                </div>
            </div>
        </>
    );
};

Index.layout = (page: React.ReactNode) => (
    <AdminLayout
        tittle="Manajamen Denda"
        description="Halaman ini berfungsi sebagai halaman utama manajemen denda"
        head="denda"
        children={page}
    />
);
export default Index;
