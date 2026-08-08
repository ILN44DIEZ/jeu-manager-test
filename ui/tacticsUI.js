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

        this.drawPitch(tactics);

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


    drawPitch(tactics) {

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


        const players =
            game.players || [];


        const availablePlayers =
            [...players];


        formation.postes.forEach(poste => {

            const player =
                document.createElement("div");


            player.className =
                "pitch-player";


            let index =
                availablePlayers.findIndex(

                    joueur =>
                        joueur.poste === poste.poste

                );


            if (index === -1) {

                index = 0;

            }


            let selectedPlayer = null;


            if (
                availablePlayers.length > 0
            ) {

                selectedPlayer =
                    availablePlayers[index];


                availablePlayers.splice(
                    index,
                    1
                );

            }


            if (selectedPlayer) {

                player.innerHTML =

                    "<strong>" +
                    selectedPlayer.nom +
                    "</strong>" +

                    "<br>" +

                    "<small>⭐ " +
                    selectedPlayer.note +
                    "</small>" +

                    "<span class=\"player-position\">" +
                    poste.poste +
                    "</span>";

            } else {

                player.innerHTML =

                    "<strong>" +
                    poste.poste +
                    "</strong>";

            }


            player.style.left =
                poste.x + "%";


            player.style.top =
                poste.y + "%";


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

                        if (
                            tactics.setFormation(
                                formation.nom
                            )
                        ) {

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

                        if (
                            tactics.setTactic(
                                style.nom
                            )
                        ) {

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
