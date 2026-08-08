class TacticsUI {

    constructor(ui) {

        this.ui = ui;

        this.container = ui.container;

        this.pitchElement = null;

        this.draggingElement = null;

        this.draggingPlayer = null;

        this.draggingPoste = null;

        this.dragStartX = 0;

        this.dragStartY = 0;

        this.isDragging = false;

    }


    clear() {

        this.container.innerHTML = "";

        this.pitchElement = null;

        this.draggingElement = null;

        this.draggingPlayer = null;

        this.draggingPoste = null;

        this.isDragging = false;

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


                    player.style.touchAction =
                        "none";


                    this.enableDrag(
                        player,
                        selectedPlayer,
                        poste,
                        formation,
                        tactics,
                        manager
                    );


                    player.addEventListener(
                        "click",
                        () => {

                            if (
                                player.dataset.wasDragged ===
                                "true"
                            ) {

                                player.dataset.wasDragged =
                                    "false";

                                return;

                            }


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
    /* DRAG */
    /* ========================= */

    enableDrag(
        element,
        player,
        originalPoste,
        formation,
        tactics,
        manager
    ) {

        element.dataset.wasDragged =
            "false";


        element.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();


                this.draggingElement =
                    element;


                this.draggingPlayer =
                    player;


                this.draggingPoste =
                    originalPoste;


                this.dragStartX =
                    event.clientX;


                this.dragStartY =
                    event.clientY;


                this.isDragging =
                    false;


                element.dataset.wasDragged =
                    "false";

            }
        );


        element.addEventListener(
            "pointermove",
            event => {

                if (
                    this.draggingElement !==
                    element
                ) {

                    return;

                }


                const distance =
                    Math.sqrt(

                        Math.pow(
                            event.clientX -
                            this.dragStartX,
                            2
                        )

                        +

                        Math.pow(
                            event.clientY -
                            this.dragStartY,
                            2
                        )

                    );


                if (
                    !this.isDragging &&
                    distance > 8
                ) {

                    this.isDragging =
                        true;


                    element.dataset.wasDragged =
                        "true";


                    element.classList.add(
                        "dragging"
                    );

                }


                if (
                    !this.isDragging
                ) {

                    return;

                }


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

                if (
                    this.draggingElement !==
                    element
                ) {

                    return;

                }


                if (
                    !this.isDragging
                ) {

                    this.resetDrag();

                    return;

                }


                this.finishDrag(
                    event,
                    formation,
                    tactics,
                    manager
                );

            }
        );


        element.addEventListener(
            "pointercancel",
            () => {

                if (
                    this.draggingElement !==
                    element
                ) {

                    return;

                }


                this.resetDrag();


                this.show(
                    tactics,
                    manager
                );

            }
        );

    }


    /* ========================= */
    /* FIN DRAG */
    /* ========================= */

    finishDrag(
        event,
        formation,
        tactics,
        manager
    ) {

        const player =
            this.draggingPlayer;


        const oldPoste =
            this.draggingPoste;


        const element =
            this.draggingElement;


        const targetPoste =
            this.findNearestPosition(
                event.clientX,
                event.clientY,
                formation
            );


        if (!targetPoste) {

            this.resetDrag();


            this.show(
                tactics,
                manager
            );

            return;

        }


        const playerKey =
            tactics.getPlayerKey(
                player
            );


        const oldPosition =
            tactics.getPosition(
                playerKey
            );


        const otherPlayer =
            tactics.lineup.find(
                other => {

                    const otherKey =
                        tactics.getPlayerKey(
                            other
                        );


                    if (
                        otherKey ===
                        playerKey
                    ) {

                        return false;

                    }


                    return (
                        tactics.getPosition(
                            otherKey
                        ) ===
                        targetPoste.poste
                    );

                }
            );


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


        if (element) {

            element.classList.remove(
                "dragging"
            );

        }


        this.resetDrag();


        this.show(
            tactics,
            manager
        );

    }


    resetDrag() {

        if (
            this.draggingElement
        ) {

            this.draggingElement.classList.remove(
                "dragging"
            );

        }


        this.draggingElement =
            null;


        this.draggingPlayer =
            null;


        this.draggingPoste =
            null;


        this.isDragging =
            false;

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


        if (
            smallestDistance > 18
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
    /* REMPLACEMENT */
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


                card.addEventListener(
                    "click",
                    () => {

                        this.showSubstituteActions(
                            tactics,
                            manager,
                            player
                        );

                    }
                );


                this.container.appendChild(
                    card
                );

            }
        );

    }


    /* ========================= */
    /* ACTIONS REMPLAÇANT */
    /* ========================= */

    showSubstituteActions(
        tactics,
        manager,
        player
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
                🪑 ${player.prenom}
                ${player.nom}
            </h3>

            <p>
                ⭐ Note :
                ${player.note}
            </p>

        `;


        const removeButton =
            document.createElement(
                "button"
            );


        removeButton.textContent =
            "❌ Retirer du banc";


        removeButton.addEventListener(
            "click",
            () => {

                const key =
                    tactics.getPlayerKey(
                        player
                    );


                tactics.removeSubstitute(
                    key
                );


                console.log(
                    "❌ Remplaçant retiré :",
                    player.nom
                );


                this.show(
                    tactics,
                    manager
                );

            }
        );


        box.appendChild(
            removeButton
        );


        const moveReserveButton =
            document.createElement(
                "button"
            );


        moveReserveButton.textContent =
            "📋 Mettre en réserviste";


        moveReserveButton.addEventListener(
            "click",
            () => {

                const key =
                    tactics.getPlayerKey(
                        player
                    );


                tactics.removeSubstitute(
                    key
                );


                console.log(
                    "📋 Joueur envoyé en réserviste :",
                    player.nom
                );


                this.show(
                    tactics,
                    manager
                );

            }
        );


        box.appendChild(
            moveReserveButton
        );


        this.container.insertBefore(
            box,
            this.container.querySelector(
                ".tactics-player-card"
            )
        );


        box.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /* ========================= */
    /* RÉSERVISTES */
    /* ========================= */

    drawReserves(
        tactics,
        manager
    ) {

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


                card.addEventListener(
                    "click",
                    () => {

                        this.showReserveActions(
                            tactics,
                            manager,
                            player
                        );

                    }
                );


                this.container.appendChild(
                    card
                );

            }
        );

    }


    /* ========================= */
    /* ACTIONS RÉSERVISTE */
    /* ========================= */

    showReserveActions(
        tactics,
        manager,
        player
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
                📋 ${player.prenom}
                ${player.nom}
            </h3>

            <p>
                Poste :
                ${player.poste}
            </p>

            <p>
                ⭐ Note :
                ${player.note}
            </p>

        `;


        if (
            tactics.substitutes.length < 9
        ) {

            const substituteButton =
                document.createElement(
                    "button"
                );


            substituteButton.textContent =
                "🪑 Mettre remplaçant";


            substituteButton.addEventListener(
                "click",
                () => {

                    if (
                        tactics.addSubstitute(
                            player
                        )
                    ) {

                        console.log(
                            "🪑 Réserviste → remplaçant :",
                            player.nom
                        );


                        this.show(
                            tactics,
                            manager
                        );

                    }

                }
            );


            box.appendChild(
                substituteButton
            );

        }


        this.container.insertBefore(
            box,
            this.container.querySelector(
                ".tactics-player-card"
            )
        );


        box.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

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
