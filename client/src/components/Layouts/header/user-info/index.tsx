"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useRouter } from "next/navigation";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [USER, setUSER] = useState({
    name: "",
    email: "",
    img: "/images/default.png", // Image par défaut au cas où user_picture est null
  });
  useEffect(() => {
    const userId = localStorage.getItem("userConnectedId");
    fetch(`http://localhost:8080/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      setUSER({
        name: data.user_name || "Utilisateur inconnu",
        email: `id-${data.user_id}@app.com`, // Pas d'email dans la BDD, donc génération d'un pseudo-email
        img: data.user_picture ? "http://localhost:3000/images/"+ data.user_picture : "http://localhost:3000/images/default.png",
      });
    });
  },[])

  const router = useRouter();
  const handleLogout = () => {
      localStorage.removeItem("selectedOptions");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userConnectedId");
      localStorage.removeItem("userPrivilege");
      localStorage.removeItem("InitialLoaded");
      localStorage.removeItem("columnOrder");
      localStorage.removeItem("boardId");
      localStorage.removeItem("epr_ru");
      localStorage.removeItem("boardData");
      setIsOpen(false);
      router.push("/");
  };
  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={USER.img}
            className="size-7 rounded-full"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            /> 
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        {/* <h2 className="sr-only">User information</h2> */}

        {/* <figure className="flex items-center gap-2.5 px-5 py-3.5"> */}
{/*           <Image
            src={USER.img}
            className="rounded-full size-14"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={250}
            height={250}
          /> */}

{/*           <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-gray-6">{USER.email}</div>
          </figcaption> */}
        {/* </figure> */}

        {/* <hr className="border-[#E8E8E8] dark:border-dark-3" /> */}

{/*         <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" /> */}

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
