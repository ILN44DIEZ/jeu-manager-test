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


        this.currentLeagueMatchday =
            0;

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


        h2.textContent =
            title;


        this.container.appendChild(h2);

    }



    showMessage(message) {

        const p =
            document.createElement("p");


        p.textContent =
            message;


        this.container.appendChild(p);

    }



    createButton(text, action) {

        const button =
            document.createElement("button");


        button.textContent =
            text;


        button.addEventListener(
            "click",
            action
        );


        this.container.appendChild(
            button
        );


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

                game.currentMatchday = 0;

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


        const saveInfo =
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

        if (!saveInfo) {

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
        /* CHARGEMENT COMPLET */
        /* ========================= */

        const save =
            game.save.loadGame(
                slot
            );


        /* ========================= */
        /* DONNÉES DE LA CARRIÈRE */
        /* ========================= */

        if (
            save &&
            save.game
        ) {

            const gameData =
                save.game;


            /* ========================= */
            /* CLUB */
            /* ========================= */

            if (
                gameData.club &&
                gameData.club.name
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

        }


        /* ========================= */
        /* DATE DE SAUVEGARDE */
        /* ========================= */

        const date =
            new Date(
                saveInfo.date
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


            img.style.display =
                "block";


            img.style.margin =
                "auto";


            this.container.appendChild(
                img
            );

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
        /* CHAMPIONNAT */
        /* ========================= */

        this.createButton(

            "🏆 Championnat",

            () => {

                this.showChampionship();

            }

        );


        /* ========================= */
        /* CALENDRIER DU CLUB */
        /* ========================= */

        this.createButton(

            "📅 Calendrier",

            () => {

                this.showCalendar();

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
        /* RETOUR MENU */
        /* ========================= */

        this.createButton(

            "🏠 Retour au menu",

            () => {

                this.showMainMenu();

            }

        );

    }



    /* ================================================= */
    /* MENU CHAMPIONNAT */
    /* ================================================= */

    showChampionship() {

        this.clear();


        this.showTitle(
            "🏆 Championnat"
        );


        /* ========================= */
        /* CLASSEMENT */
        /* ========================= */

        this.createButton(

            "📊 Classement",

            () => {

                this.showStandings();

            }

        );


        /* ========================= */
        /* CALENDRIER DE LA LIGUE */
        /* ========================= */

        this.createButton(

            "📅 Calendrier de la ligue",

            () => {

                this.currentLeagueMatchday =
                    0;

                this.showLeagueCalendar();

            }

        );


        /* ========================= */
        /* RETOUR */
        /* ========================= */

        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.showManager({

                    managerName:
                        game.manager.managerName,

                    clubName:
                        game.club.name,

                    logo:
                        game.club.logo,

                    budget:
                        game.manager.budget,

                    country:
                        game.club.country,

                    league:
                        game.club.league,

                    level:
                        game.club.level,

                    reputation:
                        game.manager.reputation,

                    season:
                        game.manager.season,

                    objectives:
                        game.manager.objectives

                });

            }

        );

    }



    /* ================================================= */
    /* CLASSEMENT */
    /* ================================================= */

    showStandings() {

        this.clear();


        this.showTitle(
            "📊 Classement"
        );


        if (
            !game.standings
        ) {

            this.showMessage(
                "❌ Classement indisponible."
            );


            this.createButton(

                "⬅️ Retour championnat",

                () => {

                    this.showChampionship();

                }

            );


            return;

        }


        const table =
            game.standings.getTable();


        /* ========================= */
        /* TABLE */
        /* ========================= */

        const tableElement =
            document.createElement(
                "table"
            );


        tableElement.style.width =
            "100%";


        tableElement.style.borderCollapse =
            "collapse";


        /* ========================= */
        /* EN-TÊTE */
        /* ========================= */

        const header =
            document.createElement(
                "tr"
            );


        const headers = [

            "Pos",
            "Club",
            "MJ",
            "V",
            "N",
            "D",
            "BP",
            "BC",
            "Diff",
            "Pts",
            "Forme"

        ];


        headers.forEach(
            text => {

                const th =
                    document.createElement(
                        "th"
                    );


                th.textContent =
                    text;


                th.style.border =
                    "1px solid #ccc";


                th.style.padding =
                    "6px";


                header.appendChild(
                    th
                );

            }
        );


        tableElement.appendChild(
            header
        );


        /* ========================= */
        /* ÉQUIPES */
        /* ========================= */

        table.forEach(
            (team, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const values = [

                    index + 1,

                    team.team,

                    team.played,

                    team.wins,

                    team.draws,

                    team.losses,

                    team.goalsFor,

                    team.goalsAgainst,

                    team.goalDifference,

                    team.points

                ];


                values.forEach(
                    value => {

                        const td =
                            document.createElement(
                                "td"
                            );


                        td.textContent =
                            value;


                        td.style.border =
                            "1px solid #ccc";


                        td.style.padding =
                            "6px";


                        td.style.textAlign =
                            "center";


                        row.appendChild(
                            td
                        );

                    }
                );


                /* ========================= */
                /* FORME */
                /* ========================= */

                const formCell =
                    document.createElement(
                        "td"
                    );


                formCell.style.border =
                    "1px solid #ccc";


                formCell.style.padding =
                    "6px";


                formCell.style.textAlign =
                    "center";


                if (
                    team.form &&
                    team.form.length > 0
                ) {

                    formCell.textContent =
                        team.form.join(
                            " "
                        );

                } else {

                    formCell.textContent =
                        "-";

                }


                row.appendChild(
                    formCell
                );


                /* ========================= */
                /* MON CLUB */
                /* ========================= */

                if (
                    game.club &&
                    team.team ===
                    game.club.name
                ) {

                    row.style.fontWeight =
                        "bold";

                }


                tableElement.appendChild(
                    row
                );

            }
        );


        this.container.appendChild(
            tableElement
        );


        /* ========================= */
        /* RETOUR */
        /* ========================= */

        this.createButton(

            "⬅️ Retour championnat",

            () => {

                this.showChampionship();

            }

        );

    }



    /* ================================================= */
    /* CALENDRIER COMPLET DE LA LIGUE */
    /* ================================================= */

    showLeagueCalendar() {

        this.clear();


        this.showTitle(
            "📅 Calendrier de la ligue"
        );


        if (
            !game.calendar ||
            !game.calendar.matchdays ||
            game.calendar.matchdays.length === 0
        ) {

            this.showMessage(
                "❌ Calendrier de la ligue indisponible."
            );


            this.createButton(

                "⬅️ Retour championnat",

                () => {

                    this.showChampionship();

                }

            );


            return;

        }


        const matchdays =
            game.calendar.matchdays;


        /* ========================= */
        /* SÉCURITÉ */
        /* ========================= */

        if (
            game.currentMatchday < 0
        ) {

            game.currentMatchday =
                0;

        }


        if (
            game.currentMatchday >=
            matchdays.length
        ) {

            game.currentMatchday =
                matchdays.length - 1;

        }


        const currentDay =
            matchdays[
                this.currentLeagueMatchday
            ];


        if (!currentDay) {

            this.currentLeagueMatchday =
                0;

            this.showLeagueCalendar();

            return;

        }


        /* ================================================= */
        /* NAVIGATION */
        /* ================================================= */

        const navigation =
            document.createElement(
                "div"
            );


        navigation.style.display =
            "flex";


        navigation.style.justifyContent =
            "center";


        navigation.style.alignItems =
            "center";


        navigation.style.gap =
            "15px";


        navigation.style.margin =
            "15px 0";


        /* ========================= */
        /* PRÉCÉDENTE */
        /* ========================= */

        const previousButton =
            document.createElement(
                "button"
            );


        previousButton.textContent =
            "◀️";


        previousButton.disabled =
            this.currentLeagueMatchday === 0;


        previousButton.addEventListener(
            "click",
            () => {

                if (
                    this.currentLeagueMatchday > 0
                ) {

                    this.currentLeagueMatchday--;

                    this.showLeagueCalendar();

                }

            }
        );


        navigation.appendChild(
            previousButton
        );


        /* ========================= */
        /* JOURNÉE */
        /* ========================= */

        const dayTitle =
            document.createElement(
                "strong"
            );


        dayTitle.textContent =
            "Journée " +
            currentDay.day +
            " / " +
            matchdays.length;


        navigation.appendChild(
            dayTitle
        );


        /* ========================= */
        /* SUIVANTE */
        /* ========================= */

        const nextButton =
            document.createElement(
                "button"
            );


        nextButton.textContent =
            "▶️";


        nextButton.disabled =
            this.currentLeagueMatchday ===
            matchdays.length - 1;


        nextButton.addEventListener(
            "click",
            () => {

                if (
                    this.currentLeagueMatchday <
                    matchdays.length - 1
                ) {

                    this.currentLeagueMatchday++;

                    this.showLeagueCalendar();

                }

            }
        );


        navigation.appendChild(
            nextButton
        );


        this.container.appendChild(
            navigation
        );


        /* ================================================= */
        /* STATUT DE LA JOURNÉE */
        /* ================================================= */

        if (
            currentDay.played
        ) {

            this.showMessage(
                "✅ Journée terminée"
            );

        } else {

            this.showMessage(
                "⏳ Journée à jouer"
            );

        }


        /* ================================================= */
        /* MATCHS */
        /* ================================================= */

        if (
            !currentDay.matches ||
            currentDay.matches.length === 0
        ) {

            this.showMessage(
                "Aucun match pour cette journée."
            );

        }


        currentDay.matches.forEach(
            match => {

                const matchBox =
                    document.createElement(
                        "div"
                    );


                matchBox.style.border =
                    "1px solid #ccc";


                matchBox.style.borderRadius =
                    "8px";


                matchBox.style.padding =
                    "10px";


                matchBox.style.margin =
                    "8px 0";


                matchBox.style.textAlign =
                    "center";


                /* ========================= */
                /* DOMICILE / EXTÉRIEUR */
                /* ========================= */

                let icon = "";


                if (
                    game.club &&
                    match.home ===
                    game.club.name
                ) {

                    icon =
                        "🏠 ";

                } else if (
                    game.club &&
                    match.away ===
                    game.club.name
                ) {

                    icon =
                        "✈️ ";

                }


                /* ========================= */
                /* SCORE */
                /* ========================= */

                if (
                    match.played &&
                    match.result
                ) {

                    matchBox.textContent =

                        icon +

                        match.home +
                        " " +
                        match.result.homeGoals +
                        " - " +
                        match.result.awayGoals +
                        " " +
                        match.away;

                } else {

                    matchBox.textContent =

                        icon +

                        match.home +
                        " - " +
                        match.away;

                }


                /* ========================= */
                /* MON CLUB */
                /* ========================= */

                if (
                    game.club &&
                    (
                        match.home ===
                        game.club.name ||

                        match.away ===
                        game.club.name
                    )
                ) {

                    matchBox.style.fontWeight =
                        "bold";

                }


                this.container.appendChild(
                    matchBox
                );

            }
        );


        /* ================================================= */
        /* BOUTON JOUER LA JOURNÉE */
        /* ================================================= */

        if (
            !currentDay.played
        ) {

            const playButton =
                document.createElement(
                    "button"
                );


            playButton.textContent =
                "▶️ Jouer la journée";


            playButton.addEventListener(
                "click",
                () => {

                    if (
                        !game.matchEngine
                    ) {

                        alert(
                            "❌ Moteur des matchs indisponible."
                        );

                        return;

                    }


                    const results =
                        game.matchEngine.simulateMatchday(
                            currentDay
                        );


                    if (
                        !results ||
                        results.length === 0
                    ) {

                        alert(
                            "❌ Impossible de jouer cette journée."
                        );

                        return;

                    }


                    /*
                     * La journée est maintenant jouée.
                     */

                    currentDay.played =
                        true;


                    /*
                     * On actualise l'écran.
                     */

                    this.showLeagueCalendar();

                }
            );


            this.container.appendChild(
                playButton
            );

        }


        /* ================================================= */
        /* CLASSEMENT */
        /* ================================================= */

        if (
            currentDay.played
        ) {

            this.createButton(

                "📊 Voir le classement",

                () => {

                    this.showStandings();

                }

            );

        }


        /* ================================================= */
        /* RETOUR */
        /* ================================================= */

        this.createButton(

            "⬅️ Retour championnat",

            () => {

                this.showChampionship();

            }

        );

    }



    /* ================================================= */
    /* CALENDRIER DU CLUB */
    /* ================================================= */

    showCalendar() {

        this.clear();


        this.showTitle(
            "📅 Calendrier"
        );


        if (
            !game.calendar ||
            !game.calendar.matchdays
        ) {

            this.showMessage(
                "❌ Calendrier indisponible."
            );


            this.createButton(

                "⬅️ Retour carrière",

                () => {

                    this.showManager({

                        managerName:
                            game.manager.managerName,

                        clubName:
                            game.club.name,

                        logo:
                            game.club.logo,

                        budget:
                            game.manager.budget,

                        country:
                            game.club.country,

                        league:
                            game.club.league,

                        level:
                            game.club.level,

                        reputation:
                            game.manager.reputation,

                        season:
                            game.manager.season,

                        objectives:
                            game.manager.objectives

                    });

                }

            );


            return;

        }


        /* ================================================= */
        /* MATCHS DU CLUB */
        /* ================================================= */

        game.calendar.matchdays.forEach(
            day => {

                const clubMatches =
                    day.matches.filter(
                        match =>

                            match.home ===
                            game.club.name ||

                            match.away ===
                            game.club.name
                    );


                if (
                    clubMatches.length === 0
                ) {

                    return;

                }


                this.showTitle(
                    "Journée " +
                    day.day
                );


                clubMatches.forEach(
                    match => {

                        let matchText = "";


                        /* ========================= */
                        /* DOMICILE */
                        /* ========================= */

                        if (
                            match.home ===
                            game.club.name
                        ) {

                            if (
                                match.played &&
                                match.result
                            ) {

                                matchText =

                                    "🏠 " +

                                    game.club.name +

                                    " " +

                                    match.result.homeGoals +

                                    " - " +

                                    match.result.awayGoals +

                                    " " +

                                    match.away;

                            } else {

                                matchText =

                                    "🏠 " +

                                    game.club.name +

                                    " - " +

                                    match.away;

                            }

                        }


                        /* ========================= */
                        /* EXTÉRIEUR */
                        /* ========================= */

                        else {

                            if (
                                match.played &&
                                match.result
                            ) {

                                matchText =

                                    "✈️ " +

                                    game.club.name +

                                    " " +

                                    match.result.awayGoals +

                                    " - " +

                                    match.result.homeGoals +

                                    " " +

                                    match.home;

                            } else {

                                matchText =

                                    "✈️ " +

                                    game.club.name +

                                    " - " +

                                    match.home;

                            }

                        }


                        this.showMessage(
                            matchText
                        );

                    }
                );

            }
        );


        /* ================================================= */
        /* RETOUR */
        /* ================================================= */

        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.showManager({

                    managerName:
                        game.manager.managerName,

                    clubName:
                        game.club.name,

                    logo:
                        game.club.logo,

                    budget:
                        game.manager.budget,

                    country:
                        game.club.country,

                    league:
                        game.club.league,

                    level:
                        game.club.level,

                    reputation:
                        game.manager.reputation,

                    season:
                        game.manager.season,

                    objectives:
                        game.manager.objectives

                });

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
    /* MENU SAUVEGARDES CARRIÈRE */
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
