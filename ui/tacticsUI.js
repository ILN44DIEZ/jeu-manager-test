class TacticsUI {

    constructor(ui) {

        this.ui = ui;

        this.container = ui.container;

        this.pitchElement = null;

        this.dragData = null;

    }


    clear() {

        this.container.innerHTML = "";

        this.pitchElement = null;

        this.dragData = null;

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


                    /*
                     * Important pour le tactile
                     */

                    player.style.touchAction =
                        "none";


                    /*
                     * Glisser-déposer
                     */

                    this.enableDrag(
                        player,
                        selectedPlayer,
                        poste,
                        formation,
                        tactics,
                        manager
                    );


                    /*
                     * Clic normal
                     */

                    player.addEventListener(
                        "click",
                        event => {

                            if (
                                player.dataset.dragged ===
                                "true"
                            ) {

                                player.dataset.dragged =
                                    "false";

                                return;

                            }


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
    /* DRAG & DROP */
    /* ========================= */

    enableDrag(
        element,
        player,
        originalPoste,
        formation,
        tactics,
        manager
    ) {

        let startX = 0;

        let startY = 0;

        let dragging = false;


        element.addEventListener(
            "pointerdown",
            event => {

                /*
                 * Empêche le comportement
                 * tactile du navigateur.
                 */

                event.preventDefault();


                startX =
                    event.clientX;

                startY =
                    event.clientY;


                dragging = false;


                element.dataset.dragged =
                    "false";


                element.setPointerCapture(
                    event.pointerId
                );

            }
        );


        element.addEventListener(
            "pointermove",
            event => {

                const distance =
                    Math.sqrt(

                        Math.pow(
                            event.clientX -
                            startX,
                            2
                        )

                        +

                        Math.pow(
                            event.clientY -
                            startY,
                            2
                        )

                    );


                /*
                 * On commence le déplacement
                 * après quelques pixels.
                 */

                if (
                    !dragging &&
                    distance > 8
                ) {

                    dragging = true;

                    element.dataset.dragged =
                        "true";


                    element.classList.add(
                        "dragging"
                    );

                }


                if (!dragging) {

                    return;

                }


                /*
                 * Position visuelle
                 * pendant le déplacement.
                 */

                const rect =
                    this.pitchElement.getBoundingClientRect();


                let x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width *
                    100;


                let y =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height *
                    100;


                /*
                 * Empêcher le joueur
                 * de sortir du terrain.
                 */

                x =
                    Math.max(
                        2,
                        Math.min(
                            98,
                            x
                        )
                    );


                y =
                    Math.max(
                        2,
                        Math.min(
                            98,
                            y
                        )
                    );


                element.style.left =
                    x + "%";


                element.style.top =
                    y + "%";


                element.style.transform =
                    "translate(-50%, -50%) scale(1.12)";

            }
        );


        element.addEventListener(
            "pointerup",
            event => {

                if (!dragging) {

                    return;

                }


                dragging = false;


                element.classList.remove(
                    "dragging"
                );


                element.releasePointerCapture(
                    event.pointerId
                );


                /*
                 * Trouver la position
                 * la plus proche.
                 */

                const targetPoste =
                    this.findNearestPosition(
                        event.clientX,
                        event.clientY,
                        formation
                    );


                if (!targetPoste) {

                    this.show(
                        tactics,
                        manager
                    );

                    return;

                }


                /*
                 * Position actuelle
                 */

                const playerKey =
                    tactics.getPlayerKey(
                        player
                    );


                const oldPosition =
                    tactics.getPosition(
                        playerKey
                    );


                /*
                 * Chercher le joueur qui
                 * occupe la nouvelle position.
                 */

                const otherPlayer =
                    tactics.lineup.find(
                        other => {

                            if (
                                tactics.getPlayerKey(
                                    other
                                ) ===
                                playerKey
                            ) {

                                return false;

                            }


                            return (
                                tactics.getPosition(
                                    tactics.getPlayerKey(
                                        other
                                    )
                                ) ===
                                targetPoste.poste
                            );

                        }
                    );


                /*
                 * Si un autre joueur est
                 * déjà sur cette position,
                 * on échange les deux.
                 */

                if (otherPlayer) {

                    const otherKey =
                        tactics.getPlayerKey(
                            otherPlayer
                        );


                    tactics.setPosition(
                        playerKey,
                        targetPoste.poste
                    );


                    tactics.setPosition(
                        otherKey,
                        oldPosition
                    );


                    console.log(
                        "🔄 Positions échangées :",
                        player.nom,
                        "↔",
                        otherPlayer.nom
                    );

                } else {

                    /*
                     * Sinon le joueur prend
                     * simplement la nouvelle position.
                     */

                    tactics.setPosition(
                        playerKey,
                        targetPoste.poste
                    );


                    console.log(
                        "📍 Nouvelle position :",
                        player.nom,
                        "→",
                        targetPoste.poste
                    );

                }


                /*
                 * Redessiner proprement
                 * le terrain.
                 */

                this.show(
                    tactics,
                    manager
                );

            }
        );


        element.addEventListener(
            "pointercancel",
            () => {

                dragging = false;

                element.classList.remove(
                    "dragging"
                );

                this.show(
                    tactics,
                    manager
                );

            }
        );

    }


    /* ========================= */
    /* POSITION LA PLUS PROCHE */
    /* ========================= */

    findNearestPosition(
        clientX,
        clientY,
        formation
    ) {

        if (
            !this.pitchElement
        ) {

            return null;

        }


        const rect =
            this.pitchElement.getBoundingClientRect();


        const x =
            (
                clientX -
                rect.left
            ) /
            rect.width *
            100;


        const y =
            (
                clientY -
                rect.top
            ) /
            rect.height *
            100;


        let nearest =
            null;


        let smallestDistance =
            Infinity;


        formation.postes.forEach(
            poste => {

                const distance =
                    Math.sqrt(

                        Math.pow(
                            x -
                            poste.x,
                            2
                        )

                        +

                        Math.pow(
                            y -
                            poste.y,
                            2
                        )

                    );


                if (
                    distance <
                    smallestDistance
                ) {

                    smallestDistance =
                        distance;

                    nearest =
                        poste;

                }

            }
        );


        /*
         * Il faut être suffisamment
         * proche d'une position.
         */

        if (
            smallestDistance > 15
        ) {

            return null;

        }


        return nearest;

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


        /*
         * Bouton remplacer
         */

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


        /*
         * Bouton retirer
         */

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


        /*
         * Affichage sous le terrain
         */

        if (
            this.pitchElement
        ) {

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


        if (
            this.pitchElement
        ) {

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
    /* REMPLACEMENT */
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


        tactics.lineup[
            starterIndex
        ] =
            substitute;


        tactics.substitutes[
            substituteIndex
        ] =
            starter;


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
