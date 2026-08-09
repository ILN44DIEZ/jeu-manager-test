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
    /* AFFICHAGE */
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

                    const key =
                        tactics.getPlayerKey(
                            selectedPlayer
                        );


                    player.dataset.playerKey =
                        key;


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
    /* DRAG TITULAIRE */
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

                /*
                 * IMPORTANT :
                 * On ne fait PAS preventDefault ici.
                 * Cela permet au clic normal de fonctionner.
                 */

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


                    /*
                     * Maintenant seulement,
                     * on bloque le comportement
                     * tactile du navigateur.
                     */

                    try {

                        element.setPointerCapture(
                            event.pointerId
                        );

                    } catch (error) {}

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

                } catch (error) {}


                this.finishDrop(
                    event,
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
    /* DRAG CARTES */
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

                /*
                 * PAS de preventDefault ici.
                 * Sinon le clic sur les réservistes
                 * peut ne plus fonctionner.
                 */

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


                    this.isDragging =
                        true;


                    element.dataset.wasDragged =
                        "true";


                    element.classList.add(
                        "dragging"
                    );


                    try {

                        element.setPointerCapture(
                            event.pointerId
                        );

                    } catch (error) {}

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

                } catch (error) {}


                this.finishDrop(
                    event,
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
    /* DÉPLACEMENT VISUEL */
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
                "⚠️ Aucune zone de dépôt."
            );


            this.resetDrag();


            this.show(
                tactics,
                manager
            );

            return;

        }


        console.log(
            "📦",
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

    }


    /* ================================================= */
    /* TROUVER LA CIBLE */
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


        /*
         * TITULAIRE
         */

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


            /*
             * CARTE REMPLAÇANT / RÉSERVISTE
             */

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
                    "substitute"
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
                    "reserve"
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


        /*
         * TERRAIN
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

                        type:
                            "pitch",

                        poste:
                            poste

                    };

                }

            }

        }


        /*
         * ZONE REMPLAÇANTS
         */

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


        /*
         * ZONE RÉSERVISTES
         */

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


        /*
         * TITULAIRE → AUTRE TITULAIRE
         */

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
                "🔄 Échange :",
                player.nom,
                "↔",
                otherPlayer.nom
            );

        }


        /*
         * TITULAIRE → POSITION
         */

        else if (
            target.type ===
            "pitch"
        ) {

            const newPosition =
                target.poste.poste;


            const otherPlayer =
                tactics.lineup.find(
                    other => {

                        const key =
                            tactics.getPlayerKey(
                                other
                            );


                        return (
                            key !== playerKey &&
                            tactics.getPosition(
                                key
                            ) ===
                            newPosition
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
                    newPosition
                );


                tactics.setPosition(
                    otherKey,
                    oldPosition
                );

            } else {

                tactics.setPosition(
                    playerKey,
                    newPosition
                );

            }

        }


        /*
         * TITULAIRE → REMPLAÇANT
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


        /*
         * TITULAIRE → BANC
         */

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


        /*
         * TITULAIRE → RÉSERVISTE
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

        /*
         * REMPLAÇANT → TITULAIRE
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
         * REMPLAÇANT → POSITION
         */

        if (
            target.type ===
            "pitch"
        ) {

            const position =
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
                            position
                        );

                    }
                );


            if (starter) {

                this.replacePlayer(
                    tactics,
                    manager,
                    starter,
                    player,
                    position
                );

                return;

            }

        }


        /*
         * REMPLAÇANT → RÉSERVISTE
         */

        if (
            target.type ===
            "reserves"
        ) {

            tactics.removeSubstitute(
                tactics.getPlayerKey(
                    player
                )
            );


            console.log(
                "📋 Remplaçant → réserviste :",
                player.nom
            );

        }


        /*
         * REMPLAÇANT → AUTRE REMPLAÇANT
         */

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
                other !== player
            ) {

                const index1 =
                    tactics.substitutes.indexOf(
                        player
                    );


                const index2 =
                    tactics.substitutes.indexOf(
                        other
                    );


                if (
                    index1 !== -1 &&
                    index2 !== -1
                ) {

                    const temp =
                        tactics.substitutes[index1];


                    tactics.substitutes[index1] =
                        tactics.substitutes[index2];


                    tactics.substitutes[index2] =
                        temp;

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
    /* RÉSERVISTE → ... */
    /* ================================================= */

    handleReserveDrop(
        player,
        target,
        tactics,
        manager
    ) {

        /*
         * RÉSERVISTE → TITULAIRE
         *
         * On échange directement avec
         * le titulaire.
         *
         * Aucun besoin d'une place
         * supplémentaire sur le banc.
         */

        if (
            target.type ===
            "starter-player"
        ) {

            const starter =
                target.player;


            const starterKey =
                tactics.getPlayerKey(
                    starter
                );


            const reserveKey =
                tactics.getPlayerKey(
                    player
                );


            const starterIndex =
                tactics.lineup.findIndex(
                    p =>
                        tactics.getPlayerKey(
                            p
                        ) ===
                        starterKey
                );


            if (
                starterIndex !== -1
            ) {

                tactics.lineup[
                    starterIndex
                ] =
                    player;


                delete tactics.positions[
                    starterKey
                ];


                tactics.positions[
                    reserveKey
                ] =
                    target.position;


                console.log(
                    "🔄 Réserviste → titulaire :",
                    player.nom,
                    "à la place de",
                    starter.nom
                );

            }


            this.resetDrag();


            this.show(
                tactics,
                manager
            );

            return;

        }


        /*
         * RÉSERVISTE → POSITION
         */

        if (
            target.type ===
            "pitch"
        ) {

            const position =
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
                            position
                        );

                    }
                );


            if (starter) {

                const starterKey =
                    tactics.getPlayerKey(
                        starter
                    );


                const reserveKey =
                    tactics.getPlayerKey(
                        player
                    );


                const index =
                    tactics.lineup.indexOf(
                        starter
                    );


                tactics.lineup[index] =
                    player;


                delete tactics.positions[
                    starterKey
                ];


                tactics.positions[
                    reserveKey
                ] =
                    position;


                console.log(
                    "🔄 Réserviste → titulaire :",
                    player.nom
                );

            }


            this.resetDrag();


            this.show(
                tactics,
                manager
            );

            return;

        }


        /*
         * RÉSERVISTE → REMPLAÇANT
         */

        if (
            target.type ===
            "substitutes"
        ) {

            if (
                tactics.substitutes.length >=
                9
            ) {

                this.showMessageTemporary(
                    "⚠️ Les 9 places du banc sont déjà occupées."
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


            this.resetDrag();


            this.show(
                tactics,
                manager
            );

            return;

        }


        /*
         * RÉSERVISTE → REMPLAÇANT PRÉCIS
         */

        if (
            target.type ===
            "substitute-player"
        ) {

            if (
                tactics.substitutes.length >=
                9
            ) {

                this.showMessageTemporary(
                    "⚠️ Les 9 places du banc sont déjà occupées."
                );


                this.resetDrag();

                return;

            }


            const index =
                tactics.substitutes.findIndex(
                    substitute =>
                        tactics.getPlayerKey(
                            substitute
                        ) ===
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

            }


            this.resetDrag();


            this.show(
                tactics,
                manager
            );

            return;

        }


        this.resetDrag();


        this.show(
            tactics,
            manager
        );

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
                "❌ Remplacement impossible."
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
    /* CARTES */
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


        card.dataset.wasDragged =
            "false";


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


        /*
         * CLIC NORMAL
         */

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

                zone.appendChild(
                    this.createPlayerCard(
                        player,
                        "substitute",
                        tactics,
                        manager
                    )
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


                    const isStarter =
                        tactics.lineup.some(
                            starter =>
                                tactics.getPlayerKey(
                                    starter
                                ) ===
                                key
                        );


                    const isSubstitute =
                        tactics.substitutes.some(
                            substitute =>
                                tactics.getPlayerKey(
                                    substitute
                                ) ===
                                key
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

                zone.appendChild(
                    this.createPlayerCard(
                        player,
                        "reserve",
                        tactics,
                        manager
                    )
                );

            }
        );


        this.container.appendChild(
            zone
        );

    }


    /* ================================================= */
    /* MENU TITULAIRE */
    /* ================================================= */

    showPlayerActions(
        tactics,
        manager,
        player,
        position
    ) {

        this.removeActionMenu();


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
    /* MENU REMPLAÇANT */
    /* ================================================= */

    showSubstituteActions(
        tactics,
        manager,
        player
    ) {

        this.removeActionMenu();


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
    /* MENU RÉSERVISTE */
    /* ================================================= */

    showReserveActions(
        tactics,
        manager,
        player
    ) {

        this.removeActionMenu();


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


        /*
         * RÉSERVISTE → REMPLAÇANT
         */

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

        } else {

            const fullMessage =
                document.createElement(
                    "p"
                );


            fullMessage.textContent =
                "⚠️ Banc complet (9/9)";


            box.appendChild(
                fullMessage
            );

        }


        /*
         * RÉSERVISTE → TITULAIRE
         *
         * On affiche les 11 titulaires
         * pour permettre de choisir
         * directement celui à remplacer.
         */

        const starterTitle =
            document.createElement(
                "h4"
            );


        starterTitle.textContent =
            "⚽ Remplacer un titulaire";


        box.appendChild(
            starterTitle
        );


        tactics.lineup.forEach(
            starter => {

                const position =
                    tactics.getPosition(
                        tactics.getPlayerKey(
                            starter
                        )
                    );


                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =

                    "⚽ " +
                    starter.nom +
                    " — " +
                    position;


                button.addEventListener(
                    "click",
                    () => {

                        this.reserveToStarter(
                            tactics,
                            manager,
                            player,
                            starter,
                            position
                        );

                    }
                );


                box.appendChild(
                    button
                );

            }
        );


        this.insertActionsBox(
            box
        );

    }


    /* ================================================= */
    /* RÉSERVISTE → TITULAIRE PAR MENU */
    /* ================================================= */

    reserveToStarter(
        tactics,
        manager,
        reserve,
        starter,
        position
    ) {

        const reserveKey =
            tactics.getPlayerKey(
                reserve
            );


        const starterKey =
            tactics.getPlayerKey(
                starter
            );


        const index =
            tactics.lineup.findIndex(
                player =>
                    tactics.getPlayerKey(
                        player
                    ) ===
                    starterKey
            );


        if (
            index === -1
        ) {

            return;

        }


        tactics.lineup[index] =
            reserve;


        delete tactics.positions[
            starterKey
        ];


        tactics.positions[
            reserveKey
        ] =
            position;


        console.log(
            "🔄 Réserviste → titulaire :",
            reserve.nom,
            "à la place de",
            starter.nom
        );


        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* MENU REMPLACEMENT */
    /* ================================================= */

    showReplacementList(
        tactics,
        manager,
        starter,
        position
    ) {

        this.removeActionMenu();


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
                "❌ Remplacement impossible."
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


        this.show(
            tactics,
            manager
        );

    }


    /* ================================================= */
    /* POSITION DU MENU */
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


    removeActionMenu() {

        const old =
            this.container.querySelector(
                ".player-actions"
            );


        if (old) {

            old.remove();

        }

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
    /* MESSAGE */
    /* ================================================= */

    showMessageTemporary(
        message
    ) {

        this.removeActionMenu();


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
