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


    /* ================================================= */
    /* INITIALISATION */
    /* ================================================= */

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


        /* ========================= */
        /* TERRAIN */
        /* ========================= */

        this.drawPitch(
            tactics,
            manager
        );


        /* ========================= */
        /* REMPLAÇANTS */
        /* ========================= */

        this.drawSubstitutes(
            tactics,
            manager
        );


        /* ========================= */
        /* RÉSERVISTES */
        /* ========================= */

        this.drawReserves(
            tactics,
            manager
        );


        /* ========================= */
        /* FORMATIONS */
        /* ========================= */

        this.drawFormationList(
            tactics,
            manager
        );


        /* ========================= */
        /* STYLES */
        /* ========================= */

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


    /* ================================================= */
    /* TERRAIN */
    /* ================================================= */

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

                    const playerKey =
                        tactics.getPlayerKey(
                            selectedPlayer
                        );


                    player.dataset.playerKey =
                        playerKey;


                    player.dataset.playerType =
                        "starter";


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


                pitch.appendChild(
                    player
                );

            }
        );


        this.container.appendChild(
            pitch
        );

    }


    /* ================================================= */
    /* DRAG DES JOUEURS */
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


                try {

                    element.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    console.log(
                        "Pointer capture non disponible."
                    );

                }

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


                if (
                    type ===
                    "starter"
                ) {

                    this.movePitchPlayer(
                        element,
                        event
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


                if (
                    !this.isDragging
                ) {

                    this.resetDrag();

                    return;

                }


                try {

                    element.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {

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
    /* DÉPLACEMENT VISUEL SUR LE TERRAIN */
    /* ================================================= */

    movePitchPlayer(
        element,
        event
    ) {

        if (
            !this.pitchElement
        ) {

            return;

        }


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


    /* ================================================= */
    /* FIN DU DROP */
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

            console.log(
                "⚠️ Zone de dépôt inconnue."
            );


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
            type ===
            "starter"
        ) {

            this.handleStarterDrop(
                player,
                target,
                tactics,
                manager
            );


            return;

        }


        if (
            type ===
            "substitute"
        ) {

            this.handleSubstituteDrop(
                player,
                target,
                tactics,
                manager
            );


            return;

        }


        if (
            type ===
            "reserve"
        ) {

            this.handleReserveDrop(
                player,
                target,
                tactics,
                manager
            );


            return;

        }


        this.resetDrag();

    }


    /* ================================================= */
    /* DÉTECTION DE LA CIBLE */
    /* ================================================= */

    getDropTarget(
        x,
        y,
        tactics
    ) {

        const elements =
            document.elementsFromPoint(
                x,
                y
            );


        /* ========================= */
        /* JOUEUR TITULAIRE */
        /* ========================= */

        for (
            const element of elements
        ) {

            if (
                element.classList.contains(
                    "pitch-player"
                )
            ) {

                const key =
                    element.dataset.playerKey;


                if (key) {

                    const player =
                        this.findPlayerByKey(
                            key,
                            tactics.lineup,
                            tactics
                        );


                    if (player) {

                        return {

                            type:
                                "starter-player",

                            player:
                                player,

                            key:
                                key,

                            position:
                                tactics.getPosition(
                                    key
                                )

                        };

                    }

                }

            }


            /* ========================= */
            /* CARTE JOUEUR */
            /* ========================= */

            if (
                element.classList.contains(
                    "tactics-player-card"
                )
            ) {

                const type =
                    element.dataset.playerType;


                const key =
                    element.dataset.playerKey;


                if (
                    type ===
                    "substitute" &&
                    key
                ) {

                    return {

                        type:
                            "substitute-player",

                        key:
                            key

                    };

                }


                if (
                    type ===
                    "reserve" &&
                    key
                ) {

                    return {

                        type:
                            "reserve-player",

                        key:
                            key

                    };

                }

            }

        }


        /* ========================= */
        /* ZONE TERRAIN */
        /* ========================= */

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

                        type:
                            "pitch",

                        poste:
                            poste

                    };

                }

            }

        }


        /* ========================= */
        /* ZONE REMPLAÇANTS */
        /* ========================= */

        const substituteZone =
            document.querySelector(
                ".tactics-substitutes-zone"
            );


        if (
            substituteZone
        ) {

            const rect =
                substituteZone
                    .getBoundingClientRect();


            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {

                return {

                    type:
                        "substitutes"

                };

            }

        }


        /* ========================= */
        /* ZONE RÉSERVISTES */
        /* ========================= */

        const reserveZone =
            document.querySelector(
                ".tactics-reserves-zone"
            );


        if (
            reserveZone
        ) {

            const rect =
                reserveZone
                    .getBoundingClientRect();


            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {

                return {

                    type:
                        "reserves"

                };

            }

        }


        return null;

    }


    /* ================================================= */
    /* TITULAIRE → ... */
    /* ================================================= */

    handleStarterDrop(
        player,
        target,
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


        /* ========================= */
        /* TITULAIRE → TITULAIRE */
        /* ========================= */

        if (
            target.type ===
            "starter-player"
        ) {

            if (
                target.key ===
                playerKey
            ) {

                this.resetDrag();

                this.show(
                    tactics,
                    manager
                );

                return;

            }


            const otherPlayer =
                target.player;


            const otherKey =
                tactics.getPlayerKey(
                    otherPlayer
                );


            tactics.setPosition(
                playerKey,
                target.position
            );


            tactics.setPosition(
                otherKey,
                oldPosition
            );


            console.log(
                "🔄 Titulaires échangés :",
                player.nom,
                "↔",
                otherPlayer.nom
            );

        }


        /* ========================= */
        /* TITULAIRE → POSITION VIDE */
        /* ========================= */

        else if (
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
                            tactics.getPosition(
                                key
                            ) ===
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

            } else {

                tactics.setPosition(
                    playerKey,
                    targetPosition
                );

            }


            console.log(
                "📍 Nouvelle position :",
                player.nom,
                "→",
                targetPosition
            );

        }


        /* ========================= */
        /* TITULAIRE → REMPLAÇANT */
        /* ========================= */

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


        /* ========================= */
        /* TITULAIRE → BANC */
        /* ========================= */

        else if (
            target.type ===
            "substitutes"
        ) {

            if (
                tactics.substitutes.length >=
                9
            ) {

                this.showMessageTemporary(
                    "⚠️ Les 9 places du banc sont occupées."
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


        /* ========================= */
        /* TITULAIRE → RÉSERVISTE */
        /* ========================= */

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


        this.resetDrag();


        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* REMPLAÇANT → ... */
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


        /* ========================= */
        /* REMPLAÇANT → TITULAIRE */
        /* ========================= */

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


        /* ========================= */
        /* REMPLAÇANT → TERRAIN */
        /* ========================= */

        if (
            target.type ===
            "pitch"
        ) {

            const targetPosition =
                target.poste.poste;


            const starter =
                tactics.lineup.find(
                    current => {

                        const key =
                            tactics.getPlayerKey(
                                current
                            );


                        return (
                            tactics.getPosition(
                                key
                            ) ===
                            targetPosition
                        );

                    }
                );


            if (starter) {

                this.replacePlayer(
                    tactics,
                    manager,
                    starter,
                    player,
                    targetPosition
                );


                return;

            }

        }


        /* ========================= */
        /* REMPLAÇANT → RÉSERVISTE */
        /* ========================= */

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


        /* ========================= */
        /* REMPLAÇANT → AUTRE REMPLAÇANT */
        /* ========================= */

        if (
            target.type ===
            "substitute-player"
        ) {

            const other =
                this.findPlayerByKey(
                    target.key,
                    tactics.substitutes,
                    tactics
                );


            if (
                other &&
                tactics.getPlayerKey(other) !==
                playerKey
            ) {

                const index1 =
                    tactics.substitutes.findIndex(
                        p =>
                            tactics.getPlayerKey(p) ===
                            playerKey
                    );


                const index2 =
                    tactics.substitutes.findIndex(
                        p =>
                            tactics.getPlayerKey(p) ===
                            tactics.getPlayerKey(other)
                    );


                const temp =
                    tactics.substitutes[index1];


                tactics.substitutes[index1] =
                    tactics.substitutes[index2];


                tactics.substitutes[index2] =
                    temp;

            }

        }


        this.resetDrag();


        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* RÉSERVISTE → ... */
    /* ================================================= */

    handleReserveDrop(
        player,
        target,
        tactics,
        manager
    ) {

        /* ========================= */
        /* RÉSERVISTE → REMPLAÇANT */
        /* ========================= */

        if (
            target.type ===
            "substitutes"
        ) {

            if (
                tactics.substitutes.length >=
                9
            ) {

                this.showMessageTemporary(
                    "⚠️ Les 9 places du banc sont occupées."
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


        /* ========================= */
        /* RÉSERVISTE → REMPLAÇANT PRÉCIS */
        /* ========================= */

        else if (
            target.type ===
            "substitute-player"
        ) {

            if (
                tactics.substitutes.length >=
                9
            ) {

                this.showMessageTemporary(
                    "⚠️ Les 9 places du banc sont occupées."
                );


                this.resetDrag();


                return;

            }


            const index =
                tactics.substitutes.findIndex(
                    p =>
                        tactics.getPlayerKey(p) ===
                        target.key
                );


            if (
                index !== -1
            ) {

                tactics.substitutes.splice(
                    index,
                    0,
                    player
                );

                /*
                 * Le joueur qui était à cette
                 * place est décalé.
                 */

                if (
                    tactics.substitutes.length >
                    9
                ) {

                    tactics.substitutes.pop();

                }

            }

        }


        /* ========================= */
        /* RÉSERVISTE → TERRAIN */
        /* ========================= */

        else if (
            target.type ===
            "pitch"
        ) {

            const targetPosition =
                target.poste.poste;


            const starter =
                tactics.lineup.find(
                    current => {

                        const key =
                            tactics.getPlayerKey(
                                current
                            );


                        return (
                            tactics.getPosition(
                                key
                            ) ===
                            targetPosition
                        );

                    }
                );


            if (starter) {

                if (
                    tactics.substitutes.length >=
                    9
                ) {

                    this.showMessageTemporary(
                        "⚠️ Le banc est déjà complet."
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
                    targetPosition
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


        this.resetDrag();


        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* REMPLACEMENT TITULAIRE ↔ REMPLAÇANT */
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
                    ) ===
                    starterKey
            );


        const substituteIndex =
            tactics.substitutes.findIndex(
                player =>
                    tactics.getPlayerKey(
                        player
                    ) ===
                    substituteKey
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


        this.resetDrag();


        this.show(
            tactics,
            manager
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
            document.createElement(
                "div"
            );


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


        element.dataset.wasDragged =
            "false";


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


                try {

                    element.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                }

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
                        )

                        +

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


                try {

                    element.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {

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
            document.createElement(
                "div"
            );


        zone.className =
            "tactics-substitutes-zone";


        if (
            tactics.substitutes.length ===
            0
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
                                tactics.getPlayerKey(
                                    p
                                ) ===
                                key
                        );


                    const substitute =
                        tactics.substitutes.some(
                            p =>
                                tactics.getPlayerKey(
                                    p
                                ) ===
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
            document.createElement(
                "div"
            );


        zone.className =
            "tactics-reserves-zone";


        if (
            reserves.length ===
            0
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
    /* ACTIONS TITULAIRE */
    /* ================================================= */

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


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "player-actions";


        box.innerHTML = `

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


        box.appendChild(
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

                tactics.removeStarter(
                    tactics.getPlayerKey(
                        player
                    )
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


        this.insertActionsBox(
            box
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
                📍 Poste :
                ${player.poste}
            </p>

            <p>
                ⭐ Note :
                ${player.note}
            </p>

        `;


        const reserveButton =
            document.createElement(
                "button"
            );


        reserveButton.textContent =
            "📋 Mettre en réserviste";


        reserveButton.addEventListener(
            "click",
            () => {

                tactics.removeSubstitute(
                    tactics.getPlayerKey(
                        player
                    )
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


        this.insertActionsBox(
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
                📍 Poste :
                ${player.poste}
            </p>

            <p>
                ⭐ Note :
                ${player.note}
            </p>

        `;


        if (
            tactics.substitutes.length <
            9
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
                substituteButton
            );

        }


        this.insertActionsBox(
            box
        );

    }


    /* ================================================= */
    /* ACTIONS SOUS LE TERRAIN */
    /* ================================================= */

    insertActionsBox(
        box
    ) {

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
            behavior:
                "smooth",

            block:
                "center"

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


        this.insertActionsBox(
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

        if (
            !players
        ) {

            return null;

        }


        return players.find(
            player =>
                tactics.getPlayerKey(
                    player
                ) ===
                String(key)
        ) || null;

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
            smallestDistance >
            18
        ) {

            return null;

        }


        return nearest;

    }


    /* ================================================= */
    /* MESSAGE TEMPORAIRE */
    /* ================================================= */

    showMessageTemporary(
        message
    ) {

        const box =
            document.createElement(
                "div"
            );


        box.className =
            "player-actions";


        box.innerHTML =
            "<p>" +
            message +
            "</p>";


        this.insertActionsBox(
            box
        );


        setTimeout(
            () => {

                if (
                    box.parentNode
                ) {

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
    /* STYLES TACTIQUES */
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
