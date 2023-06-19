# U2L Bot

## Fonctionnement

Ce bot Discord permet l'accès aux données fournies par certaines API.  
Les slash commands disponibles sont:
- 📚  **/bu** : Affluence des Bibliothèques Universitaires
- 🍔  **/ru** : Menus des Résto U' du Crous Lorraine
- 📖  **/annuaire** : Infos sur un personnel dans l'Annuaire
- 🚌  **/stan** : Prochains passages du réseau Stan
- ⛅  **/meteo** : La météo en temps réel
- 😃  **/help** : Afficher l'aide

## Installation

1. Cloner le dépôt Git
```shell
git clone https://github.com/maelgangloff/u2l-bot
```
2. Installer les dépendances du projet
```shell
yarn install # npm install
```
3. Construire le dossier dist/
```shell
npx tsc
```
4. Modifier le fichier .env (variables d'environnement)
```shell
vim .env
```
5. Lancer U2L-Bot
```shell
node dist/Bot.js
```

## Commandes disponibles

### `/bu` : Bibliothèque Universitaire
![Screenshot bu](https://github.com/maelgangloff/u2l-bot/assets/51171251/0cd70591-cbd0-498e-96c1-3173ae569325)

### `/ru` : Restaurant Universitaire
![Screenshot ru](https://github.com/maelgangloff/u2l-bot/assets/51171251/45b5b0af-96e9-44c0-bf57-fa09d7796a75)

### `/annuaire` : Annuaire public du personnel de l'UL
![Screenshot annuaire](https://github.com/maelgangloff/u2l-bot/assets/51171251/4780e399-a9bd-4f25-a201-443e80902d2e)

### `/stan` : Prochains passages des bus
![Screenshot stan](https://github.com/maelgangloff/u2l-bot/assets/51171251/b5d0353f-3873-4e4f-8260-bfd5b376859f)

### `/meteo` : Météo actuelle
![Screenshot meteo](https://github.com/maelgangloff/u2l-bot/assets/51171251/cba9a199-44e7-4221-bf62-42fbf53c0f36)

### `/help` : Obtenir de l'aide
![Screenshot help](https://github.com/maelgangloff/u2l-bot/assets/51171251/c2c180a2-2160-42e4-9940-783c1a5d3f01)
