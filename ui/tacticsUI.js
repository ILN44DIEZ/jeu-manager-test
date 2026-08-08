class TacticsUI {

    constructor(ui) {

        this.ui = ui;

        this.container = ui.container;

        this.pitchElement = null;

    }


    clear() {

        this.container.innerHTML = "";

        this.pitchElement = null;

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


    /* ========================= */
    /* TERRAIN */
    /* ========================= */

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
            document.createElement(
                "div"
            );


        pitch.className =
            "pitch";


        this.pitchElement =
            pitch;


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
                        joueur => {

                            const key =
                                tactics.getPlayerKey(
                                    joueur
                                );


                            return (
                                tactics.getPosition(
                                    key
                                ) ===
                                poste.poste
                            );

                        }
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
                                "👤 Titulaire sélectionné :",
                                selectedPlayer.nom
                            );


                            this.showPlayerActions(
                                tactics,
                                manager,
                                selectedPlayer,
                                poste.poste
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


    /* ========================= */
    /* ACTIONS TITULAIRE */
    /* ========================= */

    showPlayerActions(
        tactics,
        manager,
        player,
        position
    ) {

        const oldActions =
            this.container.querySelector(
                ".player-actions"
            );


        if (oldActions) {

            oldActions.remove();

        }


        const actionBox =
            document.createElement(
                "div"
            );


        actionBox.className =
            "player-actions";


        actionBox.innerHTML = `

            <h3>
                ⚽ ${player.prenom}
                ${player.nom}
            </h3>

            <p>
                📍 Poste :
                ${position}
            </p>

            <p>
                ⭐ Note :
                ${player.note}
            </p>

        `;


        /* ========================= */
        /* BOUTON REMPLACER */
        /* ========================= */

        const replaceButton =
            document.createElement(
                "button"
            );


        replaceButton.textContent =
            "🔄 Remplacer";


        replaceButton.addEventListener(
            "click",
            () => {

                this.showReplacementList(
                    tactics,
                    manager,
                    player,
                    position
                );

            }
        );


        actionBox.appendChild(
            replaceButton
        );


        /* ========================= */
        /* BOUTON RETIRER */
        /* ========================= */

        const removeButton =
            document.createElement(
                "button"
            );


        removeButton.textContent =
            "❌ Retirer des titulaires";


        removeButton.addEventListener(
            "click",
            () => {

                const key =
                    tactics.getPlayerKey(
                        player
                    );


                tactics.removeStarter(
                    key
                );


                console.log(
                    "❌ Titulaire retiré :",
                    player.nom
                );


                this.show(
                    tactics,
                    manager
                );

            }
        );


        actionBox.appendChild(
            removeButton
        );


        /* ========================= */
        /* AFFICHAGE SOUS LE TERRAIN */
        /* ========================= */

        if (this.pitchElement) {

            this.pitchElement.insertAdjacentElement(
                "afterend",
                actionBox
            );

        } else {

            this.container.appendChild(
                actionBox
            );

        }


        actionBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /* ========================= */
    /* LISTE REMPLACEMENT */
    /* ========================= */

    showReplacementList(
        tactics,
        manager,
        starter,
        position
    ) {

        const oldActions =
            this.container.querySelector(
                ".player-actions"
            );


        if (oldActions) {

            oldActions.remove();

        }


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "player-actions";


        box.innerHTML = `

            <h3>
                🔄 Remplacer
            </h3>

            <p>
                ${starter.prenom}
                ${starter.nom}
                →
                Choisir un remplaçant
            </p>

        `;


        if (
            tactics.substitutes.length === 0
        ) {

            box.innerHTML +=
                "<p>Aucun remplaçant disponible.</p>";

        }


        tactics.substitutes.forEach(
            substitute => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =

                    substitute.prenom +
                    " " +
                    substitute.nom +
                    " ⭐ " +
                    substitute.note;


                button.addEventListener(
                    "click",
                    () => {

                        this.replacePlayer(
                            tactics,
                            manager,
                            starter,
                            substitute,
                            position
                        );

                    }
                );


                box.appendChild(
                    button
                );

            }
        );


        const cancelButton =
            document.createElement(
                "button"
            );


        cancelButton.textContent =
            "⬅️ Annuler";


        cancelButton.addEventListener(
            "click",
            () => {

                this.show(
                    tactics,
                    manager
                );

            }
        );


        box.appendChild(
            cancelButton
        );


        if (this.pitchElement) {

            this.pitchElement.insertAdjacentElement(
                "afterend",
                box
            );

        } else {

            this.container.appendChild(
                box
            );

        }


        box.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /* ========================= */
    /* ÉCHANGE TITULAIRE / BANC */
    /* ========================= */

    replacePlayer(
        tactics,
        manager,
        starter,
        substitute,
        position
    ) {

        const starterKey =
            tactics.getPlayerKey(
                starter
            );


        const substituteKey =
            tactics.getPlayerKey(
                substitute
            );


        const starterIndex =
            tactics.lineup.findIndex(
                player =>
                    tactics.getPlayerKey(
                        player
                    ) === starterKey
            );


        const substituteIndex =
            tactics.substitutes.findIndex(
                player =>
                    tactics.getPlayerKey(
                        player
                    ) === substituteKey
            );


        if (
            starterIndex === -1 ||
            substituteIndex === -1
        ) {

            console.error(
                "❌ Impossible de faire le remplacement."
            );

            return;

        }


        /* Nouveau titulaire */

        tactics.lineup[
            starterIndex
        ] =
            substitute;


        /* Ancien titulaire sur le banc */

        tactics.substitutes[
            substituteIndex
        ] =
            starter;


        /* Conserver la position */

        delete tactics.positions[
            starterKey
        ];


        tactics.positions[
            substituteKey
        ] =
            position;


        console.log(
            "🔄 Remplacement effectué :",
            starter.nom,
            "→",
            substitute.nom
        );


        this.show(
            tactics,
            manager
        );

    }


    /* ========================= */
    /* REMPLAÇANTS */
    /* ========================= */

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

            return;

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


                this.container.appendChild(
                    card
                );

            }
        );

    }


    /* ========================= */
    /* RÉSERVISTES */
    /* ========================= */

    drawReserves(tactics) {

        const players =
            game.players || [];


        const reserves =
            players.filter(
                player => {

                    const key =
                        tactics.getPlayerKey(
                            player
                        );


                    const isStarter =
                        tactics.lineup.some(
                            starter =>
                                tactics.getPlayerKey(
                                    starter
                                ) === key
                        );


                    const isSubstitute =
                        tactics.substitutes.some(
                            substitute =>
                                tactics.getPlayerKey(
                                    substitute
                                ) === key
                        );


                    return (
                        !isStarter &&
                        !isSubstitute
                    );

                }
            );


        this.ui.showTitle(
            "📋 Réservistes"
        );


        if (
            reserves.length === 0
        ) {

            this.ui.showMessage(
                "Aucun réserviste."
            );

            return;

        }


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


    /* ========================= */
    /* FORMATIONS */
    /* ========================= */

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


    /* ========================= */
    /* STYLES TACTIQUES */
    /* ========================= */

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
