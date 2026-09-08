import { Link, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { PageProps } from "@/types";
import { LogOut, User } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import ApplicationLogo from "../ApplicationLogo";
const NavbarAdmin = () => {
    const { auth } = usePage<PageProps>().props;

    return (
        <nav className="w-full border-b bg-background flex px-5 md:px-4 justify-between py-6 md:py-3 lg:px-10 items-center z-10 top-0 fixed">
            <Link href="/dashboard">
                {" "}
                <ApplicationLogo className="w-12 lg:ml-14 lg:mt-4 lg:w-24" />
            </Link>

            <div className="flex items-center gap-3  md:gap-5">
                <ModeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className=" items-center gap-3  cursor-pointer flex">
                            <div className=" flex-col w-auto hidden md:flex">
                                <span className=" text-sm font-semibold  ">
                                    {auth.user.name}
                                </span>
                                <span className="text-xs font-medium text-gray-400 ">
                                    {auth.user.email}
                                </span>
                            </div>
                            <svg
                                className=" ml-2 "
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m7 10l5 5m0 0l5-5"
                                ></path>
                            </svg>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mt-2 z-[110]">
                        <DropdownMenuLabel>Menu</DropdownMenuLabel>
                        <Link href={route("resident.profile.index")}>
                            <DropdownMenuItem className=" cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href={route("logout")} method="post">
                            <DropdownMenuItem className=" cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default NavbarAdmin;
