"use client";

import React, { useState, useEffect, useCallback } from "react";
import CreateCardModal from "./CreateCardModal";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import CreateUserModal from "./CreateUserModal";
import CardPage from "./pageForCard";
import { title } from "process";
import { error } from "console";

interface column {
  items: any[];
  name: string;
  statusId: number;
}

interface Snapshot {
  isDraggingOver: boolean;
}
interface result {
  source: number;
  destination: number;
}

interface task {
  card_id: number,
  card_title: string,
  user_id: number
}

export default function KanbanBoard () {
  const [isUserCreationOpen, setIsUserCreationOpen] = useState(false);
  const [isLeaderMode, setIsLeaderMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskList, setTaskList] = useState<task[]>([]);
  const [cardId,setCardId] = useState(0);

  const openModal = () => {  
    setIsModalOpen(true);
  };


  /**
   * Ouvre la modal pour créer un utilisateur.
   */
  const openUserCreation = () => {
      setIsUserCreationOpen(true);
  };

  /**
   * Ferme la modal de création d'utilisateur.
   */
  const closeUserCreation = () => {
      setIsUserCreationOpen(false);
  };

  /**
   * Ferme la modal de création de carte.
   */
  const closeModal = () => {   
      setIsModalOpen(false);
  };
  
  const refreshColumns = () => {
    fetchTaskData();
  };

  const fetchTaskData = useCallback(() => {
    const userId = localStorage.getItem("userConnectedId");
    fetch(`http://localhost:8080/cards/user/${userId}`)
    .then((rawData) => rawData.json())
    .then((data) => {
      setTaskList(data);
    })
    .catch((error) =>{
      console.log("error ",error);
    });
  }, []);

  useEffect(() => {
    const userPrivilege = localStorage.getItem("userPrivilege");
    if (userPrivilege?.includes("1")) {
        setIsLeaderMode(true);
    } else if (userPrivilege?.includes("2")) {
        setIsLeaderMode(true);
    }
    fetchTaskData();
   }, []); 


  const navData = [
    {
      label: "Tâches",
      items: Object.hasOwn(taskList,"message") ? 
      [] 
      : taskList.map((task) => ({
        title: task.card_title,
        activateAction: () => setCardId(task.card_id),
        items: [],
      }))  ,
    },
    {
      label: "Fonctionnalités",
      items: [
        {
          title: "Créer un utilisateur",
          activateAction: () => openUserCreation(),
          items: [],
        },
        {
          title: "Créer une tâche",
          activateAction: () => openModal(),
          items: [],
        },
      ],
    },
  ];
  

  return (
    <div className="flex min-h-screen">
        <Sidebar navData={navData}/>     
        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
            <Header />
            {isUserCreationOpen && (
                <CreateUserModal
                    closeUserCreating={closeUserCreation}
                />
            )}
            {isModalOpen &&
              <CreateCardModal onCardAdded={refreshColumns} closeModal={closeModal}/>
            }
            <div  className="isolate mx-auto w-full overflow-hidden p-4 md:p-6 2xl:p-10">
              {cardId ? <CardPage cardId={cardId}/>:<p>Aucune carte n'est selectionnée...</p>}
            </div>
        </div>
    </div>
  );
};

