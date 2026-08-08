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
            "⚽ Titulaires : " +
            tactics.lineup.length +
            " / 11"
        );


        this.ui.showMessage(
            "🪑 Remplaçants : " +
            tactics.substitutes.length +
            " / 9"
        );


        this.assignPositions(
            tactics
        );


        this.drawPitch(
            tactics,
            manager
        );


        this.drawSubstitutes(
            tactics,
            manager
        );


        this.drawReserves(
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


    assignPositions(tactics) {

        const formation =
            tactics.getFormationData();


        if (!formation) {

            return;

        }


        tactics.lineup.forEach(
            (player, index) => {

                const currentPosition =
                    tactics.getPosition(
                        player.id
                    );


                if (
                    currentPosition &&
                    currentPosition !== "Libre"
                ) {

                    return;

                }


                const poste =
                    formation.postes[index];


                if (!poste) {

                    return;

                }


                tactics.setPosition(
                    player.id,
                    poste.poste
                );

            }
        );

    }


    drawPitch(
        tactics,
        manager
    ) {

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


        formation.postes.forEach(
            poste => {

                const player =
                    document.createElement(
                        "div"
                    );


                player.className =
                    "pitch-player";


                const selectedPlayer =
                    tactics.lineup.find(
                        joueur =>
                            tactics.getPosition(
                                joueur.id
                            ) === poste.poste
                    );


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


                    player.addEventListener(
                        "click",
                        () => {

                            console.log(
                                "❌ Titulaire retiré :",
                                selectedPlayer.nom
                            );


                            tactics.removeStarter(
                                selectedPlayer.id
                            );


                            this.show(
                                tactics,
                                manager
                            );

                        }
                    );

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


    drawSubstitutes(
        tactics,
        manager
    ) {

        this.ui.showTitle(
            "🪑 Remplaçants"
        );


        if (
            tactics.substitutes.length === 0
        ) {

            this.ui.showMessage(
                "Aucun remplaçant."
            );

        }


        tactics.substitutes.forEach(
            player => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "tactics-player-card";


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

                        console.log(
                            "❌ Remplaçant retiré :",
                            player.nom
                        );


                        tactics.removeSubstitute(
                            player.id
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


    drawReserves(tactics) {

        const players =
            game.players || [];


        const reserves =
            players.filter(
                player => {

                    const isStarter =
                        tactics.lineup.some(
                            starter =>
                                starter.id ===
                                player.id
                        );


                    const isSubstitute =
                        tactics.substitutes.some(
                            substitute =>
                                substitute.id ===
                                player.id
                        );


                    return (
                        !isStarter &&
                        !isSubstitute
                    );

                }
            );


        if (reserves.length === 0) {

            return;

        }


        this.ui.showTitle(
            "📋 Réservistes"
        );


        reserves.forEach(
            player => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "tactics-player-card";


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


                this.container.appendChild(
                    card
                );

            }
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


        players.forEach(
            player => {

                const isStarter =
                    tactics.lineup.some(
                        starter =>
                            starter.id ===
                            player.id
                    );


                const isSubstitute =
                    tactics.substitutes.some(
                        substitute =>
                            substitute.id ===
                            player.id
                    );


                if (
                    isStarter ||
                    isSubstitute
                ) {

                    return;

                }


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "tactics-player-card";


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

                        if (
                            tactics.lineup.length < 11
                        ) {

                            tactics.addStarter(
                                player
                            );


                            console.log(
                                "✅ Titulaire ajouté :",
                                player.nom
                            );

                        } else if (
                            tactics.substitutes.length < 9
                        ) {

                            tactics.addSubstitute(
                                player
                            );


                            console.log(
                                "🪑 Remplaçant ajouté :",
                                player.nom
                            );

                        } else {

                            console.log(
                                "⚠️ Titulaires et remplaçants complets."
                            );

                        }


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
