import React, { useState, useRef, memo, useEffect } from "react";
import styles from '../components/css/Modal.module.css';
import useFetch from "@/components/function/fetch";
import { Button } from "@/components/ui-elements/button";
import InputGroup from "@/components/FormElements/InputGroup"; 
import MultiSelect from "@/components/FormElements/MultiSelect";

interface userData {
    text: string,
    value: string,
    selected: boolean
}

/**
 * Composant pour créer une nouvelle carte dans une colonne.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {Array} props.columnData - Les données de la colonne contenant les informations des tâches.
 */
function CreateCard({ onCardAdded, closeModal }: { onCardAdded: () => void, closeModal: () => void }) {

    const [fetchData] = useFetch();
    const userId = localStorage.getItem("userConnectedId") as string;
    const titleRef = useRef<HTMLInputElement | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const handleSelectionChange = (newSelectedValues: string[]) => {
        setSelectedOptions(newSelectedValues);
    };  

    /**
     * Gère la soumission du formulaire pour créer une nouvelle carte.
     * 
     * @param {Event} e - L'événement de soumission.
     */
    const handleSubmit = async () => {
        const cardTitle = titleRef.current?.value || "";
        const urlCreateCard = 'http://localhost:8080/cards/create';
        const methodPost = 'POST';
        const cardDataNames = ["user_id","card_title"];
        const cardDataValues = [userId,cardTitle];
        if (cardTitle !== "") {   
            try {
                await fetchData(urlCreateCard, methodPost, cardDataNames, cardDataValues);

                const maxCardId= await fetchData('http://localhost:8080/cards/card/maxId');
                if (!Array.isArray(maxCardId) || maxCardId.length === 0) {
                    console.error("Données invalides :", maxCardId);
                    return;
                }
                const urlCreateContent = 'http://localhost:8080/contents/create';
                const contentDataNames = ["content", "card_id"];
                const contentDataValues = ["", maxCardId[0]?.max_id.toString()];
                await fetchData(urlCreateContent, methodPost, contentDataNames, contentDataValues);
                const urlAssociate = "http://localhost:8080/users/associate";
                const associateDataNames = ["user_id", "card_id"];
                selectedOptions.forEach(option => {
                    fetchData(urlAssociate,methodPost,associateDataNames,[option,maxCardId[0]?.max_id.toString()]);
                });
                
            } catch (err) {
                console.log(err instanceof Error ? err.message : err);
            }
        }
        // window.location.reload();
        onCardAdded(); // Met à jour les colonnes dans le Kanban
        closeModal();
    };

    return (
        <>
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
                                placeholder=""
                            />
                        </label>
                        <label htmlFor="TitleInput" className={styles.formLabel}>
                            Selectionner les utilisateurs:
                            <MultiSelect id="dropdown" onChange={handleSelectionChange} />
                        </label>
                        <Button             
                            label="Valider" 
                            variant="green" 
                            shape="rounded" 
                            size={"customSmall"}
                            className="flex w-30 mb-5 p-2"
                            onClick={() => handleSubmit()} 
                        />
                </div>
            </div>
        </>
    );
}

export default memo(CreateCard);
