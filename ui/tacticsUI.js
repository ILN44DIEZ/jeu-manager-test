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

        // Les joueurs blessés restent visibles dans la composition et sur le banc.
        // Leur indisponibilité est signalée par 🤕 ; le lancement du match reste bloqué
        // par la validation dédiée tant qu'un joueur blessé est sélectionné.

        this.ui.showTitle(
            "🧠 Tactiques"
        );

        // Résumé compact : formation/style et titulaires/remplaçants sur deux lignes.
        const summary = document.createElement("div");
        summary.style.display = "grid";
        summary.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        summary.style.gap = "8px 12px";
        summary.style.width = "100%";
        summary.style.maxWidth = "620px";
        summary.style.margin = "0 auto 16px";
        summary.style.boxSizing = "border-box";
        summary.style.textAlign = "left";

        const addSummaryItem = text => {
            const item = document.createElement("div");
            item.textContent = text;
            item.style.minWidth = "0";
            item.style.padding = "4px 2px";
            item.style.fontSize = "clamp(14px, 3.8vw, 20px)";
            item.style.lineHeight = "1.35";
            item.style.overflowWrap = "anywhere";
            summary.appendChild(item);
        };

        addSummaryItem("📐 Formation : " + tactics.getFormation());
        addSummaryItem("⚙️ Style : " + tactics.getCurrentTactic());
        addSummaryItem("⚽ Titulaires : " + tactics.lineup.length + " / 11");
        addSummaryItem("🪑 Remplaçants : " + tactics.substitutes.length + " / 9");

        this.container.appendChild(summary);

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

                if (this.isGoalkeeperSlot(slot.poste)) {
                    player.classList.add("goalkeeper-slot");
                }


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
                        "</span>" +
                        this.getPlayerConditionMarkup(selectedPlayer);


                    /*
                     * COULEUR
                     */

                    const wrongGoalkeeperPosition =
                        this.isGoalkeeper(selectedPlayer) !== this.isGoalkeeperSlot(slot.poste);

                    this.applyPositionColor(
                        player,
                        wrongGoalkeeperPosition ? "red" : positionStatus
                    );

                    if (wrongGoalkeeperPosition) {
                        player.title = this.isGoalkeeper(selectedPlayer)
                            ? "⚠️ Un gardien ne peut pas jouer à ce poste de champ."
                            : "⚠️ Un joueur de champ ne peut pas jouer gardien.";
                    }


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


                            this.openPlayerProfile(selectedPlayer, manager, () => this.show(tactics, manager));

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

    isGoalkeeper(player) {
        const position = String(player?.poste || player?.position || "").trim().toUpperCase();
        return ["GB", "GK", "G", "GARDIEN", "GOALKEEPER"].includes(position);
    }

    isGoalkeeperSlot(position) {
        return ["GB", "GK", "G", "GARDIEN", "GOALKEEPER"].includes(String(position || "").trim().toUpperCase());
    }

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

        element.style.webkitUserSelect = "none";
        element.style.userSelect = "none";
        element.style.webkitTouchCallout = "none";
        element.style.touchAction = "none";
        element.setAttribute("draggable", "false");
        element.addEventListener("selectstart", event => event.preventDefault());
        element.addEventListener("dragstart", event => event.preventDefault());


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

                    // Clone flottant qui suit le doigt, même quand la carte d'origine est hors écran.
                    this.dragGhost = element.cloneNode(true);
                    this.dragGhost.style.position = "fixed";
                    this.dragGhost.style.left = event.clientX + "px";
                    this.dragGhost.style.top = event.clientY + "px";
                    this.dragGhost.style.width = Math.min(element.getBoundingClientRect().width, window.innerWidth - 24) + "px";
                    this.dragGhost.style.margin = "0";
                    this.dragGhost.style.zIndex = "99999";
                    this.dragGhost.style.opacity = "0.92";
                    this.dragGhost.style.pointerEvents = "none";
                    this.dragGhost.style.transform = "translate(-50%, -50%) scale(1.04)";
                    this.dragGhost.style.boxShadow = "0 8px 24px rgba(0,0,0,0.45)";
                    document.body.appendChild(this.dragGhost);
                    element.style.opacity = "0.28";

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

                    // Le clone flottant suit le doigt ; le joueur original reste sur le terrain jusqu'au dépôt.

                }

                if (this.isDragging && this.dragGhost) {
                    this.dragGhost.style.left = event.clientX + "px";
                    this.dragGhost.style.top = event.clientY + "px";

                    // Défilement automatique lorsque le doigt approche du haut ou du bas de l'écran.
                    const edge = 100;
                    const speed = 14;
                    if (event.clientY > window.innerHeight - edge) {
                        window.scrollBy({ top: speed, left: 0, behavior: "auto" });
                    } else if (event.clientY < edge) {
                        window.scrollBy({ top: -speed, left: 0, behavior: "auto" });
                    }
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

        // Éviter la sélection de texte sur iOS pendant les gestes tactiles.
        element.style.webkitUserSelect = "none";
        element.style.userSelect = "none";
        element.style.webkitTouchCallout = "none";
        element.style.touchAction = "none";
        element.style.cursor = "grab";
        element.setAttribute("draggable", "false");
        element.addEventListener("selectstart", event => event.preventDefault());
        element.addEventListener("dragstart", event => event.preventDefault());


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

                this.dragGhost = null;
                this.dragOriginalOpacity = element.style.opacity;

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

                    // Clone flottant qui suit le doigt, même quand la carte d'origine est hors écran.
                    this.dragGhost = element.cloneNode(true);
                    this.dragGhost.style.position = "fixed";
                    this.dragGhost.style.left = event.clientX + "px";
                    this.dragGhost.style.top = event.clientY + "px";
                    this.dragGhost.style.width = Math.min(element.getBoundingClientRect().width, window.innerWidth - 24) + "px";
                    this.dragGhost.style.margin = "0";
                    this.dragGhost.style.zIndex = "99999";
                    this.dragGhost.style.opacity = "0.92";
                    this.dragGhost.style.pointerEvents = "none";
                    this.dragGhost.style.transform = "translate(-50%, -50%) scale(1.04)";
                    this.dragGhost.style.boxShadow = "0 8px 24px rgba(0,0,0,0.45)";
                    document.body.appendChild(this.dragGhost);
                    element.style.opacity = "0.28";

                    try {

                        element.setPointerCapture(
                            event.pointerId
                        );

                    } catch (error) {}

                }

                if (dragging && this.dragGhost) {
                    this.dragGhost.style.left = event.clientX + "px";
                    this.dragGhost.style.top = event.clientY + "px";

                    // Défilement automatique lorsque le doigt approche du haut ou du bas de l'écran.
                    const edge = 85;
                    const speed = 18;
                    if (event.clientY > window.innerHeight - edge) {
                        window.scrollBy(0, speed);
                    } else if (event.clientY < edge) {
                        window.scrollBy(0, -speed);
                    }
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

            // Emplacement vide : promouvoir le remplaçant au onze.
            // Il faut d'abord le retirer du banc, sinon addStarter le refuse
            // car un même joueur ne peut pas être titulaire et remplaçant.
            const playerKey = tactics.getPlayerKey(player);
            if (tactics.lineup.length < 11) {
                tactics.removeSubstitute(playerKey);
                const added = tactics.addStarter(player, target.positionId);
                if (!added) {
                    tactics.addSubstitute(player);
                    this.showMessageTemporary("Impossible d'ajouter ce joueur à cet emplacement.");
                }
            } else {
                this.showMessageTemporary("Les 11 places de titulaires sont déjà occupées.");
            }

            this.resetDrag();
            this.show(tactics, manager);
            return;

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

    isPlayerInjured(player) {
        const days = Math.max(0, Number(player?.joursBlessure ?? player?.injuryDays) || 0);
        const injury = String(player?.blessure ?? player?.injury ?? "").trim().toLowerCase();
        return days > 0 || (injury !== "" && !["false", "aucune", "aucun", "null", "0"].includes(injury));
    }

    getCanonicalPlayer(player) {
        const roster = (typeof game !== "undefined" && Array.isArray(game.players))
            ? game.players
            : (Array.isArray(this.ui?.game?.players) ? this.ui.game.players : []);
        const normalize = value => String(value || "").normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
        const fullName = value => normalize([
            value?.prenom ?? value?.firstName ?? value?.firstname ?? "",
            value?.nom ?? value?.lastName ?? value?.lastname ?? ""
        ].filter(Boolean).join(" ") || value?.name || value?.fullName || value?.nomComplet);
        return roster.find(candidate =>
            (player?.id != null && candidate?.id != null && String(player.id) === String(candidate.id)) ||
            (fullName(player) && fullName(player) === fullName(candidate))
        ) || player || {};
    }

    getPlayerConditionMarkup(player) {
        const current = this.getCanonicalPlayer(player);
        if (this.isPlayerInjured(current)) {
            return '<div class="tactics-condition injured" aria-label="Joueur blessé">🤕</div>';
        }
        const readNumber = (value, fallback) => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback;
        };
        const form = readNumber(current.forme ?? current.form ?? current.moral, 70);
        const fatigue = readNumber(current.fatigue ?? current.currentFatigue, 0);
        return '<div class="tactics-condition" aria-label="Forme et fatigue"><span class="condition-form">▰ ' + form + '</span><span class="condition-fatigue">♥ ' + fatigue + '</span></div>';
    }

    openPlayerProfile(player, manager, onBack) {
        if (this.ui?.playerUI?.showProfile) {
            this.ui.playerUI.showProfile(player, manager, onBack, { backLabel: "⬅️ Retour aux tactiques" });
        } else {
            this.showPlayerActions(this.ui.tactics, manager, player, player.poste);
        }
    }

    createPlayerCard(player, type, tactics, manager) {
        const card = document.createElement("div");
        card.className = "tactics-player-card";
        card.dataset.playerKey = tactics.getPlayerKey(player);
        card.dataset.playerType = type;
        card.dataset.wasDragged = "false";

        const name = document.createElement("strong");
        name.className = "tactics-card-name";
        name.textContent = [player.prenom, player.nom].filter(Boolean).join(" ");

        const position = document.createElement("span");
        position.className = "tactics-card-position";
        position.textContent = player.poste || player.position || "—";

        const rating = document.createElement("div");
        rating.className = "tactics-card-rating";
        rating.textContent = "⭐ " + (player.note ?? player.rating ?? "—");
        card.append(name, position, rating);

        const condition = document.createElement("div");
        condition.className = "tactics-condition tactics-card-condition";
        const current = this.getCanonicalPlayer(player);
        if (this.isPlayerInjured(current)) {
            condition.classList.add("injured");
            condition.setAttribute("aria-label", "Joueur blessé");
            condition.textContent = "🤕";
        } else {
            const readNumber = (value, fallback) => {
                const parsed = Number(value);
                return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback;
            };
            condition.setAttribute("aria-label", "Forme et fatigue");
            const formValue = document.createElement("span");
            formValue.className = "condition-form";
            formValue.textContent = "▰ " + readNumber(current.forme ?? current.form ?? current.moral, 70);
            const fatigueValue = document.createElement("span");
            fatigueValue.className = "condition-fatigue";
            fatigueValue.textContent = "♥ " + readNumber(current.fatigue ?? current.currentFatigue, 0);
            condition.append(formValue, fatigueValue);
        }
        card.appendChild(condition);

        Object.assign(condition.style, {
            position: "static", display: "flex", flexDirection: "row",
            justifyContent: "center", alignItems: "center", alignSelf: "stretch",
            gap: "7px", width: "100%", minHeight: "18px", margin: "2px 0 0",
            padding: "3px 4px", boxSizing: "border-box", borderRadius: "5px",
            background: "rgba(10, 45, 20, 0.88)", color: "#ffffff",
            fontSize: "12px", fontWeight: "700", lineHeight: "1.1",
            whiteSpace: "nowrap", overflow: "visible"
        });
        if (condition.classList.contains("injured")) {
            Object.assign(condition.style, { display: "block", background: "transparent", fontSize: "15px", padding: "0" });
        }
        card.style.touchAction = "none";
        this.enableCardDrag(card, player, type, tactics, manager);
        card.addEventListener("click", () => {
            if (card.dataset.wasDragged === "true") {
                card.dataset.wasDragged = "false";
                return;
            }
            this.openPlayerProfile(player, manager, () => this.show(tactics, manager));
        });
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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";

        // Deux cartes par ligne, y compris sur mobile, en gardant toutes les infos.
        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";

        // Même présentation que le banc : deux réservistes par ligne.
        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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
                ⚽ ${player.prenom ? player.prenom + " " : ""}
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
                🪑 ${player.prenom ? player.prenom + " " : ""}
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
                📋 ${player.prenom ? player.prenom + " " : ""}
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


        tactics.substitutes.filter(substitute => {
            const days = Math.max(0, Number(substitute.joursBlessure ?? substitute.injuryDays) || 0);
            const injury = String(substitute.blessure ?? substitute.injury ?? "").trim().toLowerCase();
            return days <= 0 && (injury === "" || ["false", "aucune", "aucun", "null", "0"].includes(injury));
        }).forEach(
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

            <strong class="tactics-card-name">
                ${player.prenom ? player.prenom + " " : ""}
                ${player.nom}
            </strong>

            <span class="tactics-card-position">
                ${player.poste || player.position || "—"}
            </span>

            <div class="tactics-card-rating">
                ⭐ ${player.note ?? player.rating ?? "—"}
            </div>

        `;

        // Les indicateurs sont ajoutés sous la note, sur une seule ligne.
        // Cette méthode est définie plusieurs fois dans le fichier : c'est la dernière
        // définition qui est exécutée, elle doit donc elle aussi les afficher.
        const conditionTemplate = document.createElement("div");
        conditionTemplate.innerHTML = this.getPlayerConditionMarkup(player);
        if (conditionTemplate.firstElementChild) {
            conditionTemplate.firstElementChild.classList.add("tactics-card-condition");
            card.appendChild(conditionTemplate.firstElementChild);
        }


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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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
                ⚽ ${player.prenom ? player.prenom + " " : ""}
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
                🪑 ${player.prenom ? player.prenom + " " : ""}
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
                📋 ${player.prenom ? player.prenom + " " : ""}
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
                ${player.prenom ? player.prenom + " " : ""}
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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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
                ⚽ ${player.prenom ? player.prenom + " " : ""}
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
                🪑 ${player.prenom ? player.prenom + " " : ""}
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
                📋 ${player.prenom ? player.prenom + " " : ""}
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
                ${player.prenom ? player.prenom + " " : ""}
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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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

        zone.style.display = "grid";
        zone.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
        zone.style.alignItems = "start";
        zone.style.gap = "10px";
        zone.style.width = "100%";
        zone.style.boxSizing = "border-box";


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
                ⚽ ${player.prenom ? player.prenom + " " : ""}
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
                🪑 ${player.prenom ? player.prenom + " " : ""}
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
                📋 ${player.prenom ? player.prenom + " " : ""}
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

        if (this.dragGhost && this.dragGhost.parentNode) {
            this.dragGhost.parentNode.removeChild(this.dragGhost);
        }
        this.dragGhost = null;

        if (this.draggingElement) {
            this.draggingElement.classList.remove("dragging");
            if (this.dragOriginalOpacity !== undefined) {
                this.draggingElement.style.opacity = this.dragOriginalOpacity;
            }
            this.draggingElement.style.cursor = "grab";
        }
        this.dragOriginalOpacity = undefined;

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



    // Les joueurs ouvrent leur fiche : aucun menu de remplacement par clic.
    showPlayerActions(tactics, manager, player) {
        this.openPlayerProfile(player, manager, () => this.show(tactics, manager));
    }

    showSubstituteActions(tactics, manager, player) {
        this.openPlayerProfile(player, manager, () => this.show(tactics, manager));
    }

    showReserveActions(tactics, manager, player) {
        this.openPlayerProfile(player, manager, () => this.show(tactics, manager));
    }

    showReplacementList() {
        // Les changements d'effectif se font uniquement par glisser-déposer.
        this.removeActionMenu();
    }
}
