import React, { useState, useRef, memo } from "react";
import styles from '../components/css/Modal.module.css';
import useFetch from "@/components/function/fetch";
import { Button } from "@/components/ui-elements/button";
import InputGroup from "@/components/FormElements/InputGroup"; 
interface column {
    items: any[];
    name: string;
    statusId: number;
}

interface CardIdResponse {
    max_id: number;
}

interface columnData {
    name: string;
    columns: column[];
}
/**
 * Composant pour créer une nouvelle carte dans une colonne.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {Array} props.columnData - Les données de la colonne contenant les informations des tâches.
 */
function CreateCard({ onCardAdded, closeModal }: { onCardAdded: () => void, closeModal: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fetchData] = useFetch();
    const userId = localStorage.getItem("userConnectedId") as string;
    const titleRef = useRef<HTMLInputElement | null>(null);


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
                const urlCreateContent = 'http://localhost:8080/contents/create';
                const contentDataNames = ["content", "card_id"];
                if (!Array.isArray(maxCardId) || maxCardId.length === 0) {
                    console.error("Données invalides :", maxCardId);
                    return;
                }
                const contentDataValues = ["", maxCardId[0]?.max_id.toString()];
                await fetchData(urlCreateContent, methodPost, contentDataNames, contentDataValues);

                
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
