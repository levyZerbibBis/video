# 📺 Plateforme de Streaming Vidéo en Direct

Une application de streaming vidéo en direct inspirée de YouTube Live, construite avec WebRTC et Node.js.

## 🚀 Fonctionnalités

- 🎥 Diffusion en direct via webcam
- 👥 Visionnage des streams en temps réel
- 💬 Chat en direct pour chaque stream
- 📱 Interface responsive style YouTube
- 🔄 Mise à jour en temps réel des streams disponibles

## 🛠️ Technologies Utilisées

- Frontend : HTML, CSS, JavaScript
- Backend : Node.js avec Express
- Streaming : WebRTC
- Communication temps réel : Socket.IO
- Base de données : SQLite

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)
- Un navigateur moderne supportant WebRTC (Chrome, Firefox, Edge, Safari)

## ⚙️ Installation

1. Clonez le dépôt :
```bash
git clone <url-du-repo>
cd video
```

2. Installez les dépendances :
```bash
make install
```

## 🎮 Utilisation

### Démarrer le serveur en mode production :
```bash
make start
```

### Démarrer le serveur en mode développement (avec rechargement automatique) :
```bash
make dev
```

### Nettoyer l'installation (supprime la base de données et les dépendances) :
```bash
make clean
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 📝 Commandes Make disponibles

- `make install` : Installe les dépendances Node.js
- `make start` : Démarre le serveur en mode production
- `make dev` : Démarre le serveur en mode développement avec nodemon
- `make clean` : Nettoie l'installation (supprime node_modules et la base de données)

## 🌐 Utilisation de l'Application

1. **Page d'accueil** (`http://localhost:3000`)
   - Liste tous les streams en direct
   - Cliquez sur "Démarrer un live" pour commencer à diffuser

2. **Page de diffusion** (`http://localhost:3000/broadcast`)
   - Autorisez l'accès à votre caméra et microphone
   - Entrez un titre pour votre stream
   - Cliquez sur "Démarrer le live"

3. **Page de visionnage** (`http://localhost:3000/live/:id`)
   - Regardez le stream en direct
   - Participez au chat en direct
   - Interface adaptative avec chat sur le côté

## 🔒 Notes de Sécurité

- L'application utilise STUN pour la négociation WebRTC
- Les connexions sont établies en P2P pour le streaming vidéo
- Le chat est modéré via le serveur Socket.IO

## 🐛 Résolution des Problèmes Courants

1. **La caméra ne démarre pas**
   - Vérifiez les permissions du navigateur
   - Assurez-vous qu'aucune autre application n'utilise la caméra

2. **Le stream ne se charge pas**
   - Vérifiez votre connexion internet
   - Rafraîchissez la page
   - Assurez-vous que le diffuseur est toujours en ligne

## 📊 Configuration de la Base de Données

La base de données SQLite est automatiquement créée au démarrage du serveur dans le fichier `streams.db`.

### Structure de la base de données

La base contient deux tables principales :

1. **users** :
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **streams** :
```sql
CREATE TABLE streams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('live', 'off')) DEFAULT 'off',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Accès aux données

Pour accéder directement à la base de données :

1. Installez SQLite CLI (si nécessaire) :
```bash
# Sur macOS avec Homebrew
brew install sqlite

# Sur Ubuntu/Debian
sudo apt-get install sqlite3
```

2. Connectez-vous à la base :
```bash
sqlite3 streams.db
```

3. Commandes utiles :
```sql
-- Voir les tables
.tables

-- Voir la structure d'une table
.schema users
.schema streams

-- Lister les streams actifs
SELECT streams.*, users.username 
FROM streams 
JOIN users ON streams.user_id = users.id 
WHERE status = 'live';
```

### Réinitialisation de la base

Pour réinitialiser la base de données :
```bash
make clean   # Supprime la base actuelle
make start   # Redémarre le serveur qui recrée la base
``` 