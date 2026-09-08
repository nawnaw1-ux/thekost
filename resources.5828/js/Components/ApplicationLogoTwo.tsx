import { cn } from "@/lib/utils";
import LogoDark from "../../../public/assets/Logo/logo2.png";
import LogoWhite from "../../../public/assets/Logo/logo1.png";
import { useTheme } from "./theme-provider";
import { useEffect } from "react";

interface Props {
    className?: string;
}

export default function ApplicationLogoTwo({ className }: Props) {
    const variantURL = window.location.pathname;
    const { theme } = useTheme();
    // Define conditions for logo selection
    const darkLogoPaths = ["/admin/dashboard", "/admin/laporan"];

    const whiteLogoPaths = ["/admin/tagihan", "/admin/kamar"];

    // Determine which logo to use
    const logoSrc = darkLogoPaths.some((path) => variantURL === path)
        ? LogoDark
        : whiteLogoPaths.some((path) => variantURL.startsWith(path))
        ? theme === "dark"
            ? LogoDark
            : LogoWhite
        : theme === "dark"
        ? LogoDark
        : LogoWhite;

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }, [theme]);

    return (
        <img
            src={logoSrc}
            className={className ? cn(className) : "h-10 w-auto"}
        />
    );
}
