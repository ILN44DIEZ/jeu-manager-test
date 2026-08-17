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


        /*
         * On récupère les emplacements
         * uniques de la formation.
         *
         * Exemple :
         *
         * DC_1
         * DC_2
         * MC_1
         * MC_2
         * MC_3
         */

        const slots =
            tactics.getFormationSlots(
                formation
            );


        slots.forEach(
            (slot, index) => {

                const player =
                    document.createElement(
                        "div"
                    );


                player.className =
                    "pitch-player";


                /*
                 * ID UNIQUE DE L'EMPLACEMENT
                 */

                player.dataset.positionId =
                    slot.id;


                player.dataset.position =
                    slot.poste;


                /*
                 * JOUEUR DE CET EMPLACEMENT
                 */

                const selectedPlayer =
                    tactics.lineup.find(
                        joueur => {

                            const key =
                                tactics.getPlayerKey(
                                    joueur
                                );


                            return (
                                tactics.getPositionIdForPlayer(
                                    key
                                ) ===
                                slot.id
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


                    /*
                     * POSITIONNEMENT
                     */

                    const positionStatus =
                        tactics.getPositionStatus(
                            selectedPlayer,
                            slot.poste
                        );


                    const effectiveRating =
                        tactics.getEffectiveRating(
                            selectedPlayer,
                            slot.poste
                        );


                    const positionPenalty =
                        tactics.getPositionPenalty(
                            selectedPlayer,
                            slot.poste
                        );


                    player.dataset.positionStatus =
                        positionStatus;


                    /*
                     * AFFICHAGE
                     */

                    player.innerHTML =

                        "<strong>" +
                        selectedPlayer.nom +
                        "</strong>" +

                        "<br>" +

                        "<small>⭐ " +
                        effectiveRating +
                        "</small>" +

                        "<span class=\"player-position\">" +
                        slot.poste +
                        "</span>";


                    /*
                     * COULEUR
                     */

                    this.applyPositionColor(
                        player,
                        positionStatus
                    );


                    /*
                     * INFO AU SURVOL
                     */

                    if (
                        positionPenalty < 0
                    ) {

                        player.title =
                            "Poste : " +
                            slot.poste +
                            " | Note : " +
                            effectiveRating +
                            " | Pénalité : " +
                            positionPenalty;

                    } else {

                        player.title =
                            "Poste naturel | Note : " +
                            effectiveRating;

                    }


                    player.style.touchAction =
                        "none";


                    this.enableDrag(
                        player,
                        selectedPlayer,
                        "starter",
                        slot,
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
                                slot.poste
                            );

                        }
                    );

                } else {

                    /*
                     * EMPLACEMENT VIDE
                     */

                    player.innerHTML =
                        "<strong>" +
                        slot.poste +
                        "</strong>";

                }


                player.style.left =
                    slot.x + "%";


                player.style.top =
                    slot.y + "%";


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
    /* COULEUR POSITIONNEMENT */
    /* ================================================= */

    applyPositionColor(
        element,
        status
    ) {

        switch (status) {

            case "green":

                element.style.backgroundColor =
                    "#39d353";

                element.style.borderColor =
                    "#0b5d1e";

                element.style.color =
                    "#000000";

                break;


            case "yellow":

                element.style.backgroundColor =
                    "#ffd83d";

                element.style.borderColor =
                    "#9a7b00";

                element.style.color =
                    "#000000";

                break;


            case "red":

                element.style.backgroundColor =
                    "#ff4b4b";

                element.style.borderColor =
                    "#8b0000";

                element.style.color =
                    "#ffffff";

                break;


            default:

                element.style.backgroundColor =
                    "";

                element.style.borderColor =
                    "";

                element.style.color =
                    "";

                break;

        }

    }


    /* ================================================= */
    /* DRAG TITULAIRE */
    /* ================================================= */

    enableDrag(
        element,
        player,
        type,
        originalSlot,
        formation,
        tactics,
        manager
    ) {

        element.dataset.wasDragged =
            "false";


        element.addEventListener(
            "pointerdown",
            event => {

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

            this.resetDrag();


            this.show(
                tactics,
                manager
            );

            return;

        }


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


                const positionId =
                    element.dataset.positionId;


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

                            positionId:
                                positionId,

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


                const slot =
                    this.findNearestPosition(
                        x,
                        y,
                        formation,
                        tactics
                    );


                if (slot) {

                    return {

                        type:
                            "pitch",

                        positionId:
                            slot.id,

                        poste:
                            slot

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


        const oldPositionId =
            tactics.getPositionIdForPlayer(
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
                target.positionId
            );


            tactics.setPosition(
                otherKey,
                oldPositionId
            );

        }


        /*
         * TITULAIRE → POSITION
         */

        else if (
            target.type ===
            "pitch"
        ) {

            const newPositionId =
                target.positionId;


            const otherPlayer =
                this.findPlayerAtPosition(
                    newPositionId,
                    tactics
                );


            if (otherPlayer) {

                const otherKey =
                    tactics.getPlayerKey(
                        otherPlayer
                    );


                tactics.setPosition(
                    playerKey,
                    newPositionId
                );


                tactics.setPosition(
                    otherKey,
                    oldPositionId
                );

            } else {

                tactics.setPosition(
                    playerKey,
                    newPositionId
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
                    oldPositionId
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
                target.positionId
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

            const starter =
                this.findPlayerAtPosition(
                    target.positionId,
                    tactics
                );


            if (starter) {

                this.replacePlayer(
                    tactics,
                    manager,
                    starter,
                    player,
                    target.positionId
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
                    target.positionId;

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

            const starter =
                this.findPlayerAtPosition(
                    target.positionId,
                    tactics
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


                if (
                    index !== -1
                ) {

                    tactics.lineup[index] =
                        player;


                    delete tactics.positions[
                        starterKey
                    ];


                    tactics.positions[
                        reserveKey
                    ] =
                        target.positionId;

                }

            } else {

                tactics.addStarter(
                    player,
                    target.positionId
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
        positionId
    ) {

        if (
            !starter ||
            !substitute
        ) {

            console.error(
                "❌ Remplacement impossible."
            );

            return;

        }


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


        const oldPositionId =
            tactics.getPositionIdForPlayer(
                starterKey
            );


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
            positionId ||
            oldPositionId;


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


        const positionStatus =
            tactics.getPositionStatus(
                player,
                position
            );


        const effectiveRating =
            tactics.getEffectiveRating(
                player,
                position
            );


        const positionPenalty =
            tactics.getPositionPenalty(
                player,
                position
            );


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
                ${effectiveRating}
            </p>

            <p>
                ${this.getPositionStatusLabel(
                    positionStatus
                )}
            </p>

            ${
                positionPenalty < 0
                ? `<p>⚠️ Pénalité : ${positionPenalty}</p>`
                : ""
            }

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
    /* LABEL POSITION */
    /* ================================================= */

    getPositionStatusLabel(
        status
    ) {

        switch (status) {

            case "green":

                return "🟢 Poste naturel";


            case "yellow":

                return "🟡 Mauvais poste dans la ligne";


            case "red":

                return "🔴 Mauvaise ligne";


            default:

                return "⚪ Position inconnue";

        }

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

                const starterKey =
                    tactics.getPlayerKey(
                        starter
                    );


                const positionId =
                    tactics.getPositionIdForPlayer(
                        starterKey
                    );


                const position =
                    tactics.getPosition(
                        starterKey
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        starter,
                        position
                    );


                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =

                    "⚽ " +
                    starter.nom +
                    " — " +
                    position +
                    " ⭐ " +
                    effectiveRating;


                button.addEventListener(
                    "click",
                    () => {

                        this.reserveToStarter(
                            tactics,
                            manager,
                            player,
                            starter,
                            positionId
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
    /* RÉSERVISTE → TITULAIRE */
    /* ================================================= */

    reserveToStarter(
        tactics,
        manager,
        reserve,
        starter,
        positionId
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
            positionId;


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


        const starterKey =
            tactics.getPlayerKey(
                starter
            );


        const positionId =
            tactics.getPositionIdForPlayer(
                starterKey
            );


        tactics.substitutes.forEach(
            substitute => {

                const button =
                    document.createElement(
                        "button"
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        substitute,
                        position
                    );


                const positionStatus =
                    tactics.getPositionStatus(
                        substitute,
                        position
                    );


                button.textContent =
                    substitute.prenom +
                    " " +
                    substitute.nom +
                    " ⭐ " +
                    effectiveRating +
                    " " +
                    this.getPositionStatusLabel(
                        positionStatus
                    );


                button.addEventListener(
                    "click",
                    () => {

                        this.replacePlayer(
                            tactics,
                            manager,
                            starter,
                            substitute,
                            positionId
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


        const positionStatus =
            tactics.getPositionStatus(
                player,
                position
            );


        const effectiveRating =
            tactics.getEffectiveRating(
                player,
                position
            );


        const positionPenalty =
            tactics.getPositionPenalty(
                player,
                position
            );


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
                ${effectiveRating}
            </p>

            <p>
                ${this.getPositionStatusLabel(
                    positionStatus
                )}
            </p>

            ${
                positionPenalty < 0
                ? `<p>⚠️ Pénalité : ${positionPenalty}</p>`
                : ""
            }

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
    /* LABEL POSITION */
    /* ================================================= */

    getPositionStatusLabel(
        status
    ) {

        switch (status) {

            case "green":

                return "🟢 Poste naturel";


            case "yellow":

                return "🟡 Mauvais poste dans la ligne";


            case "red":

                return "🔴 Mauvaise ligne";


            default:

                return "⚪ Position inconnue";

        }

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

                const starterKey =
                    tactics.getPlayerKey(
                        starter
                    );


                const positionId =
                    tactics.getPositionIdForPlayer(
                        starterKey
                    );


                const position =
                    tactics.getPosition(
                        starterKey
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        starter,
                        position
                    );


                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =

                    "⚽ " +
                    starter.nom +
                    " — " +
                    position +
                    " ⭐ " +
                    effectiveRating;


                button.addEventListener(
                    "click",
                    () => {

                        this.reserveToStarter(
                            tactics,
                            manager,
                            player,
                            starter,
                            positionId
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
    /* RÉSERVISTE → TITULAIRE */
    /* ================================================= */

    reserveToStarter(
        tactics,
        manager,
        reserve,
        starter,
        positionId
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
            positionId;


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


        const starterKey =
            tactics.getPlayerKey(
                starter
            );


        const positionId =
            tactics.getPositionIdForPlayer(
                starterKey
            );


        tactics.substitutes.forEach(
            substitute => {

                const button =
                    document.createElement(
                        "button"
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        substitute,
                        position
                    );


                const positionStatus =
                    tactics.getPositionStatus(
                        substitute,
                        position
                    );


                button.textContent =
                    substitute.prenom +
                    " " +
                    substitute.nom +
                    " ⭐ " +
                    effectiveRating +
                    " " +
                    this.getPositionStatusLabel(
                        positionStatus
                    );


                button.addEventListener(
                    "click",
                    () => {

                        this.replacePlayer(
                            tactics,
                            manager,
                            starter,
                            substitute,
                            positionId
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


        const positionStatus =
            tactics.getPositionStatus(
                player,
                position
            );


        const effectiveRating =
            tactics.getEffectiveRating(
                player,
                position
            );


        const positionPenalty =
            tactics.getPositionPenalty(
                player,
                position
            );


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
                ${effectiveRating}
            </p>

            <p>
                ${this.getPositionStatusLabel(
                    positionStatus
                )}
            </p>

            ${
                positionPenalty < 0
                ? `<p>⚠️ Pénalité : ${positionPenalty}</p>`
                : ""
            }

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
    /* LABEL POSITION */
    /* ================================================= */

    getPositionStatusLabel(
        status
    ) {

        switch (status) {

            case "green":

                return "🟢 Poste naturel";


            case "yellow":

                return "🟡 Mauvais poste dans la ligne";


            case "red":

                return "🔴 Mauvaise ligne";


            default:

                return "⚪ Position inconnue";

        }

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

                const starterKey =
                    tactics.getPlayerKey(
                        starter
                    );


                const positionId =
                    tactics.getPositionIdForPlayer(
                        starterKey
                    );


                const position =
                    tactics.getPosition(
                        starterKey
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        starter,
                        position
                    );


                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =

                    "⚽ " +
                    starter.nom +
                    " — " +
                    position +
                    " ⭐ " +
                    effectiveRating;


                button.addEventListener(
                    "click",
                    () => {

                        this.reserveToStarter(
                            tactics,
                            manager,
                            player,
                            starter,
                            positionId
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
    /* RÉSERVISTE → TITULAIRE */
    /* ================================================= */

    reserveToStarter(
        tactics,
        manager,
        reserve,
        starter,
        positionId
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
            positionId;


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


        const starterKey =
            tactics.getPlayerKey(
                starter
            );


        const positionId =
            tactics.getPositionIdForPlayer(
                starterKey
            );


        tactics.substitutes.forEach(
            substitute => {

                const button =
                    document.createElement(
                        "button"
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        substitute,
                        position
                    );


                const positionStatus =
                    tactics.getPositionStatus(
                        substitute,
                        position
                    );


                button.textContent =
                    substitute.prenom +
                    " " +
                    substitute.nom +
                    " ⭐ " +
                    effectiveRating +
                    " " +
                    this.getPositionStatusLabel(
                        positionStatus
                    );


                button.addEventListener(
                    "click",
                    () => {

                        this.replacePlayer(
                            tactics,
                            manager,
                            starter,
                            substitute,
                            positionId
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
    /* REMPLACEMENT */
    /* ================================================= */

    replacePlayer(
        tactics,
        manager,
        starter,
        substitute,
        positionId
    ) {

        if (
            !starter ||
            !substitute
        ) {

            console.error(
                "❌ Remplacement impossible."
            );

            return;

        }


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


        const oldPositionId =
            tactics.getPositionIdForPlayer(
                starterKey
            );


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
            positionId ||
            oldPositionId;


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


        const positionStatus =
            tactics.getPositionStatus(
                player,
                position
            );


        const effectiveRating =
            tactics.getEffectiveRating(
                player,
                position
            );


        const positionPenalty =
            tactics.getPositionPenalty(
                player,
                position
            );


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
                ${effectiveRating}
            </p>

            <p>
                ${this.getPositionStatusLabel(
                    positionStatus
                )}
            </p>

            ${
                positionPenalty < 0
                ? `<p>⚠️ Pénalité : ${positionPenalty}</p>`
                : ""
            }

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
    /* LABEL POSITION */
    /* ================================================= */

    getPositionStatusLabel(
        status
    ) {

        switch (status) {

            case "green":

                return "🟢 Poste naturel";


            case "yellow":

                return "🟡 Mauvais poste dans la ligne";


            case "red":

                return "🔴 Mauvaise ligne";


            default:

                return "⚪ Position inconnue";

        }

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

                const starterKey =
                    tactics.getPlayerKey(
                        starter
                    );


                const positionId =
                    tactics.getPositionIdForPlayer(
                        starterKey
                    );


                const position =
                    tactics.getPosition(
                        starterKey
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        starter,
                        position
                    );


                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =

                    "⚽ " +
                    starter.nom +
                    " — " +
                    position +
                    " ⭐ " +
                    effectiveRating;


                button.addEventListener(
                    "click",
                    () => {

                        this.reserveToStarter(
                            tactics,
                            manager,
                            player,
                            starter,
                            positionId
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
    /* RÉSERVISTE → TITULAIRE */
    /* ================================================= */

    reserveToStarter(
        tactics,
        manager,
        reserve,
        starter,
        positionId
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
            positionId;


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


        const starterKey =
            tactics.getPlayerKey(
                starter
            );


        const positionId =
            tactics.getPositionIdForPlayer(
                starterKey
            );


        tactics.substitutes.forEach(
            substitute => {

                const button =
                    document.createElement(
                        "button"
                    );


                const effectiveRating =
                    tactics.getEffectiveRating(
                        substitute,
                        position
                    );


                const positionStatus =
                    tactics.getPositionStatus(
                        substitute,
                        position
                    );


                button.textContent =
                    substitute.prenom +
                    " " +
                    substitute.nom +
                    " ⭐ " +
                    effectiveRating +
                    " " +
                    this.getPositionStatusLabel(
                        positionStatus
                    );


                button.addEventListener(
                    "click",
                    () => {

                        this.replacePlayer(
                            tactics,
                            manager,
                            starter,
                            substitute,
                            positionId
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
    /* INSERTION MENU */
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
    /* SUPPRIMER MENU */
    /* ================================================= */

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
    /* TROUVER JOUEUR SUR UN SLOT */
    /* ================================================= */

    findPlayerAtPosition(
        positionId,
        tactics
    ) {

        return tactics.lineup.find(
            player => {

                const key =
                    tactics.getPlayerKey(
                        player
                    );


                return (
                    tactics.getPositionIdForPlayer(
                        key
                    ) ===
                    positionId
                );

            }
        ) || null;

    }


    /* ================================================= */
    /* POSITION LA PLUS PROCHE */
    /* ================================================= */

    findNearestPosition(
        clientX,
        clientY,
        formation,
        tactics
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


        const slots =
            tactics.getFormationSlots(
                formation
            );


        slots.forEach(
            slot => {

                const distance =
                    Math.sqrt(

                        Math.pow(
                            x -
                            slot.x,
                            2
                        )

                        +

                        Math.pow(
                            y -
                            slot.y,
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
                        slot;

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

                    const button =
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


                    if (
                        formation.nom ===
                        tactics.getFormation()
                    ) {

                        button.disabled =
                            true;

                    }

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

                    const button =
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


                    if (
                        style.nom ===
                        tactics.getCurrentTactic()
                    ) {

                        button.disabled =
                            true;

                    }

                }
            );

    }

}
