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


        this.playerUI =
            new PlayerUI(this);


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

        // Tous les boutons de retour restent au même endroit :
        // en haut à gauche, comme dans le marché des transferts.
        if (/retour|←|⬅️/i.test(text)) {

            button.type = "button";
            button.style.width = "auto";
            button.style.display = "block";
            button.style.padding = "6px 10px";
            button.style.fontSize = "13px";
            button.style.borderRadius = "8px";
            button.style.margin = "0 auto 12px 0";
            button.style.textAlign = "left";

            this.container.insertBefore(
                button,
                this.container.firstChild
            );

        } else {

            this.container.appendChild(
                button
            );

        }


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

                game.currentSaveSlot =
                    null;

                game.club =
                    null;

                game.currentMatchday =
                    0;

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


        const save =
            game.save.loadGame(
                slot
            );


        if (
            save &&
            save.game
        ) {

            const gameData =
                save.game;


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
                        "📂 Charger la carrière du slot " +
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


            img.width =
                120;


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
            manager.budget.toLocaleString() +
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


        /* ================================================= */
        /* PROCHAIN MATCH */
        /* ================================================= */

        this.createButton(

            "▶️ Jouer le prochain match",

            () => {

                this.playNextMatch();

            }

        );


        /* ================================================= */
        /* EFFECTIF */
        /* ================================================= */

        this.createButton(

            "👥 Effectif",

            () => {

                this.squadUI.showClubPlayers(

                    game.players,

                    manager

                );

            }

        );


        /* ================================================= */
        /* TRANSFERTS */
        /* ================================================= */

        this.createButton(
            "💰 Marché des transferts",
            () => this.showTransferMarket(manager)
        );


        /* ================================================= */
        /* TACTIQUES */
        /* ================================================= */

        this.createButton(

            "🧠 Tactiques",

            () => {

                this.tacticsUI.show(

                    game.tactics,

                    manager

                );

            }

        );


        /* ================================================= */
        /* CHAMPIONNAT */
        /* ================================================= */

        this.createButton(

            "🏆 Championnat",

            () => {

                this.showChampionship();

            }

        );


        /* ================================================= */
        /* CALENDRIER */
        /* ================================================= */

        this.createButton(

            "📅 Calendrier",

            () => {

                this.showCalendar();

            }

        );


        /* ================================================= */
        /* SAUVEGARDER */
        /* ================================================= */

        this.createButton(

            "💾 Sauvegarder",

            () => {

                this.saveCurrentCareer(
                    manager
                );

            }

        );


        /* ================================================= */
        /* RETOUR MENU */
        /* ================================================= */

        this.createButton(

            "🏠 Retour au menu",

            () => {

                this.showMainMenu();

            }

        );

    }



    /* ================================================= */
    /* JOUER LE PROCHAIN MATCH */
    /* ================================================= */

    playNextMatch() {

        if (
            !game.calendar ||
            !game.calendar.matchdays
        ) {

            alert(
                "❌ Calendrier indisponible."
            );

            return;

        }


        if (
            !game.matchEngine
        ) {

            alert(
                "❌ Moteur des matchs indisponible."
            );

            return;

        }


        /* ========================= */
        /* RECHERCHE PROCHAINE JOURNÉE */
        /* ========================= */

        let matchdayIndex =
            -1;


        for (
            let i = 0;
            i < game.calendar.matchdays.length;
            i++
        ) {

            const day =
                game.calendar.matchdays[i];


            if (
                !day.played
            ) {

                matchdayIndex =
                    i;

                break;

            }

        }


        /* ========================= */
        /* FIN DE SAISON */
        /* ========================= */

        if (
            matchdayIndex === -1
        ) {

            this.clear();


            this.showTitle(
                "🏆 Saison terminée"
            );


            this.showMessage(
                "Félicitations ! Tu as terminé la saison."
            );


            this.createButton(

                "📊 Voir le classement",

                () => {

                    this.showStandings();

                }

            );


            this.createButton(

                "📅 Voir le calendrier",

                () => {

                    this.showCalendar();

                }

            );


            this.createButton(

                "⬅️ Retour carrière",

                () => {

                    this.returnToManager();

                }

            );


            return;

        }


        const matchday =
            game.calendar.matchdays[
                matchdayIndex
            ];


        /* ========================= */
        /* SIMULATION */
        /* ========================= */

        const results =
            game.matchEngine.simulateMatchday(
                matchday
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


        /* ========================= */
        /* PROGRESSION */
        /* ========================= */

        game.currentMatchday =
            matchdayIndex + 1;

        // Le calendrier de ligue doit s'ouvrir sur la journée qui vient d'être jouée.
        this.currentLeagueMatchday =
            matchdayIndex;


        /* ========================= */
        /* MATCH DU CLUB */
        /* ========================= */

        const clubResult =
            results.find(
                match =>

                    match.homeTeam ===
                    game.club.name ||

                    match.awayTeam ===
                    game.club.name
            );


        /* ========================= */
        /* AFFICHAGE DU MATCH */
        /* ========================= */

        this.clear();


        this.showTitle(
            "⚽ Journée " +
            matchday.day
        );


        if (
            clubResult
        ) {

            const isHome =
                clubResult.homeTeam ===
                game.club.name;


            /* ========================= */
            /* CONTENEUR DU MATCH */
            /* ========================= */

            const matchBox =
                document.createElement(
                    "div"
                );


            matchBox.style.textAlign =
                "center";


            matchBox.style.margin =
                "25px 0";


            matchBox.style.padding =
                "20px";


            matchBox.style.border =
                "1px solid #ccc";


            matchBox.style.borderRadius =
                "10px";


            /* ========================= */
            /* DOMICILE */
            /* ========================= */

            const homeTitle =
                document.createElement(
                    "h2"
                );


            homeTitle.textContent =
                "🏠 " +
                clubResult.homeTeam;


            homeTitle.style.margin =
                "10px 0";


            matchBox.appendChild(
                homeTitle
            );


            /* ========================= */
            /* SCORE */
            /* ========================= */

            const score =
                document.createElement(
                    "div"
                );


            score.textContent =

                clubResult.homeGoals +
                "  -  " +
                clubResult.awayGoals;


            score.style.fontSize =
                "42px";


            score.style.fontWeight =
                "bold";


            score.style.margin =
                "15px 0";


            matchBox.appendChild(
                score
            );


            /* ========================= */
            /* EXTÉRIEUR */
            /* ========================= */

            const awayTitle =
                document.createElement(
                    "h2"
                );


            awayTitle.textContent =
                "✈️ " +
                clubResult.awayTeam;


            awayTitle.style.margin =
                "10px 0";


            matchBox.appendChild(
                awayTitle
            );


            this.container.appendChild(
                matchBox
            );


            /* ========================= */
            /* RÉSULTAT */
            /* ========================= */

            let resultTitle =
                "";


            if (
                clubResult.homeGoals >
                clubResult.awayGoals
            ) {

                resultTitle =
                    isHome
                        ? "🟢 VICTOIRE"
                        : "🔴 DÉFAITE";

            }

            else if (
                clubResult.homeGoals <
                clubResult.awayGoals
            ) {

                resultTitle =
                    isHome
                        ? "🔴 DÉFAITE"
                        : "🟢 VICTOIRE";

            }

            else {

                resultTitle =
                    "🟡 MATCH NUL";

            }


            const result =
                document.createElement(
                    "h2"
                );


            result.textContent =
                resultTitle;


            result.style.textAlign =
                "center";


            result.style.margin =
                "20px 0";


            this.container.appendChild(
                result
            );


            /* ========================= */
            /* INFORMATIONS */
            /* ========================= */

            this.showMessage(
                "🏟️ " +
                clubResult.homeTeam +
                " contre " +
                clubResult.awayTeam
            );


            this.showMessage(
                "⚽ Score final : " +
                clubResult.homeGoals +
                " - " +
                clubResult.awayGoals
            );


            this.showMessage(
                "📅 Journée " +
                matchday.day
            );


            /* ========================= */
            /* ÉVÉNEMENTS */
            /* ========================= */

            
const eventsTitle =
    document.createElement("h3");

eventsTitle.textContent =
    "📋 Événements du match";

eventsTitle.style.marginTop = "25px";

this.container.appendChild(eventsTitle);


// Récupérer les événements générés par matches.js
const events =
    Array.isArray(clubResult.events)
        ? clubResult.events
        : (
            clubResult.result &&
            Array.isArray(clubResult.result.events)
                ? clubResult.result.events
                : []
        );

if (events.length > 0) {

    events.forEach(event => {

        const eventLine =
            document.createElement("p");

        const minute =
            event.minute != null
                ? event.minute + "'"
                : "";

        const description =
    event.description ||
    (
        event.scorer
            ? "⚽ " + event.scorer
            : "⚽ But"
    );

const equipe =
    event.team
        ? " — " + event.team
        : "";

        eventLine.textContent =
    minute + " " + description + equipe;

        eventLine.style.padding = "8px";
        eventLine.style.margin = "5px 0";
        eventLine.style.borderBottom =
            "1px solid #ddd";

        this.container.appendChild(eventLine);

    });

} else {

    this.showMessage(
        "Aucun détail de but disponible pour ce match."
    );

}

this.showMessage(
    "✅ Match terminé."
);

this.showMessage(
    "📊 Les statistiques détaillées seront ajoutées ultérieurement."
);


        }


        /* ========================= */
        /* JOURNÉE TERMINÉE */
        /* ========================= */

        this.showMessage(
            "✅ Journée " +
            matchday.day +
            " terminée."
        );


        /* ========================= */
        /* VOIR LES AUTRES RÉSULTATS */
        /* ========================= */

        this.createButton(

            "📋 Résultats de la journée",

            () => {

                this.openLatestLeagueMatchday();

            }

        );


        /* ========================= */
        /* CLASSEMENT */
        /* ========================= */

        this.createButton(

            "📊 Voir le classement",

            () => {

                this.showStandings();

            }

        );


        /* ========================= */
        /* CALENDRIER */
        /* ========================= */

        this.createButton(

            "📅 Calendrier de la ligue",

            () => {

                this.openLatestLeagueMatchday();

            }

        );


        /* ========================= */
        /* RETOUR CARRIÈRE */
        /* ========================= */

        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.returnToManager();

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


        this.createButton(

            "📊 Classement",

            () => {

                this.showStandings();

            }

        );


        this.createButton(

            "📅 Calendrier de la ligue",

            () => {

                this.openLatestLeagueMatchday();

            }

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


        const tableElement =
            document.createElement(
                "table"
            );


        tableElement.style.width =
            "100%";


        tableElement.style.borderCollapse =
            "collapse";


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

    team.form.forEach(
        result => {

            const badge =
                document.createElement(
                    "span"
                );


            badge.textContent =
                result;


            badge.style.display =
                "inline-flex";


            badge.style.alignItems =
                "center";


            badge.style.justifyContent =
                "center";


            badge.style.width =
                "24px";


            badge.style.height =
                "24px";


            badge.style.margin =
                "2px";


            badge.style.borderRadius =
                "50%";


            badge.style.fontWeight =
                "bold";


            badge.style.fontSize =
                "12px";


            if (
                result === "V"
            ) {

                badge.style.backgroundColor =
                    "#4CAF50";


                badge.style.color =
                    "white";

            }

            else if (
                result === "N"
            ) {

                badge.style.backgroundColor =
                    "#FFC107";


                badge.style.color =
                    "black";

            }

            else if (
                result === "D"
            ) {

                badge.style.backgroundColor =
                    "#F44336";


                badge.style.color =
                    "white";

            }


            formCell.appendChild(
                badge
            );

        }
    );

}

else {

    formCell.textContent =
        "-";

}

                row.appendChild(
                    formCell
                );


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


        this.createButton(

            "⬅️ Retour championnat",

            () => {

                this.showChampionship();

            }

        );

    }



    /* ================================================= */
    /* OUVRIR LA DERNIÈRE JOURNÉE JOUÉE */
    /* ================================================= */

    openLatestLeagueMatchday() {

        const matchdays =
            game.calendar && Array.isArray(game.calendar.matchdays)
                ? game.calendar.matchdays
                : [];

        // Chercher la dernière journée réellement marquée comme jouée.
        let latestPlayedIndex = -1;

        for (let i = matchdays.length - 1; i >= 0; i--) {
            if (matchdays[i] && matchdays[i].played === true) {
                latestPlayedIndex = i;
                break;
            }
        }

        // Repli pour les anciennes sauvegardes dont le statut "played"
        // n'est pas renseigné correctement.
        if (latestPlayedIndex === -1 && game.currentMatchday > 0) {
            latestPlayedIndex = Math.min(
                game.currentMatchday - 1,
                matchdays.length - 1
            );
        }

        this.currentLeagueMatchday = Math.max(0, latestPlayedIndex);
        this.showLeagueCalendar();

    }



    /* ================================================= */
    /* CALENDRIER DE LA LIGUE */
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


        if (
            this.currentLeagueMatchday < 0
        ) {

            this.currentLeagueMatchday =
                0;

        }


        if (
            this.currentLeagueMatchday >=
            matchdays.length
        ) {

            this.currentLeagueMatchday =
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
        /* STATUT */
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

/* ================================================= */
/* BUTEURS DU MATCH */
/* ================================================= */

if (match.played && match.result) {

    const events = Array.isArray(match.result.events)
        ? match.result.events
        : [];

    const goalEvents = events
        .filter(event => event.type === "goal")
        .sort((a, b) => a.minute - b.minute);

    if (goalEvents.length > 0) {

        const scorersBox = document.createElement("div");

        scorersBox.style.margin = "0 0 15px 0";
        scorersBox.style.padding = "0 10px";

        goalEvents.forEach(event => {

            const scorerLine = document.createElement("p");

            const minute = event.minute != null
                ? event.minute + "' "
                : "";

            const scorer = event.scorer || "Buteur non renseigné";
            const team = event.team || "Équipe inconnue";

            scorerLine.textContent =
                "⚽ " + minute + scorer + " — " + team;

            scorerLine.style.margin = "5px 0";
            scorerLine.style.fontSize = "0.9em";

            scorersBox.appendChild(scorerLine);

        });

        this.container.appendChild(scorersBox);

    }

}


            }
        );

        

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

                    this.returnToManager();

                }

            );


            return;

        }


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

                        let matchText;


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

                        } else {

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


        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.returnToManager();

            }

        );

    }



    /* ================================================= */
    /* RETOUR FICHE MANAGER */
    /* ================================================= */

    returnToManager() {

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

                    player.getFullName() +
                    " - " +
                    player.position +
                    " - " +
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


        this.createButton(
            "← Retour",
            () => this.showMainMenu()
        );


        leagues.forEach(
            league => {

                this.createButton(

                    this.flags[league] +
                    " " +
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
    /* MARCHÉ DES TRANSFERTS */
    /* ================================================= */

    showTransferMarket(manager) {
        this.clear();

        const topBar = document.createElement("div");
        topBar.style.display = "flex";
        topBar.style.alignItems = "center";
        topBar.style.justifyContent = "flex-start";
        topBar.style.margin = "0 0 12px";
        topBar.style.position = "sticky";
        topBar.style.top = "0";
        topBar.style.zIndex = "5";
        topBar.style.padding = "4px 0";
        topBar.style.background = "inherit";

        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.textContent = "← Retour";
        backButton.style.width = "auto";
        backButton.style.padding = "6px 10px";
        backButton.style.fontSize = "13px";
        backButton.style.borderRadius = "8px";
        backButton.style.margin = "0";
        backButton.addEventListener("click", () => this.showManager(manager));
        topBar.appendChild(backButton);
        this.container.appendChild(topBar);

        this.showTitle("💰 Marché des transferts");
        this.showMessage("🏟️ Club : " + manager.clubName);
        this.showMessage("💰 Budget disponible : " + Number(manager.budget || 0).toLocaleString("fr-FR") + " €");

        const clubs = game.data?.clubs || [];
        const leagues = [...new Set(clubs.map(club => club.ligue).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
        const filters = document.createElement("div");
        filters.style.display = "grid";
        filters.style.gap = "10px";
        filters.style.margin = "12px 0";
        this.container.appendChild(filters);

        const leagueLabel = document.createElement("label");
        leagueLabel.textContent = "🏆 Championnat";
        leagueLabel.style.fontWeight = "bold";
        filters.appendChild(leagueLabel);

        const leagueSelect = document.createElement("select");
        leagueSelect.style.width = "100%";
        leagueSelect.style.boxSizing = "border-box";
        leagueSelect.style.padding = "12px";
        leagueSelect.style.borderRadius = "8px";
        const allLeagues = document.createElement("option");
        allLeagues.value = "";
        allLeagues.textContent = "Tous les championnats";
        leagueSelect.appendChild(allLeagues);
        leagues.forEach(league => {
            const option = document.createElement("option");
            option.value = league;
            option.textContent = league;
            leagueSelect.appendChild(option);
        });
        filters.appendChild(leagueSelect);

        const search = document.createElement("input");
        search.type = "search";
        search.placeholder = "🔎 Rechercher un joueur ou un club...";
        search.setAttribute("aria-label", "Rechercher un joueur ou un club");
        search.style.width = "100%";
        search.style.boxSizing = "border-box";
        search.style.padding = "12px";
        search.style.borderRadius = "8px";
        search.style.fontSize = "16px";
        filters.appendChild(search);

        const ageToggle = document.createElement("button");
        ageToggle.type = "button";
        ageToggle.textContent = "🎂 Filtrer par âge ▾";
        ageToggle.style.width = "100%";
        filters.appendChild(ageToggle);

        const agePanel = document.createElement("div");
        agePanel.style.display = "none";
        agePanel.style.padding = "12px";
        agePanel.style.border = "1px solid #555";
        agePanel.style.borderRadius = "8px";
        agePanel.style.gap = "8px";
        filters.appendChild(agePanel);

        let minAge = 15;
        let maxAge = 40;
        const ageValue = document.createElement("strong");
        ageValue.textContent = "Âge : 15–40 ans";
        agePanel.appendChild(ageValue);

        const minLabel = document.createElement("label");
        minLabel.textContent = "Âge minimum : 15 ans";
        agePanel.appendChild(minLabel);
        const minSlider = document.createElement("input");
        minSlider.type = "range";
        minSlider.min = "15";
        minSlider.max = "40";
        minSlider.value = "15";
        minSlider.style.width = "100%";
        agePanel.appendChild(minSlider);

        const maxLabel = document.createElement("label");
        maxLabel.textContent = "Âge maximum : 40 ans";
        agePanel.appendChild(maxLabel);
        const maxSlider = document.createElement("input");
        maxSlider.type = "range";
        maxSlider.min = "15";
        maxSlider.max = "40";
        maxSlider.value = "40";
        maxSlider.style.width = "100%";
        agePanel.appendChild(maxSlider);

        ageToggle.addEventListener("click", () => {
            const isHidden = agePanel.style.display === "none";
            agePanel.style.display = isHidden ? "grid" : "none";
            ageToggle.textContent = isHidden ? "🎂 Filtrer par âge ▴" : "🎂 Filtrer par âge ▾";
        });

        const results = document.createElement("div");
        results.style.display = "grid";
        results.style.gridTemplateColumns = "repeat(auto-fit, minmax(145px, 1fr))";
        results.style.gap = "10px";
        this.container.appendChild(results);

        const render = () => {
            results.innerHTML = "";
            const query = search.value.trim().toLocaleLowerCase("fr");
            const players = (game.data?.players || []).filter(player => {
                const playerClub = String(player.club || "");
                const clubData = clubs.find(club => club.nom === playerClub);
                const playerLeague = clubData?.ligue || "";
                const fullName = [player.prenom || "", player.nom || ""].join(" ");
                const age = Number(player.age) || 0;
                return playerClub !== manager.clubName &&
                    (!leagueSelect.value || playerLeague === leagueSelect.value) &&
                    age >= minAge && age <= maxAge &&
                    [fullName, playerClub, player.poste || "", player.nationalite || ""]
                        .join(" ").toLocaleLowerCase("fr").includes(query);
            });

            const count = document.createElement("p");
            count.style.gridColumn = "1 / -1";
            count.style.color = "#bbb";
            count.textContent = players.length + " joueur" + (players.length > 1 ? "s" : "") + " trouvé" + (players.length > 1 ? "s" : "");
            results.appendChild(count);

            if (!players.length) {
                const empty = document.createElement("p");
                empty.textContent = "Aucun joueur ne correspond à ces filtres.";
                results.appendChild(empty);
                return;
            }

            players.slice(0, 100).forEach(player => {
                const card = document.createElement("div");
                card.style.border = "1px solid #555";
                card.style.borderRadius = "10px";
                card.style.padding = "12px";
                card.style.textAlign = "center";
                card.style.minWidth = "0";

                card.setAttribute("role", "button");
                card.setAttribute("tabindex", "0");
                card.setAttribute("aria-label", "Voir la fiche de " + [player.prenom || "", player.nom || ""].join(" ").trim());
                card.addEventListener("click", () => {
                    this.playerUI.showProfile(
                        player,
                        manager,
                        () => this.showTransferMarket(manager),
                        { hidePotential: true, backLabel: "← Retour au marché" }
                    );
                });
                card.addEventListener("keydown", event => {
                    if (event.target === card && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        this.playerUI.showProfile(
                            player,
                            manager,
                            () => this.showTransferMarket(manager),
                            { hidePotential: true, backLabel: "← Retour au marché" }
                        );
                    }
                });

                const name = document.createElement("strong");
                name.textContent = [player.prenom || "", player.nom || ""].join(" ").trim();
                const details = document.createElement("p");
                details.style.fontSize = "13px";
                details.style.color = "#bbb";
                details.textContent = (player.poste || "Poste inconnu") + " • ⭐ " + (player.note ?? "—") + " • " + (player.age ?? "—") + " ans";
                const club = document.createElement("p");
                club.textContent = "🏟️ " + (player.club || "Club inconnu");
                club.style.fontSize = "13px";
                const valuePrice = Math.max(0, Number(player.valeur) || 0);
                const value = document.createElement("strong");
                value.textContent = "💶 Valeur estimée : " + valuePrice.toLocaleString("fr-FR") + " €";

                const negotiate = document.createElement("button");
                negotiate.type = "button";
                negotiate.textContent = "🤝 Négocier avec le club";
                negotiate.style.width = "100%";
                negotiate.style.padding = "10px";
                negotiate.style.marginTop = "10px";
                negotiate.style.borderRadius = "8px";

                const negotiationBox = document.createElement("div");
                negotiationBox.style.display = "none";
                negotiationBox.style.marginTop = "10px";
                negotiationBox.style.textAlign = "left";

                let negotiationRound = 0;
                let negotiationClosed = false;
                const overall = Math.max(1, Math.min(99, Number(player.note) || 70));
                const offerLabel = document.createElement("label");
                offerLabel.textContent = "Ton offre (€)";
                offerLabel.style.display = "block";
                const offerInput = document.createElement("input");
                offerInput.type = "number";
                offerInput.min = "1";
                offerInput.step = "50000";
                offerInput.value = Math.round(valuePrice * 0.75);
                offerInput.style.width = "100%";
                offerInput.style.boxSizing = "border-box";
                offerInput.style.padding = "9px";
                offerInput.style.margin = "6px 0";
                const stepLabel = document.createElement("strong");
                stepLabel.textContent = "Étape 1/3 — Première offre";
                stepLabel.style.display = "block";
                const submitOffer = document.createElement("button");
                submitOffer.type = "button";
                submitOffer.textContent = "Envoyer l'offre";
                submitOffer.style.width = "100%";
                const response = document.createElement("p");
                response.style.fontSize = "13px";
                response.style.lineHeight = "1.4";

                negotiate.addEventListener("click", event => {
                    event.stopPropagation();
                    negotiationBox.style.display = negotiationBox.style.display === "none" ? "block" : "none";
                });

                offerInput.addEventListener("click", event => event.stopPropagation());

                submitOffer.addEventListener("click", event => {
                    event.stopPropagation();
                    if (negotiationClosed) return;

                    const offer = Math.floor(Number(offerInput.value));
                    if (!Number.isFinite(offer) || offer <= 0) {
                        response.textContent = "Entre un montant supérieur à 0 €.";
                        return;
                    }
                    if (offer > Number(manager.budget || 0)) {
                        response.textContent = "❌ Cette offre dépasse ton budget actuel.";
                        return;
                    }
                    if (player.club === manager.clubName) {
                        response.textContent = "Ce joueur appartient déjà à ton club.";
                        return;
                    }

                    negotiationRound++;
                    stepLabel.textContent = "Étape " + negotiationRound + "/3 — " +
                        (negotiationRound === 3 ? "Offre finale" : "Négociation en cours");

                    // Les clubs sont plus souples pour les joueurs sous 80 de général.
                    // Les joueurs très cotés peuvent au contraire coûter plus que leur valeur estimée.
                    let acceptanceRatio;
                    if (overall < 70) acceptanceRatio = 0.78;
                    else if (overall < 75) acceptanceRatio = 0.83;
                    else if (overall < 80) acceptanceRatio = 0.90;
                    else if (overall < 85) acceptanceRatio = 1.00;
                    else if (overall < 90) acceptanceRatio = 1.08;
                    else acceptanceRatio = 1.18;

                    const minimumAcceptable = Math.round(valuePrice * acceptanceRatio);
                    if (offer >= minimumAcceptable || (valuePrice === 0 && offer > 0)) {
                        const previousClub = player.club;
                        manager.budget = Number(manager.budget || 0) - offer;
                        if (game.club) game.club.budget = manager.budget;
                        player.club = manager.clubName;
                        if (!Array.isArray(game.players)) game.players = [];
                        if (!game.players.some(existing => existing === player || (existing.prenom === player.prenom && existing.nom === player.nom))) {
                            game.players.push(player);
                        }
                        if (game.tactics && typeof game.tactics.initializeSquad === "function") {
                            game.tactics.initializeSquad(game.players);
                        }
                        negotiationClosed = true;
                        response.textContent = "✅ " + player.club + " accepte " + offer.toLocaleString("fr-FR") + " €. Transfert conclu !";
                        submitOffer.disabled = true;
                        offerInput.disabled = true;
                        negotiate.disabled = true;
                        this.showTransferMarket(manager);
                        this.showMessage("✅ Transfert conclu : " + name.textContent + " rejoint " + manager.clubName + " depuis " + previousClub + " pour " + offer.toLocaleString("fr-FR") + " €.");
                        return;
                    }

                    if (negotiationRound >= 3) {
                        negotiationClosed = true;
                        stepLabel.textContent = "Étape 3/3 — Négociation terminée";
                        response.textContent = "❌ " + player.club + " refuse ton offre finale de " + offer.toLocaleString("fr-FR") + " €. Le club ne souhaite pas aller plus bas.";
                        submitOffer.disabled = true;
                        offerInput.disabled = true;
                        return;
                    }

                    // Contre-offre adaptée à la note générale : les joueurs très cotés sont moins négociables.
                    let counterRatio;
                    if (overall < 70) counterRatio = 0.88;
                    else if (overall < 75) counterRatio = 0.92;
                    else if (overall < 80) counterRatio = 0.97;
                    else if (overall < 85) counterRatio = 1.05;
                    else if (overall < 90) counterRatio = 1.12;
                    else counterRatio = 1.22;

                    const counterOffer = Math.max(offer + 1, Math.ceil((valuePrice * counterRatio) / 100000) * 100000);
                    const clubName = player.club || "Le club";
                    response.textContent = "🤝 " + clubName + " refuse cette offre de " + offer.toLocaleString("fr-FR") +
                        " €, mais fait un effort et propose " + counterOffer.toLocaleString("fr-FR") +
                        " €. Tu as encore " + (3 - negotiationRound) + " étape(s) pour trouver un accord.";
                    offerInput.value = Math.min(counterOffer, Number(manager.budget || 0));
                    if (Number(manager.budget || 0) < counterOffer) {
                        response.textContent += " Attention : cette contre-offre dépasse ton budget.";
                    }
                    submitOffer.textContent = negotiationRound === 2 ? "Envoyer l'offre finale" : "Répondre à la contre-offre";
                });

                negotiationBox.append(stepLabel, offerLabel, offerInput, submitOffer, response);
                card.append(name, details, club, value, negotiate, negotiationBox);
                results.appendChild(card);
            });

            if (players.length > 100) {
                const note = document.createElement("p");
                note.style.gridColumn = "1 / -1";
                note.textContent = "Affichage limité aux 100 premiers résultats. Utilise les filtres pour affiner.";
                results.appendChild(note);
            }
        };

        const updateAge = () => {
            minAge = Math.min(Number(minSlider.value), Number(maxSlider.value));
            maxAge = Math.max(Number(minSlider.value), Number(maxSlider.value));
            minLabel.textContent = "Âge minimum : " + minAge + " ans";
            maxLabel.textContent = "Âge maximum : " + maxAge + " ans";
            ageValue.textContent = "Âge : " + minAge + "–" + maxAge + " ans";
            render();
        };

        leagueSelect.addEventListener("change", render);
        search.addEventListener("input", render);
        minSlider.addEventListener("input", updateAge);
        maxSlider.addEventListener("input", updateAge);
        render();

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
            club.budget.toLocaleString() +
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