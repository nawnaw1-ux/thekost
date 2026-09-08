import { cn } from "@/lib/utils";
import LogoLight from "../../../public/assets/Logo/logo1.png";
import LogoDark from "../../../public/assets/Logo/logo2.png";

interface Props {
    className?: string;
}

export default function ApplicationLogo({ className }: Props) {
    return (
        <>
            {/* Logo untuk mode dark */}
            <img
                src={LogoDark}
                alt="Logo Dark"
                className={cn("hidden dark:block w-auto", className)}
            />
            {/* Logo untuk mode light */}
            <img
                src={LogoLight}
                alt="Logo Light"
                className={cn("block dark:hidden  w-auto", className)}
            />
        </>
    );
}
