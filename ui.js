class UI {

    constructor() {

        this.container =
            document.getElementById("game");


        this.flags = {

            "Premier League": "🇬🇧",
            "Liga": "🇪🇸",
            "Serie A": "🇮🇹",
            "Bundesliga": "🇩🇪",
            "Ligue 1": "🇫🇷"

        };


        this.squadUI =
            new SquadUI(this);


        this.tacticsUI =
            new TacticsUI(this);

    }



    /* ================================================= */
    /* BASE UI */
    /* ================================================= */

    clear() {

        this.container.innerHTML = "";

    }



    showTitle(title) {

        const h2 =
            document.createElement("h2");


        h2.textContent = title;


        this.container.appendChild(h2);

    }



    showMessage(message) {

        const p =
            document.createElement("p");


        p.textContent = message;


        this.container.appendChild(p);

    }



    createButton(text, action) {

        const button =
            document.createElement("button");


        button.textContent = text;


        button.addEventListener(
            "click",
            action
        );


        this.container.appendChild(button);


        return button;

    }



    /* ================================================= */
    /* MENU PRINCIPAL */
    /* ================================================= */

    showMainMenu() {

        this.clear();


        this.showTitle(
            "⚽ Manager Career"
        );


        this.showMessage(
            "Bienvenue dans Manager Career !"
        );


        this.createButton(

            "🆕 Nouvelle carrière",

            () => {

                game.currentSaveSlot = null;

                game.club = null;

                this.showLeagueSelection(
                    game.data
                );

            }

        );


        this.createButton(

            "💾 Sauvegardes",

            () => {

                this.showMainSaveMenu();

            }

        );

    }



    /* ================================================= */
    /* SAUVEGARDES DU MENU PRINCIPAL */
    /* ================================================= */

    showMainSaveMenu() {

        this.clear();


        this.showTitle(
            "💾 Sauvegardes"
        );


        this.showMessage(
            "Choisis une sauvegarde à charger."
        );


        for (
            let slot = 1;
            slot <= 3;
            slot++
        ) {

            this.createMainSaveSlot(
                slot
            );

        }


        this.createButton(

            "⬅️ Retour",

            () => {

                this.showMainMenu();

            }

        );

    }



    /* ================================================= */
    /* SLOT DU MENU PRINCIPAL */
    /* ================================================= */

    createMainSaveSlot(slot) {

        const saves =
            game.save.getSaveList();


        const save =
            saves.find(
                item =>
                    item.slot === slot
            );


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "save-slot";


        box.style.margin =
            "15px 0";


        box.style.padding =
            "10px";


        box.style.border =
            "1px solid #ccc";


        /* ========================= */
        /* TITRE */
        /* ========================= */

        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            "💾 Slot " +
            slot;


        box.appendChild(
            title
        );


        /* ========================= */
        /* SLOT VIDE */
        /* ========================= */

        if (!save) {

            const empty =
                document.createElement(
                    "p"
                );


            empty.textContent =
                "🟢 Emplacement vide";


            box.appendChild(
                empty
            );


            this.container.appendChild(
                box
            );


            return;

        }


        /* ========================= */
        /* DONNÉES DE LA CARRIÈRE */
        /* ========================= */

        const gameData =
            save.game;


        /* ========================= */
        /* CLUB */
        /* ========================= */

        if (
            gameData &&
            gameData.club
        ) {

            const club =
                document.createElement(
                    "p"
                );


            club.textContent =
                "🏟️ " +
                gameData.club.name;


            box.appendChild(
                club
            );

        }


        /* ========================= */
        /* SAISON */
        /* ========================= */

        if (
            gameData &&
            gameData.manager &&
            gameData.manager.season
        ) {

            const season =
                document.createElement(
                    "p"
                );


            season.textContent =
                "📅 Saison " +
                gameData.manager.season;


            box.appendChild(
                season
            );

        }


        /* ========================= */
        /* DATE DE SAUVEGARDE */
        /* ========================= */

        const date =
            new Date(
                save.date
            );


        const saveDate =
            document.createElement(
                "p"
            );


        saveDate.textContent =
            "💾 Sauvegardée le " +
            date.toLocaleDateString() +
            " à " +
            date.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        box.appendChild(
            saveDate
        );


        /* ========================= */
        /* CHARGER */
        /* ========================= */

        const loadButton =
            document.createElement(
                "button"
            );


        loadButton.textContent =
            "📂 Charger";


        loadButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(

                        "📂 Charger la carrière " +
                        "du slot " +
                        slot +
                        " ?"

                    );


                if (!confirmed) {

                    return;

                }


                loadCareer(
                    slot
                );

            }
        );


        box.appendChild(
            loadButton
        );


        /* ========================= */
        /* SUPPRIMER */
        /* ========================= */

        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.textContent =
            "🗑️ Supprimer";


        deleteButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(

                        "⚠️ Supprimer définitivement " +
                        "la sauvegarde du slot " +
                        slot +
                        " ?"

                    );


                if (!confirmed) {

                    return;

                }


                deleteCareer(
                    slot
                );


                this.showMainSaveMenu();

            }
        );


        box.appendChild(
            deleteButton
        );


        this.container.appendChild(
            box
        );

    }



    /* ================================================= */
    /* FICHE MANAGER */
    /* ================================================= */

    showManager(manager) {

        this.clear();



        if (manager.logo) {

            const img =
                document.createElement("img");


            img.src =
                "assets/logos/" +
                manager.logo;


            img.width = 120;


            img.style.display = "block";

            img.style.margin = "auto";


            this.container.appendChild(img);

        }



        this.showTitle(
            "🎴 Carrière Manager"
        );



        this.showMessage(
            "🏟️ Club : " +
            manager.clubName
        );



        if (manager.country) {

            this.showMessage(
                "🌍 Pays : " +
                manager.country
            );

        }



        if (manager.league) {

            this.showMessage(
                "🏆 Ligue : " +
                manager.league
            );

        }



        if (manager.level) {

            this.showMessage(
                "⭐ Niveau : " +
                manager.level
            );

        }



        this.showTitle(
            "👔 Manager"
        );



        this.showMessage(
            "Nom : " +
            manager.managerName
        );



        this.showMessage(
            "📅 Saison : " +
            manager.season
        );



        this.showTitle(
            "💰 Gestion"
        );



        this.showMessage(
            "Budget : " +
            manager.budget.toLocaleString()
            +
            " €"
        );



        this.showMessage(
            "⭐ Réputation : " +
            manager.reputation
        );



        this.showTitle(
            "🎯 Objectifs"
        );



        manager.objectives.forEach(
            objective => {

                this.showMessage(
                    "• " +
                    objective
                );

            }
        );



        /* ========================= */
        /* EFFECTIF */
        /* ========================= */

        this.createButton(

            "👥 Effectif",

            () => {

                this.squadUI.showClubPlayers(

                    game.players,

                    manager

                );

            }

        );



        /* ========================= */
        /* TACTIQUES */
        /* ========================= */

        this.createButton(

            "🧠 Tactiques",

            () => {

                this.tacticsUI.show(

                    game.tactics,

                    manager

                );

            }

        );



        /* ========================= */
        /* SAUVEGARDER */
        /* ========================= */

        this.createButton(

            "💾 Sauvegarder",

            () => {

                this.saveCurrentCareer(
                    manager
                );

            }

        );



        /* ========================= */
        /* RETOUR AU MENU */
        /* ========================= */

        this.createButton(

            "🏠 Retour au menu",

            () => {

                this.showMainMenu();

            }

        );

    }



    /* ================================================= */
    /* SAUVEGARDER LA CARRIÈRE */
    /* ================================================= */

    saveCurrentCareer(manager) {

        if (
            game.currentSaveSlot
        ) {

            const success =
                saveCareer(
                    game.currentSaveSlot
                );


            if (success) {

                alert(
                    "✅ Carrière sauvegardée !"
                );

            }


            return;

        }


        this.showSaveChoice(
            manager
        );

    }



    /* ================================================= */
    /* CHOIX DU SLOT */
    /* ================================================= */

    showSaveChoice(manager) {

        this.clear();


        this.showTitle(
            "💾 Sauvegarder la carrière"
        );


        this.showMessage(
            "Choisis un emplacement pour cette carrière."
        );


        const saves =
            game.save.getSaveList();


        for (
            let slot = 1;
            slot <= 3;
            slot++
        ) {

            const save =
                saves.find(
                    item =>
                        item.slot === slot
                );


            const button =
                document.createElement(
                    "button"
                );


            if (save) {

                const date =
                    new Date(
                        save.date
                    );


                button.textContent =
                    "💾 Slot " +
                    slot +
                    " — " +
                    date.toLocaleString();

            } else {

                button.textContent =
                    "💾 Slot " +
                    slot +
                    " — Vide";

            }


            button.addEventListener(
                "click",
                () => {

                    if (save) {

                        const confirmed =
                            confirm(

                                "⚠️ Le slot " +
                                slot +
                                " contient déjà une carrière.\n\n" +
                                "Veux-tu la remplacer ?"

                            );


                        if (!confirmed) {

                            return;

                        }

                    }


                    const success =
                        saveCareer(
                            slot
                        );


                    if (success) {

                        game.currentSaveSlot =
                            slot;


                        alert(
                            "✅ Carrière sauvegardée dans le slot " +
                            slot +
                            " !"
                        );


                        this.showManager(
                            manager
                        );

                    }

                }
            );


            this.container.appendChild(
                button
            );

        }


        this.createButton(

            "⬅️ Retour",

            () => {

                this.showManager(
                    manager
                );

            }

        );

    }



    /* ================================================= */
    /* MENU SAUVEGARDES CARRIÈRE EXISTANT */
    /* ================================================= */

    showSaveMenu(manager) {

        this.clear();


        this.showTitle(
            "💾 Sauvegardes"
        );


        this.showMessage(
            "Choisis un emplacement de sauvegarde."
        );


        for (
            let slot = 1;
            slot <= 3;
            slot++
        ) {

            this.createSaveSlot(
                slot,
                manager
            );

        }


        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.showManager(
                    manager
                );

            }

        );

    }



    /* ================================================= */
    /* CRÉATION D'UN SLOT */
    /* ================================================= */

    createSaveSlot(
        slot,
        manager
    ) {

        const saves =
            game.save.getSaveList();


        const save =
            saves.find(
                item =>
                    item.slot === slot
            );


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "save-slot";


        box.style.margin =
            "15px 0";


        box.style.padding =
            "10px";


        box.style.border =
            "1px solid #ccc";


        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            "💾 Slot " +
            slot;


        box.appendChild(
            title
        );


        const info =
            document.createElement(
                "p"
            );


        if (save) {

            const date =
                new Date(
                    save.date
                );


            info.textContent =
                "📅 " +
                date.toLocaleString();

        } else {

            info.textContent =
                "🟢 Emplacement vide";

        }


        box.appendChild(
            info
        );


        const saveButton =
            document.createElement(
                "button"
            );


        saveButton.textContent =
            "💾 Sauvegarder";


        saveButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    !save ||
                    confirm(
                        "⚠️ Ce slot contient déjà une sauvegarde.\n\n" +
                        "Veux-tu la remplacer ?"
                    );


                if (!confirmed) {

                    return;

                }


                const success =
                    saveCareer(
                        slot
                    );


                if (success) {

                    alert(
                        "✅ Partie sauvegardée dans le slot " +
                        slot +
                        " !"
                    );


                    this.showSaveMenu(
                        manager
                    );

                }

            }
        );


        box.appendChild(
            saveButton
        );


        const loadButton =
            document.createElement(
                "button"
            );


        loadButton.textContent =
            "📂 Charger";


        loadButton.disabled =
            !save;


        loadButton.addEventListener(
            "click",
            () => {

                if (!save) {

                    return;

                }


                const confirmed =
                    confirm(
                        "📂 Charger la sauvegarde du slot " +
                        slot +
                        " ?\n\n" +
                        "La carrière actuelle sera remplacée."
                    );


                if (!confirmed) {

                    return;

                }


                loadCareer(
                    slot
                );

            }
        );


        box.appendChild(
            loadButton
        );


        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.textContent =
            "🗑️ Supprimer";


        deleteButton.disabled =
            !save;


        deleteButton.addEventListener(
            "click",
            () => {

                if (!save) {

                    return;

                }


                const confirmed =
                    confirm(
                        "⚠️ Supprimer définitivement la sauvegarde du slot " +
                        slot +
                        " ?"
                    );


                if (!confirmed) {

                    return;

                }


                deleteCareer(
                    slot
                );


                this.showSaveMenu(
                    manager
                );

            }
        );


        box.appendChild(
            deleteButton
        );


        this.container.appendChild(
            box
        );

    }



    /* ================================================= */
    /* EFFECTIF */
    /* ================================================= */

    showPlayers(squad) {

        this.clear();


        this.showTitle(
            "👥 Effectif"
        );


        squad.players.forEach(
            player => {

                this.showMessage(

                    player.getFullName()
                    +
                    " - "
                    +
                    player.position
                    +
                    " - "
                    +
                    player.overall

                );

            }
        );

    }



    /* ================================================= */
    /* CHOIX LIGUE */
    /* ================================================= */

    showLeagueSelection(dataManager) {

        this.clear();


        this.showTitle(
            "🏆 Choisir une ligue"
        );


        const leagues =
            dataManager.getLeagues();


        leagues.forEach(
            league => {

                this.createButton(

                    this.flags[league]
                    +
                    " "
                    +
                    league,

                    () => {

                        this.showClubSelection(
                            dataManager,
                            league
                        );

                    }

                );

            }
        );

    }



    /* ================================================= */
    /* CHOIX CLUB */
    /* ================================================= */

    showClubSelection(
        dataManager,
        league
    ) {

        this.clear();


        this.showTitle(
            "🏟️ " +
            league
        );


        const clubs =
            dataManager.getClubsByLeague(
                league
            );


        clubs.forEach(
            club => {

                this.createButton(

                    "🏟️ " +
                    club.nom,

                    () => {

                        this.showClubDetails(

                            club,

                            dataManager,

                            league

                        );

                    }

                );

            }
        );

    }



    /* ================================================= */
    /* DÉTAIL CLUB */
    /* ================================================= */

    showClubDetails(
        club,
        dataManager,
        league
    ) {

        this.clear();


        this.showTitle(
            "🏟️ " +
            club.nom
        );


        this.showMessage(
            "⭐ Niveau : " +
            club.niveau
        );


        this.showMessage(
            "💰 Budget : " +
            club.budget.toLocaleString()
            +
            " €"
        );


        this.createButton(

            "✅ Choisir ce club",

            () => {

                chooseClub(
                    club
                );

            }

        );


        this.createButton(

            "⬅️ Retour",

            () => {

                this.showClubSelection(

                    dataManager,

                    league

                );

            }

        );

    }

}
