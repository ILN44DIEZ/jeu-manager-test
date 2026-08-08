class TacticsUI {

    constructor(ui) {

        this.ui = ui;

        this.container = ui.container;

    }



    clear() {

        this.container.innerHTML = "";

    }



    show(tactics, manager) {

        this.clear();


        this.ui.showTitle(
            "🧠 Tactiques"
        );


        this.ui.showMessage(
            "📐 Formation : " +
            tactics.getFormation()
        );


        this.ui.showMessage(
            "⚙️ Style : " +
            tactics.getCurrentTactic()
        );


        this.drawPitch(
            tactics,
            manager
        );


        this.drawFormationList(
            tactics,
            manager
        );


        this.drawTacticsList(
            tactics,
            manager
        );


        this.ui.createButton(

            "⬅️ Retour carrière",

            () => {

                this.ui.showManager(
                    manager
                );

            }

        );

    }



    drawPitch(tactics, manager) {

        const formation =
            tactics.getFormationData();


        if (!formation) {

            this.ui.showMessage(
                "❌ Formation introuvable."
            );

            return;

        }


        const pitch =
            document.createElement("div");


        pitch.className =
            "pitch";


        /*
         * Récupération de l'effectif
         */

        const players =
            game.players || [];


        /*
         * Copie de l'effectif pour éviter
         * d'utiliser deux fois le même joueur
         */

        const availablePlayers =
            [...players];


        /*
         * Création des 11 positions
         */

        formation.postes.forEach(poste => {

            const player =
                document.createElement("div");


            player.className =
                "pitch-player";


            /*
             * Recherche d'un joueur
             * correspondant au poste
             */

            let index =
                availablePlayers.findIndex(

                    joueur =>
                        joueur.poste === poste.poste

                );


            /*
             * Si aucun joueur ne correspond
             * exactement au poste, on prend
             * simplement le premier disponible.
             */

            if (index === -1) {

                index = 0;

            }


            let selectedPlayer = null;


            if (
                availablePlayers.length > 0 &&
                index >= 0
            ) {

                selectedPlayer =
                    availablePlayers[index];


                availablePlayers.splice(
                    index,
                    1
                );

            }


            /*
             * Affichage du joueur
             */

            if (selectedPlayer) {

                player.innerHTML = `

                    <strong>
                        ${selectedPlayer.prenom}
                    </strong>

                    <br>

                    <span>
                        ${selectedPlayer.nom}
                    </span>

                    <br>

                    <small>
                        ${selectedPlayer.poste}
                        ⭐
                        ${selectedPlayer.note}
                    </small>

                `;

            } else {

                player.innerHTML = `

                    <strong>
                        ${poste.poste}
                    </strong>

                    <br>

                    <small>
                        Aucun joueur
                    </small>

                `;

            }


            /*
             * Position sur le terrain
             */

            player.style.left =
                poste.x + "%";


            player.style.top =
                poste.y + "%";


            /*
             * Centrage du joueur
             */

            player.style.transform =
                "translate(-50%, -50%)";


            pitch.appendChild(
                player
            );

        });


        this.container.appendChild(
            pitch
        );

    }



    drawFormationList(
        tactics,
        manager
    ) {

        this.ui.showTitle(
            "📐 Formations"
        );


        tactics
            .getAvailableFormations()
            .forEach(formation => {

                this.ui.createButton(

                    formation.nom,

                    () => {

                        const changed =
                            tactics.setFormation(
                                formation.nom
                            );


                        if (changed) {

                            this.show(
                                tactics,
                                manager
                            );

                        }

                    }

                );

            });

    }



    drawTacticsList(
        tactics,
        manager
    ) {

        this.ui.showTitle(
            "⚙️ Styles tactiques"
        );


        tactics
            .getAvailableTactics()
            .forEach(style => {

                this.ui.createButton(

                    style.nom,

                    () => {

                        const changed =
                            tactics.setTactic(
                                style.nom
                            );


                        if (changed) {

                            this.show(
                                tactics,
                                manager
                            );

                        }

                    }

                );

            });

    }

}

}
