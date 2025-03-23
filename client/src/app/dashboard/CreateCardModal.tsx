import React, { useState, useRef, memo, useCallback } from "react";
import styles from '../components/css/Modal.module.css';
import useFetch from "@/components/function/fetch";
import { Button } from "@/components/ui-elements/button";
import InputGroup from "@/components/FormElements/InputGroup"; 
import MultiSelect from "@/components/FormElements/MultiSelect";

interface task {
    card_id: number,
    card_title: string,
    user_id: number
}

interface CreateCardResponse {
    id: number;
    card_title: string;
    options: string;
}
  
function CreateCard({ setTaskList, closeModal }: { 
    setTaskList: React.Dispatch<React.SetStateAction<task[]>>, 
    closeModal: () => void 
}) { 
    const [fetchData] = useFetch();
    const userId = localStorage.getItem("userConnectedId") as string;
    const titleRef = useRef<HTMLInputElement | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(['8','7']);

    // Utilisation de useCallback pour éviter la recréation de la fonction de gestion des changements de sélection
    const handleSelectionChange = useCallback((newSelectedValues: string[]) => {
        setSelectedOptions(newSelectedValues);
    }, []);  // Cette fonction ne change jamais, donc elle sera mémorisée.

    const handleSubmit = async () => {
        console.log("Create card modal");
        const cardTitle = titleRef.current?.value || "";
        const urlCreateCard = 'http://localhost:8080/cards/create';
        const methodPost = 'POST';
        const cardDataNames = ["card_title", "options"];
        const cardDataValues: string[] = [cardTitle, selectedOptions.join(',')]; // Joindre les options en une seule chaîne
    
        if (cardTitle !== "") {
            try {
                const response = await fetchData(urlCreateCard, methodPost, cardDataNames, cardDataValues);
    
                // Vérifier si la réponse contient une erreur
                if (!response || response.error) {
                    console.error("Erreur lors de la création de la carte :", response);
                    return;
                }
    
                // Caster la réponse en type attendu
                const createCardResponse = response as { id: number; card_title: string; options: string };
    
                // Vérifier si userId est contenu dans options
                const optionsArray = createCardResponse.options.split(','); // Convertir en tableau
                if (optionsArray.includes(userId)) {
                    // Ajouter la carte uniquement si userId est dans options
                    setTaskList(prevTasks => [
                        { card_id: createCardResponse.id, card_title: cardTitle, user_id: Number(userId) },
                        ...prevTasks
                    ]);
                }
    
                closeModal();
            } catch (err) {
                console.error("Erreur détectée :", err instanceof Error ? err.message : err);
                closeModal();
            }
        } else {
            console.log("Titre de la carte vide, soumission annulée.");
            closeModal();
        }
    };
    
    

    return (
        <div className={styles.modal}>
            <div className={styles.modalContentForm}>
                <button onClick={closeModal} className={styles.closeButton}>
                    &times;
                </button>
                <label htmlFor="TitleInput" className={styles.formLabel}>
                    Titre de la tâche:
                    <InputGroup 
                        type="text"  
                        inputRef={titleRef} 
                        label="" 
                        placeholder="Entrez un titre"
                    />
                </label>
                <label htmlFor="UserSelection" className={styles.formLabel}>
                    Sélectionner les utilisateurs:
                    <MultiSelect id="dropdown" onChange={handleSelectionChange} />
                </label>
                <Button             
                    label="Valider" 
                    variant="green" 
                    shape="rounded" 
                    size="customSmall"
                    className="flex w-30 mb-5 p-2"
                    onClick={handleSubmit} 
                />
            </div>
        </div>
    );
}

export default memo(CreateCard);
