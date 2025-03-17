import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";
const menuItemBaseStyles = cva(
  "rounded-lg px-3.5 font-medium text-dark-4 transition-all duration-200 dark:text-dark-6",
  {
    variants: {
      isActive: {
        true: "bg-[rgba(87,80,241,0.07)] text-primary hover:bg-[rgba(87,80,241,0.07)] dark:bg-[#FFFFFF1A] dark:text-white",
        false:
          "hover:bg-gray-100 hover:text-dark hover:dark:bg-[#FFFFFF1A] hover:dark:text-white",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
    activateState?: () => void; // Fonction qui active un état (si nécessaire)
    activateAction?: () => void; // Fonction qui exécute une action (si nécessaire)
  }
) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  const handleClick = () => {
    // Exécuter l'action si elle est définie
    if (props.activateAction) {
      console.log("activateAction exécutée"); // Pour vérifier dans la console
      props.activateAction();
    }
  
    // Activer un état si défini
    if (props.activateState) {
      console.log("activateState exécutée"); // Pour vérifier dans la console
      props.activateState();
    }
  
    // Fermer le sidebar si on est sur mobile
    if (isMobile) {
      console.log("Fermeture du sidebar sur mobile"); // Pour debug
      toggleSidebar();
    }
  };
  

  return (
    <button
      onClick={handleClick}  // On utilise handleClick ici pour l'action et l'activation de l'état
      aria-expanded={props.isActive}
      className={menuItemBaseStyles({
        isActive: props.isActive,
        className: "flex w-full items-center gap-3 py-1",
      })}
    >
      {props.children}
    </button>
  );
}
