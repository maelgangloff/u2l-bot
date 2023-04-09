# U2L Bot

## Fonctionnement
Ce bot Discord permet l'accès aux données fournies par certaines API.  
Les slash commands disponibles sont:
- **/bu** : Affluence des Bibliothèques Universitaires 📚
- **/ru** : Menus des Résto U' du Crous Lorraine 🍔
- **/annuaire** : Infos sur un personnel dans l'Annuaire 📖
- **/stan** : Prochains passages du réseau Stan 🚌
- **/meteo** : La météo en temps réel ⛅

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
