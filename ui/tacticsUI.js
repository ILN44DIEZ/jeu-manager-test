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

            return;

        }


        const pitch =
            document.createElement("div");


        pitch.className =
            "pitch";


        formation.postes.forEach(poste => {

            const player =
                document.createElement("div");


            player.className =
                "pitch-player";


            player.textContent =
                poste.poste;


            player.style.left =
                poste.x + "%";


            player.style.top =
                poste.y + "%";


            pitch.appendChild(player);

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

                        tactics.setFormation(
                            formation.nom
                        );


                        this.show(
                            tactics,
                            manager
                        );

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

                        tactics.setTactic(
                            style.nom
                        );


                        this.show(
                            tactics,
                            manager
                        );

                    }

                );

            });

    }

}