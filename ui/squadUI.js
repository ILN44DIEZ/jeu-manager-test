class SquadUI {

    constructor(ui) {

        this.ui = ui;

        this.container = ui.container;

    }



    clear() {

        this.container.innerHTML = "";

    }



    showClubPlayers(players, manager) {

        this.clear();


        this.ui.showTitle(
            "👥 Effectif " +
            manager.clubName
        );


        if (players.length === 0) {

            this.ui.showMessage(
                "Aucun joueur trouvé."
            );

        }


        players.forEach(player => {

            this.showPlayerCard(player);

        });


        this.ui.createButton(

            "⬅️ Retour carrière",

            () => {

                this.ui.showManager(manager);

            }

        );

    }



    showPlayerCard(player) {

        const card =
            document.createElement("div");


        card.className =
            "player-card";


        card.style.border =
            "1px solid #ccc";

        card.style.borderRadius =
            "10px";

        card.style.padding =
            "12px";

        card.style.margin =
            "10px 0";

        card.style.cursor =
            "pointer";


        card.innerHTML = `

            <strong>${player.prenom} ${player.nom}</strong><br>

            ${player.poste} • ⭐ ${player.note}<br>

            🎂 ${player.age} ans<br>

            💶 ${player.valeur.toLocaleString()} €

        `;


        card.addEventListener(

            "click",

            () => {

                this.showPlayerProfile(player);

            }

        );


        this.container.appendChild(card);

    }



    showPlayerProfile(player) {

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
            (player.blessure ? "Oui" : "Non")
        );


        this.ui.createButton(

            "⬅️ Retour",

            () => {

                this.showClubPlayers(
                    game.players,
                    game.manager.getManagerData()
                );

            }

        );

    }

}