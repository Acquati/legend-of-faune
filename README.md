<p align="center">
  <img width=60% src="public/images/dungeon-crawler.png">
</p>

# Legend of Faune

A [Phaser 3 Framework](https://phaser.io/phaser3) game, made with [Typescript](https://www.typescriptlang.org/) and compiled with [Parcel v2](https://v2.parceljs.org/).

'Up', 'Down', 'Left' and 'Right' keys move the character, 'Space' throw knifes and open chests.
Mobile controls on screen.

Play the [demo on itchi.io](https://acquati.itch.io/legend-of-faune-alpha-test).

## Setup

### Prerequisites

Install [Node.js](https://nodejs.org/en) and [Yarn](https://classic.yarnpkg.com/en/docs/install).

### Installing

```bash
git clone https://github.com/Acquati/legend-of-faune
cd legend-of-faune
yarn install

# Development
yarn run dev

# Build
yarn run build

# Start server
yarn run start

# Lint
yarn run lint
```

Access [localhost:8080](http://localhost:8080/) in your browser.

## Troubleshoot

### Update NPM & YARN global command on Ubuntu

```bash
sudo apt update
sudo apt upgrade
sudo apt autoremove

sudo npm install npm -g

sudo npm cache clean -f
sudo npm install -g n
sudo n stable

sudo npm install --global yarn
```
