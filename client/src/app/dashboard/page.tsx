"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import CreateCardModal from "./CreateCardModal";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import CreateUserModal from "./CreateUserModal";
import CardPage from "./pageForCard";

interface task {
  card_id: number;
  card_title: string;
  user_id: number;
}

export default function KanbanBoard() {
  console.log("KanbanBoard");
  const [isUserCreationOpen, setIsUserCreationOpen] = useState(false);
  const [isLeaderMode, setIsLeaderMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskList, setTaskList] = useState<task[]>([]);
  const [cardId, setCardId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);  // État local pour stocker le userId

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openUserCreation = () => setIsUserCreationOpen(true);
  const closeUserCreation = () => setIsUserCreationOpen(false);

  const stableSetTaskList = useCallback((newTaskList: task[] | ((prev: task[]) => task[])) => {
    setTaskList(newTaskList);
  }, [setTaskList]);
  
  
  useEffect(() => {
    const userId = localStorage.getItem("userConnectedId");
    if (!userId) return;  // Vérifie si userId existe
  
    fetch(`http://localhost:8080/cards/user/${userId}`)
      .then((rawData) => rawData.json())
      .then((data) => {
        // Si la nouvelle tâche est identique à l'ancienne, ne fais pas le set
        setTaskList((prevTaskList) => {
          if (JSON.stringify(prevTaskList) === JSON.stringify(data?.message ? [] : data)) {
            return prevTaskList;  // Retourne l'ancien état si les données sont identiques
          }
          return data?.message ? [] : data;  // Sinon, mets à jour les données
        });
      })
      .catch((error) => {
        console.error("Error fetching tasks: ", error);
      });
  }, []); // Ce useEffect ne s'exécute qu'une seule fois au montage
  

  
  // Préparation des données de navigation (memoization)
  const navData = useMemo(() => [
    {
      label: "Fonctionnalités",
      items: [
        {
          title: "Créer un utilisateur",
          activateAction: openUserCreation,
          items: [],
        },
        {
          title: "Créer une tâche",
          activateAction: openModal,
          items: [],
        },
      ],
    },
    {
      label: "Tâches",
      items: taskList.map((task) => ({
        id: task.card_id,
        title: task.card_title,
        activateAction: () => setCardId(task.card_id),
        items: [],
      })),
    },
  ], [taskList]);  // Si taskList change, on met à jour navData

  return (
    <div className="flex min-h-screen">
      <Sidebar navData={navData} />
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />
        {isUserCreationOpen && (
          <CreateUserModal closeUserCreating={closeUserCreation} />
        )}
        {isModalOpen && (
          <CreateCardModal setTaskList={stableSetTaskList} closeModal={closeModal} />
        )}
        <div className="isolate mx-auto w-full overflow-hidden p-4 md:p-6 2xl:p-10">
          {cardId ? (
            <CardPage cardId={cardId} />
          ) : (
            <p>Aucune carte n&apos;est sélectionnée...</p>
          )}
        </div>
      </div>
    </div>
  );
}
