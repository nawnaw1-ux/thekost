import { Link } from "@inertiajs/react";
import React from "react";

interface SidebarItemProps {
    href: string;
    icon?: React.FC;
    label: string;
    onclick?: () => void;
    isActive: boolean;
}
const SidebarItem = ({
    href,
    icon: Icon,
    label,
    onclick,
    isActive,
}: SidebarItemProps) => (
    <Link
        as="button"
        method="get"
        href={href}
        onClick={onclick}
        className={`p-2 w-full text-sm flex items-center justify-between ${
            isActive ? " bg-primary/20" : ""
        }`}
    >
        <div
            className={`flex items-center gap-2 ${
                isActive ? "text-foreground" : "text-zinc-500"
            }`}
        >
            {Icon && <Icon />}

            {label}
        </div>
        {isActive && (
            <span className="h-6 w-[3px] bg-primary rounded-l-md"></span>
        )}
    </Link>
);

export default SidebarItem;
