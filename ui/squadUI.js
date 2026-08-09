class SquadUI {

    constructor(ui) {

        this.ui = ui;

        this.container =
            ui.container;

        this.currentManager = null;

    }



    /* ================================================= */
    /* NETTOYAGE */
    /* ================================================= */

    clear() {

        this.container.innerHTML = "";

    }



    /* ================================================= */
    /* AFFICHAGE EFFECTIF */
    /* ================================================= */

    showClubPlayers(players, manager) {

        this.currentManager =
            manager;


        this.clear();


        this.ui.showTitle(
            "👥 Effectif " +
            manager.clubName
        );


        if (
            !players ||
            players.length === 0
        ) {

            this.ui.showMessage(
                "Aucun joueur trouvé."
            );

            return;

        }


        /* ================================================= */
/* CATÉGORIES */
/* ================================================= */

const goalkeepers = [];

const defenders = [];

const midfielders = [];

const attackers = [];

const others = [];


players.forEach(
    player => {

        const position =
            String(
                player.poste || ""
            ).toUpperCase();


        /* ========================= */
        /* GARDIENS */
        /* ========================= */

        if (
            position === "GB" ||
            position === "GK"
        ) {

            goalkeepers.push(
                player
            );

            return;

        }


        /* ========================= */
        /* DÉFENSEURS */
        /* ========================= */

        if (
            position === "DC" ||
            position === "DCD" ||
            position === "DCG" ||
            position === "DD" ||
            position === "DG" ||
            position === "DLD" ||
            position === "DLG" ||
            position === "DDG"
        ) {

            defenders.push(
                player
            );

            return;

        }


        /* ========================= */
        /* MILIEUX */
        /* ========================= */

        if (
            position === "MDC" ||
            position === "MC" ||
            position === "MCD" ||
            position === "MCG" ||
            position === "MD" ||
            position === "MG" ||
            position === "MOC" ||
            position === "MOCD" ||
            position === "MOCG"
        ) {

            midfielders.push(
                player
            );

            return;

        }


        /* ========================= */
        /* ATTAQUANTS */
        /* ========================= */

        if (
            position === "BU" ||
            position === "AC" ||
            position === "AD" ||
            position === "AG" ||
            position === "AT"
        ) {

            attackers.push(
                player
            );

            return;

        }


        /* ========================= */
        /* AUTRES */
        /* ========================= */

        others.push(
            player
        );

    }
);


        /* ================================================= */
        /* AFFICHAGE DES CATÉGORIES */
        /* ================================================= */

        this.showPlayerCategory(
            "🧤 Gardiens",
            goalkeepers
        );


        this.showPlayerCategory(
            "🛡️ Défenseurs",
            defenders
        );


        this.showPlayerCategory(
            "⚙️ Milieux",
            midfielders
        );


        this.showPlayerCategory(
            "⚡ Attaquants",
            attackers
        );


        if (
            others.length > 0
        ) {

            this.showPlayerCategory(
                "👤 Autres",
                others
            );

        }


        /* ================================================= */
        /* RETOUR */
        /* ================================================= */

        this.ui.createButton(

            "⬅️ Retour carrière",

            () => {

                this.ui.showManager(
                    manager
                );

            }

        );

    }



    /* ================================================= */
    /* CATÉGORIE DE JOUEURS */
    /* ================================================= */

    showPlayerCategory(
        title,
        players
    ) {

        if (
            players.length === 0
        ) {

            return;

        }


        this.ui.showTitle(
            title
        );


        /* ================================================= */
        /* GRILLE */
        /* ================================================= */

        const grid =
            document.createElement(
                "div"
            );


        grid.className =
            "players-grid";


        grid.style.display =
            "grid";


        grid.style.gridTemplateColumns =
            "repeat(4, minmax(0, 1fr))";


        grid.style.gap =
            "10px";


        grid.style.width =
            "100%";


        grid.style.boxSizing =
            "border-box";


        players.forEach(
            player => {

                const card =
                    this.createPlayerCard(
                        player
                    );


                grid.appendChild(
                    card
                );

            }
        );


        this.container.appendChild(
            grid
        );

    }



    /* ================================================= */
    /* CARTE JOUEUR */
    /* ================================================= */

    createPlayerCard(player) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "player-card";


        card.style.border =
            "1px solid #ccc";


        card.style.borderRadius =
            "10px";


        card.style.padding =
            "10px";


        card.style.margin =
            "0";


        card.style.cursor =
            "pointer";


        card.style.textAlign =
            "center";


        card.style.boxSizing =
            "border-box";


        card.style.minWidth =
            "0";


        card.style.transition =
            "transform 0.15s";


        /* ================================================= */
        /* CONTENU */
        /* ================================================= */

        card.innerHTML = `

            <strong>
                ${player.prenom}
                ${player.nom}
            </strong>

            <br>

            ${player.poste}
            • ⭐ ${player.note}

            <br>

            🎂 ${player.age} ans

            <br>

            💶 ${player.valeur.toLocaleString()} €

        `;


        /* ================================================= */
        /* EFFET SOURIS */
        /* ================================================= */

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                    "scale(1.02)";

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "scale(1)";

            }
        );


        /* ================================================= */
        /* CLIC */
        /* ================================================= */

        card.addEventListener(

            "click",

            () => {

                this.showPlayerProfile(

                    player,

                    this.currentManager

                );

            }

        );


        return card;

    }



    /* ================================================= */
    /* FICHE JOUEUR */
    /* ================================================= */

    showPlayerProfile(
        player,
        manager
    ) {

        this.clear();


        this.ui.showTitle(
            player.prenom +
            " " +
            player.nom
        );


        this.ui.showMessage(
            "🌍 Nationalité : " +
            player.nationalite
        );


        this.ui.showMessage(
            "📍 Poste : " +
            player.poste
        );


        this.ui.showMessage(
            "⭐ Note : " +
            player.note
        );


        this.ui.showMessage(
            "📈 Potentiel : " +
            player.potentiel
        );


        this.ui.showMessage(
            "🎂 Âge : " +
            player.age +
            " ans"
        );


        this.ui.showMessage(
            "📏 Taille : " +
            player.taille +
            " cm"
        );


        this.ui.showMessage(
            "⚖️ Poids : " +
            player.poids +
            " kg"
        );


        this.ui.showMessage(
            "👟 Pied : " +
            player.pied
        );


        this.ui.showMessage(
            "🔢 Numéro : " +
            player.numero
        );


        this.ui.showMessage(
            "💶 Valeur : " +
            player.valeur.toLocaleString() +
            " €"
        );


        this.ui.showMessage(
            "💰 Salaire : " +
            player.salaire.toLocaleString() +
            " €"
        );


        this.ui.showMessage(
            "📄 Contrat : " +
            player.contratFin
        );


        this.ui.showMessage(
            "😊 Forme : " +
            player.forme
        );


        this.ui.showMessage(
            "💪 Moral : " +
            player.moral
        );


        this.ui.showMessage(
            "😴 Fatigue : " +
            player.fatigue
        );


        this.ui.showMessage(
            "🏥 Blessure : " +
            (
                player.blessure
                    ? "Oui"
                    : "Non"
            )
        );


        /* ================================================= */
        /* RETOUR */
        /* ================================================= */

        this.ui.createButton(

            "⬅️ Retour",

            () => {

                this.showClubPlayers(

                    game.players,

                    manager

                );

            }

        );

    }

}
