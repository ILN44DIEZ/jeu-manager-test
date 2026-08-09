class TacticsUI {

    constructor(ui) {

        this.ui = ui;
        this.container = ui.container;
        this.pitchElement = null;

        this.draggingElement = null;
        this.draggingPlayer = null;
        this.draggingType = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.isDragging = false;

    }


    clear() {

        this.container.innerHTML = "";

        this.pitchElement = null;
        this.draggingElement = null;
        this.draggingPlayer = null;
        this.draggingType = null;
        this.isDragging = false;

    }


    show(tactics, manager) {

        this.clear();

        this.ui.showTitle("🧠 Tactiques");

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
                this.ui.showManager(manager);
            }
        );

    }


    /* ================================================= */
    /* TERRAIN */
    /* ================================================= */

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

        pitch.className = "pitch";

        this.pitchElement = pitch;

        formation.postes.forEach(poste => {

            const player =
                document.createElement("div");

            player.className =
                "pitch-player";

            const selectedPlayer =
                tactics.lineup.find(joueur => {

                    const key =
                        tactics.getPlayerKey(joueur);

                    return (
                        tactics.getPosition(key) ===
                        poste.poste
                    );

                });


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
                    "starter",
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


            pitch.appendChild(player);

        });


        this.container.appendChild(pitch);

    }


    /* ================================================= */
    /* DRAG GENERAL */
    /* ================================================= */

    enableDrag(
        element,
        player,
        type,
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

                this.draggingType =
                    type;

                this.dragStartX =
                    event.clientX;

                this.dragStartY =
                    event.clientY;

                this.isDragging =
                    false;

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
                        ) +

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


                if (!this.isDragging) {

                    return;

                }


                if (
                    this.draggingType ===
                    "starter"
                ) {

                    const rect =
                        this.pitchElement
                            .getBoundingClientRect();


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
                            Math.min(98, x)
                        );


                    y =
                        Math.max(
                            2,
                            Math.min(98, y)
                        );


                    element.style.left =
                        x + "%";

                    element.style.top =
                        y + "%";

                    element.style.transform =
                        "translate(-50%, -50%) scale(1.12)";

                }

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


                if (!this.isDragging) {

                    this.resetDrag();

                    return;

                }


                this.finishDrop(
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


    /* ================================================= */
    /* DROP */
    /* ================================================= */

    finishDrop(
        event,
        formation,
        tactics,
        manager
    ) {

        const player =
            this.draggingPlayer;

        const type =
            this.draggingType;


        if (!player) {

            this.resetDrag();

            return;

        }


        const target =
            this.getDropTarget(
                event.clientX,
                event.clientY,
                tactics
            );


        if (!target) {

            this.resetDrag();

            this.show(
                tactics,
                manager
            );

            return;

        }


        console.log(
            "📦 Drop :",
            player.nom,
            "→",
            target.type
        );


        if (
            type === "starter"
        ) {

            this.handleStarterDrop(
                player,
                target,
                formation,
                tactics,
                manager,
                event
            );

        }


        else if (
            type === "substitute"
        ) {

            this.handleSubstituteDrop(
                player,
                target,
                tactics,
                manager
            );

        }


        else if (
            type === "reserve"
        ) {

            this.handleReserveDrop(
                player,
                target,
                tactics,
                manager
            );

        }

    }


    /* ================================================= */
    /* DÉTECTION DE LA ZONE */
    /* ================================================= */

    getDropTarget(
        x,
        y,
        tactics
    ) {

        /*
         * Terrain
         */

        if (
            this.pitchElement
        ) {

            const rect =
                this.pitchElement
                    .getBoundingClientRect();


            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {

                const formation =
                    tactics.getFormationData();


                const poste =
                    this.findNearestPosition(
                        x,
                        y,
                        formation
                    );


                if (poste) {

                    return {

                        type: "pitch",

                        poste: poste

                    };

                }

            }

        }


        /*
         * Remplaçants
         */

        const substitutes =
            document.querySelector(
                ".tactics-substitutes-zone"
            );


        if (substitutes) {

            const rect =
                substitutes
                    .getBoundingClientRect();


            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {

                return {

                    type: "substitutes"

                };

            }

        }


        /*
         * Réservistes
         */

        const reserves =
            document.querySelector(
                ".tactics-reserves-zone"
            );


        if (reserves) {

            const rect =
                reserves
                    .getBoundingClientRect();


            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {

                return {

                    type: "reserves"

                };

            }

        }


        /*
         * Vérification directe
         * des cartes
         */

        const cards =
            document.elementsFromPoint(
                x,
                y
            );


        for (
            const card of cards
        ) {

            if (
                card.classList.contains(
                    "tactics-player-card"
                )
            ) {

                if (
                    card.dataset.playerType ===
                    "substitute"
                ) {

                    return {

                        type: "substitute-player",

                        key:
                            card.dataset.playerKey

                    };

                }


                if (
                    card.dataset.playerType ===
                    "reserve"
                ) {

                    return {

                        type: "reserve-player",

                        key:
                            card.dataset.playerKey

                    };

                }

            }

        }


        return null;

    }


    /* ================================================= */
    /* TITULAIRE DROP */
    /* ================================================= */

    handleStarterDrop(
        player,
        target,
        formation,
        tactics,
        manager
    ) {

        const playerKey =
            tactics.getPlayerKey(
                player
            );


        const oldPosition =
            tactics.getPosition(
                playerKey
            );


        /*
         * Titulaire → terrain
         */

        if (
            target.type ===
            "pitch"
        ) {

            const targetPosition =
                target.poste.poste;


            const otherPlayer =
                tactics.lineup.find(
                    other => {

                        const key =
                            tactics.getPlayerKey(
                                other
                            );

                        if (
                            key ===
                            playerKey
                        ) {

                            return false;

                        }

                        return (
                            tactics.getPosition(key) ===
                            targetPosition
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
                    targetPosition
                );


                tactics.setPosition(
                    otherKey,
                    oldPosition
                );


                console.log(
                    "🔄 Échange :",
                    player.nom,
                    "↔",
                    otherPlayer.nom
                );

            } else {

                tactics.setPosition(
                    playerKey,
                    targetPosition
                );


                console.log(
                    "📍 Nouvelle position :",
                    player.nom,
                    "→",
                    targetPosition
                );

            }

        }


        /*
         * Titulaire → remplaçants
         */

        else if (
            target.type ===
            "substitutes"
        ) {

            if (
                tactics.substitutes.length >= 9
            ) {

                this.showMessageTemporary(
                    "⚠️ Les 9 places de remplaçants sont occupées."
                );

                this.resetDrag();

                return;

            }


            tactics.removeStarter(
                playerKey
            );


            tactics.addSubstitute(
                player
            );


            console.log(
                "🪑 Titulaire → remplaçant :",
                player.nom
            );

        }


        /*
         * Titulaire → réservistes
         */

        else if (
            target.type ===
            "reserves"
        ) {

            tactics.removeStarter(
                playerKey
            );


            console.log(
                "📋 Titulaire → réserviste :",
                player.nom
            );

        }


        /*
         * Titulaire → remplaçant précis
         */

        else if (
            target.type ===
            "substitute-player"
        ) {

            const substitute =
                this.findPlayerByKey(
                    target.key,
                    tactics.substitutes,
                    tactics
                );


            if (substitute) {

                this.replacePlayer(
                    tactics,
                    manager,
                    player,
                    substitute,
                    oldPosition
                );

                return;

            }

        }


        this.resetDrag();

        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* REMPLAÇANT DROP */
    /* ================================================= */

    handleSubstituteDrop(
        player,
        target,
        tactics,
        manager
    ) {

        const playerKey =
            tactics.getPlayerKey(
                player
            );


        /*
         * Remplaçant → terrain
         */

        if (
            target.type ===
            "pitch"
        ) {

            if (
                tactics.lineup.length >= 11
            ) {

                const poste =
                    target.poste.poste;


                const starter =
                    tactics.lineup.find(
                        current => {

                            const key =
                                tactics.getPlayerKey(
                                    current
                                );

                            return (
                                tactics.getPosition(key) ===
                                poste
                            );

                        }
                    );


                if (starter) {

                    this.replacePlayer(
                        tactics,
                        manager,
                        starter,
                        player,
                        poste
                    );

                    return;

                }

            }

        }


        /*
         * Remplaçant → titulaire précis
         */

        if (
            target.type ===
            "starter-player"
        ) {

            this.replacePlayer(
                tactics,
                manager,
                target.player,
                player,
                target.position
            );

            return;

        }


        /*
         * Remplaçant → réserviste
         */

        if (
            target.type ===
            "reserves"
        ) {

            tactics.removeSubstitute(
                playerKey
            );


            console.log(
                "📋 Remplaçant → réserviste :",
                player.nom
            );

        }


        this.resetDrag();

        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* RÉSERVISTE DROP */
    /* ================================================= */

    handleReserveDrop(
        player,
        target,
        tactics,
        manager
    ) {

        const playerKey =
            tactics.getPlayerKey(
                player
            );


        /*
         * Réserviste → remplaçants
         */

        if (
            target.type ===
            "substitutes"
        ) {

            if (
                tactics.substitutes.length >= 9
            ) {

                this.showMessageTemporary(
                    "⚠️ Les 9 places de remplaçants sont occupées."
                );

                this.resetDrag();

                return;

            }


            tactics.addSubstitute(
                player
            );


            console.log(
                "🪑 Réserviste → remplaçant :",
                player.nom
            );

        }


        /*
         * Réserviste → terrain
         */

        else if (
            target.type ===
            "pitch"
        ) {

            if (
                tactics.lineup.length >= 11
            ) {

                const poste =
                    target.poste.poste;


                const starter =
                    tactics.lineup.find(
                        current => {

                            const key =
                                tactics.getPlayerKey(
                                    current
                                );

                            return (
                                tactics.getPosition(key) ===
                                poste
                            );

                        }
                    );


                if (starter) {

                    if (
                        tactics.substitutes.length >= 9
                    ) {

                        /*
                         * On échange avec le
                         * titulaire uniquement
                         * si une place de banc
                         * peut être libérée.
                         */

                        console.log(
                            "⚠️ Banc complet."
                        );

                        this.resetDrag();

                        return;

                    }


                    const starterKey =
                        tactics.getPlayerKey(
                            starter
                        );


                    tactics.removeStarter(
                        starterKey
                    );


                    tactics.addStarter(
                        player,
                        poste
                    );


                    tactics.addSubstitute(
                        starter
                    );


                    console.log(
                        "🔄 Réserviste → titulaire :",
                        player.nom
                    );

                }

            }

        }


        this.resetDrag();

        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* POSITION LA PLUS PROCHE */
    /* ================================================= */

    findNearestPosition(
        clientX,
        clientY,
        formation
    ) {

        if (
            !this.pitchElement ||
            !formation
        ) {

            return null;

        }


        const rect =
            this.pitchElement
                .getBoundingClientRect();


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
                        ) +

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


    /* ================================================= */
    /* REMPLACEMENT */
    /* ================================================= */

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
            "🔄 Remplacement :",
            starter.nom,
            "→",
            substitute.nom
        );


        this.resetDrag();

        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* REMPLAÇANTS */
    /* ================================================= */

    drawSubstitutes(
        tactics,
        manager
    ) {

        this.ui.showTitle(
            "🪑 Remplaçants"
        );


        const zone =
            document.createElement("div");

        zone.className =
            "tactics-substitutes-zone";


        if (
            tactics.substitutes.length === 0
        ) {

            zone.innerHTML =
                "<p>Aucun remplaçant.</p>";

            this.container.appendChild(
                zone
            );

            return;

        }


        tactics.substitutes.forEach(
            player => {

                const card =
                    this.createPlayerCard(
                        player,
                        "substitute",
                        tactics,
                        manager
                    );


                zone.appendChild(
                    card
                );

            }
        );


        this.container.appendChild(
            zone
        );

    }


    /* ================================================= */
    /* RÉSERVISTES */
    /* ================================================= */

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


                    const starter =
                        tactics.lineup.some(
                            p =>
                                tactics.getPlayerKey(p) ===
                                key
                        );


                    const substitute =
                        tactics.substitutes.some(
                            p =>
                                tactics.getPlayerKey(p) ===
                                key
                        );


                    return (
                        !starter &&
                        !substitute
                    );

                }
            );


        this.ui.showTitle(
            "📋 Réservistes"
        );


        const zone =
            document.createElement("div");

        zone.className =
            "tactics-reserves-zone";


        if (
            reserves.length === 0
        ) {

            zone.innerHTML =
                "<p>Aucun réserviste.</p>";

            this.container.appendChild(
                zone
            );

            return;

        }


        reserves.forEach(
            player => {

                const card =
                    this.createPlayerCard(
                        player,
                        "reserve",
                        tactics,
                        manager
                    );


                zone.appendChild(
                    card
                );

            }
        );


        this.container.appendChild(
            zone
        );

    }


    /* ================================================= */
    /* CARTE JOUEUR */
    /* ================================================= */

    createPlayerCard(
        player,
        type,
        tactics,
        manager
    ) {

        const card =
            document.createElement("div");


        card.className =
            "tactics-player-card";


        const key =
            tactics.getPlayerKey(
                player
            );


        card.dataset.playerKey =
            key;


        card.dataset.playerType =
            type;


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


        card.style.touchAction =
            "none";


        this.enableCardDrag(
            card,
            player,
            type,
            tactics,
            manager
        );


        card.addEventListener(
            "click",
            () => {

                if (
                    card.dataset.wasDragged ===
                    "true"
                ) {

                    card.dataset.wasDragged =
                        "false";

                    return;

                }


                if (
                    type ===
                    "substitute"
                ) {

                    this.showSubstituteActions(
                        tactics,
                        manager,
                        player
                    );

                }


                if (
                    type ===
                    "reserve"
                ) {

                    this.showReserveActions(
                        tactics,
                        manager,
                        player
                    );

                }

            }
        );


        return card;

    }


    /* ================================================= */
    /* DRAG DES CARTES */
    /* ================================================= */

    enableCardDrag(
        element,
        player,
        type,
        tactics,
        manager
    ) {

        let startX = 0;
        let startY = 0;
        let dragging = false;


        element.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                startX =
                    event.clientX;

                startY =
                    event.clientY;

                dragging =
                    false;


                this.draggingElement =
                    element;

                this.draggingPlayer =
                    player;

                this.draggingType =
                    type;

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
                            startX,
                            2
                        ) +

                        Math.pow(
                            event.clientY -
                            startY,
                            2
                        )

                    );


                if (
                    !dragging &&
                    distance > 8
                ) {

                    dragging =
                        true;

                    element.dataset.wasDragged =
                        "true";

                    element.classList.add(
                        "dragging"
                    );

                }

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


                if (!dragging) {

                    this.resetDrag();

                    return;

                }


                this.finishDrop(
                    event,
                    tactics.getFormationData(),
                    tactics,
                    manager
                );

            }
        );


        element.addEventListener(
            "pointercancel",
            () => {

                this.resetDrag();

                this.show(
                    tactics,
                    manager
                );

            }
        );

    }


    /* ================================================= */
    /* ACTIONS REMPLAÇANT */
    /* ================================================= */

    showSubstituteActions(
        tactics,
        manager,
        player
    ) {

        const old =
            this.container.querySelector(
                ".player-actions"
            );


        if (old) {

            old.remove();

        }


        const box =
            document.createElement("div");


        box.className =
            "player-actions";


        box.innerHTML = `

            <h3>
                🪑 ${player.prenom}
                ${player.nom}
            </h3>

            <p>
                📍 ${player.poste}
            </p>

            <p>
                ⭐ ${player.note}
            </p>

        `;


        const reserveButton =
            document.createElement("button");


        reserveButton.textContent =
            "📋 Mettre en réserviste";


        reserveButton.addEventListener(
            "click",
            () => {

                tactics.removeSubstitute(
                    tactics.getPlayerKey(player)
                );


                this.show(
                    tactics,
                    manager
                );

            }
        );


        box.appendChild(
            reserveButton
        );


        this.container.appendChild(
            box
        );

    }


    /* ================================================= */
    /* ACTIONS RÉSERVISTE */
    /* ================================================= */

    showReserveActions(
        tactics,
        manager,
        player
    ) {

        const old =
            this.container.querySelector(
                ".player-actions"
            );


        if (old) {

            old.remove();

        }


        const box =
            document.createElement("div");


        box.className =
            "player-actions";


        box.innerHTML = `

            <h3>
                📋 ${player.prenom}
                ${player.nom}
            </h3>

            <p>
                📍 ${player.poste}
            </p>

            <p>
                ⭐ ${player.note}
            </p>

        `;


        if (
            tactics.substitutes.length < 9
        ) {

            const button =
                document.createElement("button");


            button.textContent =
                "🪑 Mettre remplaçant";


            button.addEventListener(
                "click",
                () => {

                    tactics.addSubstitute(
                        player
                    );


                    this.show(
                        tactics,
                        manager
                    );

                }
            );


            box.appendChild(
                button
            );

        }


        this.container.appendChild(
            box
        );

    }


    /* ================================================= */
    /* ACTIONS TITULAIRE */
    /* ================================================= */

    showPlayerActions(
        tactics,
        manager,
        player,
        position
    ) {

        const old =
            this.container.querySelector(
                ".player-actions"
            );


        if (old) {

            old.remove();

        }


        const box =
            document.createElement("div");


        box.className =
            "player-actions";


        box.innerHTML = `

            <h3>
                ⚽ ${player.prenom}
                ${player.nom}
            </h3>

            <p>
                📍 ${position}
            </p>

            <p>
                ⭐ ${player.note}
            </p>

        `;


        const replace =
            document.createElement("button");


        replace.textContent =
            "🔄 Remplacer";


        replace.addEventListener(
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


        box.appendChild(
            replace
        );


        const remove =
            document.createElement("button");


        remove.textContent =
            "❌ Retirer des titulaires";


        remove.addEventListener(
            "click",
            () => {

                tactics.removeStarter(
                    tactics.getPlayerKey(player)
                );


                this.show(
                    tactics,
                    manager
                );

            }
        );


        box.appendChild(
            remove
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


    /* ================================================= */
    /* LISTE REMPLACEMENT */
    /* ================================================= */

    showReplacementList(
        tactics,
        manager,
        starter,
        position
    ) {

        const old =
            this.container.querySelector(
                ".player-actions"
            );


        if (old) {

            old.remove();

        }


        const box =
            document.createElement("div");


        box.className =
            "player-actions";


        box.innerHTML =
            "<h3>🔄 Remplacer</h3>";


        tactics.substitutes.forEach(
            substitute => {

                const button =
                    document.createElement("button");


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


        const cancel =
            document.createElement("button");


        cancel.textContent =
            "⬅️ Annuler";


        cancel.addEventListener(
            "click",
            () => {

                this.show(
                    tactics,
                    manager
                );

            }
        );


        box.appendChild(
            cancel
        );


        this.container.appendChild(
            box
        );

    }


    /* ================================================= */
    /* RECHERCHE JOUEUR */
    /* ================================================= */

    findPlayerByKey(
        key,
        players,
        tactics
    ) {

        return players.find(
            player =>
                tactics.getPlayerKey(
                    player
                ) === String(key)
        );

    }


    /* ================================================= */
    /* MESSAGE TEMPORAIRE */
    /* ================================================= */

    showMessageTemporary(
        message
    ) {

        const box =
            document.createElement("div");


        box.className =
            "player-actions";


        box.innerHTML =
            "<p>" +
            message +
            "</p>";


        this.container.appendChild(
            box
        );


        setTimeout(
            () => {

                if (box.parentNode) {

                    box.remove();

                }

            },
            2000
        );

    }


    /* ================================================= */
    /* RESET DRAG */
    /* ================================================= */

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

        this.draggingType =
            null;

        this.isDragging =
            false;

    }


    /* ================================================= */
    /* FORMATIONS */
    /* ================================================= */

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


    /* ================================================= */
    /* STYLES */
    /* ================================================= */

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
