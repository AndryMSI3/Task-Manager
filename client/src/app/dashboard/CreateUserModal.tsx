import React, { useRef, useState } from 'react';
import styles from '../components/css/Modal.module.css';
import { Select } from '@/components/FormElements/select';
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from '@/components/ui-elements/button';
import Image from 'next/image';
import { toast } from 'react-toastify';

// Définition du type des options pour le select
type PrivilegeOption = { value: number; label: string };

// Définition des props du composant
const CreateUserModal = ({ closeUserCreating }: { closeUserCreating: (valeur: boolean) => void }) => {
    // Références pour récupérer la valeur des champs d'entrée
    const userNameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const privilegeRef = useRef<HTMLSelectElement>(null);
    let userName: string;
    let password: string;
    // États pour gérer l'image sélectionnée, les erreurs et l'aperçu de l'image
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    // Définition des exigences du mot de passe
    const passwordRequirements = `Le mot de passe doit contenir une lettre majuscule et minuscule, 
    un chiffre et un des caractères '!@#$%^&*()-_+=' et doit avoir une longueur d'au moins 8 caractères`;

    // Fonction de gestion du fichier image
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = document.createElement("img");
                if (typeof reader.result === "string") {
                    img.src = reader.result;
                }
                img.onload = () => {
                    const { width, height } = img;
                    if (width > 100 && height > 100) {
                        const url = URL.createObjectURL(file);
                        setSelectedFile(file);
                        setPreviewImage(url);
                    } else {
                        alert('Les dimensions de l\'image doivent être d\'au moins 100x100 pixels.');
                    }
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert('Veuillez sélectionner un fichier image valide.');
        }
    };

    // Fonction pour fermer le modal
    const handleClose = () => {
        closeUserCreating(false);
    };

    // Options pour le champ de sélection des privilèges
    const privilegeOptions = [
        { value: "2", label: "Développeur" },
        { value: "1", label: "Développeur en chef" }
    ];

    // Fonction pour gérer la création de l'utilisateur
    const handleCreateUser = async () => {
        userName = userNameRef.current?.value as string;
        password = passwordRef.current?.value as string;

        // Vérification des champs requis
        if (!userName || !password) {
            setErrorMessage("Nom d'utilisateur et mot de passe requis.");
            return;
        }

        if (!selectedFile) {
            setErrorMessage("Veuillez sélectionner une image.");
            return;
        }

        // Définition des regex pour validation des entrées
        const userNameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        // Validation des entrées utilisateur
        if (!userNameRegex.test(userName) || !/[a-z]/.test(userName)) {
            setErrorMessage("Seules les lettres de l'alphabet sont autorisées.");
            return;
        }
        if (!passwordRegex.test(password)) {
            setErrorMessage(passwordRequirements);
            return;
        }

        try {
            // Création de FormData pour envoyer les données
            const formData = new FormData();
            const selectedValue = privilegeRef.current?.value;

            formData.append("image", selectedFile);
            formData.append("userName", userName);
            formData.append("passWord", password);
            formData.append("privilege",selectedValue as string);

            // Envoi des données au backend
            const response = await fetch('http://localhost:8080/api/users/create', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Gestion des erreurs retournées par le backend
            if (data.errors) {
                const errors = data.errors.map((err: any) => err.msg).join(", ");
                setErrorMessage(errors);
            } else {
                toast.success("Enregistrement réussi !");
                setPreviewImage(data.UserPicture);
                handleClose();
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <>
            <div className={styles.modal}>
                <div className={styles.modalContentForCreateUser}>
                    <div
                        aria-label="user form"
                        style={{
                            borderRadius: "20px",
                            flexDirection: "column",
                            height: "fit-content",
                            display: "flex",
                            backgroundColor: "white",
                            padding: "5px 15px 15px 15px",
                        }}
                    >
                        {/* Bouton de fermeture du modal */}
                        <button onClick={() => closeUserCreating(false)} className={styles.closeButton}>
                            &times;
                        </button>
                        <div style={{ height:"85vh", paddingRight:"1vw", overflowY:"scroll" }}>
                            {/* Sélection de l'image de profil */}
                            <label>
                                <b>Choisir photo de profil</b>
                                <p style={{ color: 'grey', fontSize: 'small', margin: 'unset' }}>
                                    Seuls les formats d&aposimages sont autorisés.
                                </p>
                                <InputGroup
                                    type="file"
                                    fileStyleVariant="style1"
                                    label=""
                                    placeholder="Attach file"
                                    style={{ border:"1px solid #ccc" }}
                                    handleChange={handleFileChange}
                                />
                                {previewImage && (
                                    <Image
                                        src={previewImage}
                                        alt="Uploaded"
                                        width={128}
                                        height={128}
                                        style={{
                                            objectFit: "cover",
                                            marginBottom: "5px",
                                            marginTop: "10px"
                                        }}
                                    />
                                )}
                            </label>

                            {/* Champ du nom d'utilisateur */}
                            <label style={{ marginTop: "5px" }}>
                                <b>Nom d&apos;utilisateur:</b>
                                <p style={{ color: 'grey', fontSize: 'small', margin: 'unset' }}>
                                    Seules les lettres majuscules et minuscules sont autorisées
                                </p>
                                <InputGroup 
                                    inputRef={userNameRef} 
                                    label=''
                                    placeholder='' 
                                    type='text' 
                                    style={{ border:"1px solid #ccc", padding:"8px 20px" }}
                                />
                            </label>

                            {/* Champ du mot de passe */}
                            <label>
                                <b>Mot de passe:</b>
                                <p style={{ color: 'grey', fontSize: 'small', margin: 'unset' }}>
                                    {passwordRequirements}
                                </p>
                                <InputGroup 
                                    inputRef={passwordRef} 
                                    label='' 
                                    placeholder='' 
                                    type='password' 
                                    style={{ border:"1px solid #ccc", padding:"8px 20px" }}
                                />
                            </label>

                            {/* Sélection du privilège */}
                            <label htmlFor="selectPrivilege">
                                <b>Sélectionner fonction</b><br />

                                <Select 
                                    selectStyle={{ padding:"8px 20px", border:"1px solid #ccc" }}
                                    label='' 
                                    placeholder='' 
                                    items={privilegeOptions} 
                                    ref={privilegeRef}  
                                />
                            </label>

                            {/* Affichage des erreurs */}
                            <p className={styles.error}>{errorMessage}</p>

                            {/* Bouton de validation */}
                        
                            <Button label='valider' onClick={handleCreateUser} shape={'rounded'} size={'small'} className='mt-4' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateUserModal;
