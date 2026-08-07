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


        if (!formation.postes) {

            this.ui.showMessage(
                "❌ Aucun poste trouvé."
            );

            return;

        }


        const pitch =
            document.createElement("div");


        pitch.className =
            "pitch";


        formation.postes.forEach(poste => {

            const joueur =
                document.createElement("div");


            joueur.className =
                "pitch-player";


            joueur.innerText =
                poste.poste;


            joueur.style.left =
                poste.x + "%";


            joueur.style.top =
                poste.y + "%";


            pitch.appendChild(
                joueur
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

        const formations =
            tactics.getAvailableFormations();


        if (
            !formations ||
            formations.length === 0
        ) {

            return;

        }


        this.ui.showTitle(
            "📐 Formations"
        );


        formations.forEach(formation => {

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

        const styles =
            tactics.getAvailableTactics();


        if (
            !styles ||
            styles.length === 0
        ) {

            return;

        }


        this.ui.showTitle(
            "⚙️ Styles tactiques"
        );


        styles.forEach(style => {

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