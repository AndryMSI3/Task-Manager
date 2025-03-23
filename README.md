<h1>Task Manager</h1>

<p>
    Une application web développée avec <strong>React</strong>, <strong>Next.js</strong> et <strong>TypeScript</strong> pour le frontend, 
    et <strong>Express</strong> avec <strong>TypeScript</strong> pour le backend.  
</p>

<p>
    L'application permet aux utilisateurs de <strong>se connecter</strong>, de <strong>créer des tâches</strong>, et d'afficher une tâche sélectionnée dans une 
    <strong>section centrale dynamique</strong> où ils peuvent modifier la description et ajouter des commentaires.
</p>

<h2>🛠️ Technologies utilisées</h2>
<ul>
    <li><strong>Next.js</strong></li>
    <li><strong>TypeScript</strong></li>
    <li><strong>CSS / Styled Components / Tailwind</strong></li>
    <li><strong>Fetch API Backend</strong></li>
    <li><strong>Express.js</strong></li>
    <li><strong>MySQL</strong></li>
</ul>

<h2>📌 Crédits</h2>
<p>• Ce projet utilise le template <strong>NextAdmin</strong>.</p>
<p>• <a href="https://github.com/NextAdminHQ/nextjs-admin-dashboard" target="_blank">Lien vers NextAdmin</a></p>
<p>Merci aux créateurs pour leur travail !</p>

<h2>📌 Fonctionnalités</h2>
<ul>
    <li>✅ Connexion utilisateur</li>
    <li>✅ Création de tâches</li>
    <li>✅ Affichage dynamique des tâches via une sidebar</li>
    <li>✅ Section centrale avec la description de la tâche et les commentaires</li>
    <li>✅ Modification de la description d'une tâche</li>
    <li>✅ Section commentaires</li>
</ul>

<h2>🚀 Installation et exécution</h2>
<ol>
    <li><strong>Cloner le dépôt</strong><br>
        <code>git clone https://github.com/AndryMSI3/CardManager.git</code>
    </li>
    <li><strong>Configurer le backend</strong><br>
        Avant d'installer les dépendances, créer les fichiers suivants à la racine:
        <br>
        <strong>Fichier <code>.env</code> :</strong>
        <pre>
DB_HOST=le_nom_de_votre_localhost
DB_USER=votre_nom_utilisateur_de_la_base_de_donnée
DB_PASSWORD=mot_de_passe_de_votre_base_de_donnée
DB_NAME=cardManager
        </pre>
        <strong>Fichier <code>.my.cnf</code> :</strong>
        <pre>
[client]
user = votre_nom_utilisateur_de_la_base_de_donnée
password = mot_de_passe_de_votre_base_de_donnée
        </pre>
    </li>
    <li><strong>Installer les dépendances</strong><br>
        <strong>Frontend :</strong><br>
        <code>cd client</code><br>
        <code>npm install</code><br>
        <code>npm run dev</code><br>
        <strong>Backend :</strong><br>
        <code>cd nodejs-express-mysql</code><br>
        <code>npm install</code><br>
        <code>ts-node server.ts</code>
    </li>
</ol>
<h2>🔑 Identifiants par défaut</h2>
<p>Ce projet étant avant tout une démonstration de mes compétences, un utilisateur par défaut est créé :</p>
<ul>
    <li><strong>Nom d'utilisateur :</strong> <code>admin</code></li>
    <li><strong>Mot de passe :</strong> <code>P@ssw0rd</code></li>
</ul>
<p>Ces identifiants ne sont pas modifiables dans la version actuelle. Si vous souhaitez utiliser ce projet pour un usage réel, 
vous pouvez adapter le code en conséquence.</p>

<h2>🏗️ Structure du projet</h2>
<pre>
CardManager/
│── client/  # Next.js (React + TypeScript)
│── nodejs-express-mysql/   # Express.js (TypeScript)
│── README.md
</pre>

<h2>📜 Licence</h2>
<p>Ce projet est sous licence <strong>MIT</strong>.</p>
