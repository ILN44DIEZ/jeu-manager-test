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
            "⚙️ Style de jeu : " +
            tactics.getCurrentTactic()
        );



        const formation =
            tactics.getFormationData();



        if (formation) {

            this.ui.showTitle(
                "👕 Composition"
            );



            formation.postes.forEach(poste => {

                this.createPositionButton(
                    poste,
                    tactics
                );

            });

        }



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



        this.ui.createButton(

            "⬅️ Retour carrière",

            () => {

                this.ui.showManager(
                    manager
                );

            }

        );

    }



    createPositionButton(poste, tactics) {

        this.ui.createButton(

            poste.poste,

            () => {

                console.log(

                    "Poste :",

                    poste.poste,

                    poste.x,

                    poste.y

                );

            }

        );

    }

}