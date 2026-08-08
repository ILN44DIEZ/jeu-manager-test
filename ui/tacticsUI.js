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


        this.ui.showMessage(
            "👥 Titulaires : " +
            tactics.lineup.length +
            " / 11"
        );


        this.drawPitch(
            tactics
        );


        this.drawPlayersList(
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
            tactics.lineup;


        formation.postes.forEach(
            (poste, index) => {

                const player =
                    document.createElement("div");


                player.className =
                    "pitch-player";


                const selectedPlayer =
                    players[index];


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

            }
        );


        this.container.appendChild(
            pitch
        );

    }


    drawPlayersList(
        tactics,
        manager
    ) {

        this.ui.showTitle(
            "👥 Joueurs disponibles"
        );


        const players =
            game.players || [];


        if (players.length === 0) {

            this.ui.showMessage(
                "Aucun joueur disponible."
            );

            return;

        }


        players.forEach(
            player => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "tactics-player-card";


                const alreadyStarter =
                    tactics.lineup.some(
                        starter =>
                            starter.id ===
                            player.id
                    );


                if (alreadyStarter) {

                    card.classList.add(
                        "selected"
                    );

                }


                card.innerHTML = `

                    <strong>
                        ${player.prenom}
                        ${player.nom}
                    </strong>

                    <br>

                    <span>
                        ${player.poste}
                    </span>

                    ⭐ ${player.note}

                `;


                card.addEventListener(
                    "click",
                    () => {

                        const alreadySelected =
                            tactics.lineup.some(
                                starter =>
                                    starter.id ===
                                    player.id
                            );


                        if (alreadySelected) {

                            console.log(
                                "⚠️ Joueur déjà titulaire :",
                                player.nom
                            );

                            return;

                        }


                        if (
                            tactics.lineup.length >= 11
                        ) {

                            console.log(
                                "⚠️ Les 11 places sont déjà occupées."
                            );

                            return;

                        }


                        tactics.addStarter(
                            player
                        );


                        console.log(
                            "✅ Joueur ajouté aux titulaires :",
                            player
                        );


                        this.show(
                            tactics,
                            manager
                        );

                    }
                );


                this.container.appendChild(
                    card
                );

            }
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
            .forEach(
                formation => {

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

                }
            );

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
            .forEach(
                style => {

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

                }
            );

    }

}
