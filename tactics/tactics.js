class Tactics {

    constructor(dataManager = null) {

        this.dataManager =
            dataManager;


        this.formation =
            "4-3-3";


        this.currentTactic =
            "Équilibrée";


        this.lineup = [];


        this.substitutes = [];


        this.roles = {};


        /*
         * positions :
         *
         * playerKey -> slotId
         *
         * Exemple :
         *
         * joueur123 -> DC_1
         * joueur456 -> DC_2
         */

        this.positions = {};


        this.style = {

            mentality:
                "Équilibrée",

            pressing:
                50,

            tempo:
                50,

            possession:
                50

        };

    }



    /* ================================================= */
    /* DATA MANAGER */
    /* ================================================= */

    setDataManager(
        dataManager
    ) {

        this.dataManager =
            dataManager;

    }



    /* ================================================= */
    /* CLÉ JOUEUR */
    /* ================================================= */

    getPlayerKey(player) {

        if (!player) {

            return "";

        }


        if (
            player.id !== undefined &&
            player.id !== null
        ) {

            return String(
                player.id
            );

        }


        return (

            String(
                player.prenom || ""
            ) +

            "_" +

            String(
                player.nom || ""
            ) +

            "_" +

            String(
                player.numero || ""
            )

        );

    }



    /* ================================================= */
    /* ID UNIQUE D'UN EMPLACEMENT */
    /* ================================================= */

    getPositionId(
        poste,
        index,
        formation = null
    ) {

        if (!poste) {

            return "";

        }


        /*
         * Si les données de formation possèdent
         * déjà un id, on l'utilise.
         */

        if (
            poste.id !== undefined &&
            poste.id !== null
        ) {

            return String(
                poste.id
            );

        }


        /*
         * Sinon on génère un identifiant
         * unique à partir du poste.
         */

        const position =
            String(
                poste.poste || "POS"
            )
            .toUpperCase()
            .trim();


        return (
            position +
            "_" +
            (
                Number(index) + 1
            )
        );

    }



    /* ================================================= */
    /* OBTENIR LES EMPLACEMENTS DE FORMATION */
    /* ================================================= */

    getFormationSlots(
        formation = null
    ) {

        const currentFormation =
            formation ||
            this.getFormationData();


        if (
            !currentFormation ||
            !Array.isArray(
                currentFormation.postes
            )
        ) {

            return [];

        }


        return currentFormation.postes.map(
            (poste, index) => {

                return {

                    id:
                        this.getPositionId(
                            poste,
                            index,
                            currentFormation
                        ),

                    poste:
                        poste.poste,

                    x:
                        poste.x,

                    y:
                        poste.y,

                    index:
                        index

                };

            }
        );

    }



    /* ================================================= */
    /* FORMATION */
    /* ================================================= */

    setFormation(
        formation
    ) {

        if (!this.dataManager) {

            this.formation =
                formation;

            return true;

        }


        const formationData =
            this.dataManager.getFormation(
                formation
            );


        if (!formationData) {

            console.error(
                "❌ Formation introuvable :",
                formation
            );

            return false;

        }


        this.formation =
            formation;


        /*
         * On ne détruit PAS la composition.
         *
         * On conserve les joueurs,
         * puis on replace chaque joueur
         * sur un emplacement valide.
         */

        this.reorganizePositions();


        return true;

    }



    getFormation() {

        return this.formation;

    }



    getFormationData() {

        if (!this.dataManager) {

            return null;

        }


        return this.dataManager.getFormation(
            this.formation
        );

    }



    getAvailableFormations() {

        if (!this.dataManager) {

            return [];

        }


        return this.dataManager.getAllFormations();

    }



    /* ================================================= */
    /* TACTIQUES */
    /* ================================================= */

    setTactic(
        name
    ) {

        if (!this.dataManager) {

            return false;

        }


        const tactic =
            this.dataManager.getTactic(
                name
            );


        if (!tactic) {

            return false;

        }


        this.currentTactic =
            tactic.nom;


        this.style.mentality =
            tactic.mentalite;


        this.style.pressing =
            tactic.pressing;


        this.style.tempo =
            tactic.tempo;


        this.style.possession =
            tactic.possession;


        return true;

    }



    getCurrentTactic() {

        return this.currentTactic;

    }



    getAvailableTactics() {

        if (!this.dataManager) {

            return [];

        }


        return this.dataManager.getAllTactics();

    }



    /* ================================================= */
    /* INITIALISATION EFFECTIF */
    /* ================================================= */

    initializeSquad(
        players
    ) {

        this.lineup = [];


        this.substitutes = [];


        this.positions = {};


        this.roles = {};


        if (
            !Array.isArray(players) ||
            players.length === 0
        ) {

            return;

        }


        const formation =
            this.getFormationData();


        if (!formation) {

            console.error(
                "❌ Formation introuvable."
            );

            return;

        }


        const slots =
            this.getFormationSlots(
                formation
            );


        const availablePlayers =
            [...players];


        /* ================================================= */
        /* 11 TITULAIRES */
        /* ================================================= */

        slots.forEach(
            slot => {

                if (
                    this.lineup.length >= 11
                ) {

                    return;

                }


                /*
                 * Chercher d'abord un joueur
                 * ayant exactement le poste.
                 */

                let index =
                    availablePlayers.findIndex(
                        player =>
                            String(
                                player.poste || ""
                            )
                            .toUpperCase()
                            ===
                            String(
                                slot.poste || ""
                            )
                            .toUpperCase()
                    );


                /*
                 * Sinon chercher le meilleur
                 * joueur disponible.
                 */

                if (
                    index === -1
                ) {

                    index =
                        this.getBestPlayerIndex(
                            availablePlayers
                        );

                }


                if (
                    index === -1
                ) {

                    return;

                }


                const player =
                    availablePlayers[
                        index
                    ];


                this.lineup.push(
                    player
                );


                const playerKey =
                    this.getPlayerKey(
                        player
                    );


                this.positions[
                    playerKey
                ] =
                    slot.id;


                availablePlayers.splice(
                    index,
                    1
                );

            }
        );


        /* ================================================= */
        /* COMPLÉTER SI BESOIN */
        /* ================================================= */

        while (
            this.lineup.length < 11 &&
            availablePlayers.length > 0
        ) {

            const player =
                availablePlayers.shift();


            const slot =
                slots[
                    this.lineup.length
                ];


            this.lineup.push(
                player
            );


            if (slot) {

                this.positions[
                    this.getPlayerKey(
                        player
                    )
                ] =
                    slot.id;

            }

        }


        /* ================================================= */
        /* 9 REMPLAÇANTS */
        /* ================================================= */

        while (
            this.substitutes.length < 9 &&
            availablePlayers.length > 0
        ) {

            this.substitutes.push(
                availablePlayers.shift()
            );

        }


        console.log(
            "⚽ Composition initiale :",
            this.lineup.length,
            "titulaires /",
            this.substitutes.length,
            "remplaçants /",
            availablePlayers.length,
            "réservistes"
        );

    }



    /* ================================================= */
    /* MEILLEUR JOUEUR */
    /* ================================================= */

    getBestPlayerIndex(
        players
    ) {

        if (
            !players ||
            players.length === 0
        ) {

            return -1;

        }


        let bestIndex =
            0;


        for (
            let i = 1;
            i < players.length;
            i++
        ) {

            const currentNote =
                Number(
                    players[i].note
                ) || 0;


            const bestNote =
                Number(
                    players[bestIndex].note
                ) || 0;


            if (
                currentNote >
                bestNote
            ) {

                bestIndex =
                    i;

            }

        }


        return bestIndex;

    }



    /* ================================================= */
    /* RÉORGANISER LES POSITIONS */
    /* ================================================= */

    reorganizePositions() {

        const slots =
            this.getFormationSlots();


        if (
            slots.length === 0
        ) {

            return;

        }


        const usedSlots =
            new Set();


        const newPositions =
            {};


        /*
         * Première priorité :
         * conserver le même poste
         * lorsque cela est possible.
         */

        this.lineup.forEach(
            player => {

                const key =
                    this.getPlayerKey(
                        player
                    );


                const oldSlotId =
                    this.positions[
                        key
                    ];


                const oldSlot =
                    slots.find(
                        slot =>
                            slot.id ===
                            oldSlotId
                    );


                if (!oldSlot) {

                    return;

                }


                if (
                    !usedSlots.has(
                        oldSlot.id
                    )
                ) {

                    newPositions[
                        key
                    ] =
                        oldSlot.id;


                    usedSlots.add(
                        oldSlot.id
                    );

                }

            }
        );


        /*
         * Deuxième priorité :
         * attribuer les places restantes.
         */

        this.lineup.forEach(
            player => {

                const key =
                    this.getPlayerKey(
                        player
                    );


                if (
                    newPositions[key]
                ) {

                    return;

                }


                const playerPoste =
                    String(
                        player.poste || ""
                    )
                    .toUpperCase()
                    .trim();


                const availableSlot =
                    slots.find(
                        slot => {

                            if (
                                usedSlots.has(
                                    slot.id
                                )
                            ) {

                                return false;

                            }


                            return (
                                String(
                                    slot.poste || ""
                                )
                                .toUpperCase()
                                .trim()
                                ===
                                playerPoste
                            );

                        }
                    );


                if (
                    availableSlot
                ) {

                    newPositions[
                        key
                    ] =
                        availableSlot.id;


                    usedSlots.add(
                        availableSlot.id
                    );

                }

            }
        );


        /*
         * Dernière solution :
         * remplir les places libres.
         */

        this.lineup.forEach(
            player => {

                const key =
                    this.getPlayerKey(
                        player
                    );


                if (
                    newPositions[key]
                ) {

                    return;

                }


                const freeSlot =
                    slots.find(
                        slot =>
                            !usedSlots.has(
                                slot.id
                            )
                    );


                if (
                    freeSlot
                ) {

                    newPositions[
                        key
                    ] =
                        freeSlot.id;


                    usedSlots.add(
                        freeSlot.id
                    );

                }

            }
        );


        this.positions =
            newPositions;

    }



    /* ================================================= */
    /* TITULAIRES */
    /* ================================================= */

    addStarter(
        player,
        position = null
    ) {

        if (
            this.lineup.length >= 11
        ) {

            return false;

        }


        const key =
            this.getPlayerKey(
                player
            );


        const alreadyStarter =
            this.lineup.some(
                starter =>
                    this.getPlayerKey(
                        starter
                    ) ===
                    key
            );


        if (
            alreadyStarter
        ) {

            return false;

        }


        const alreadySubstitute =
            this.substitutes.some(
                substitute =>
                    this.getPlayerKey(
                        substitute
                    ) ===
                    key
            );


        if (
            alreadySubstitute
        ) {

            return false;

        }


        this.lineup.push(
            player
        );


        if (position) {

            this.setPosition(
                key,
                position
            );

        }


        return true;

    }



    removeStarter(
        playerId
    ) {

        const key =
            String(
                playerId
            );


        this.lineup =
            this.lineup.filter(
                player =>
                    this.getPlayerKey(
                        player
                    ) !==
                    key
            );


        delete this.positions[
            key
        ];

    }



    /* ================================================= */
    /* POSITION */
    /* ================================================= */

    setPosition(
        playerId,
        position
    ) {

        const key =
            String(
                playerId
            );


        /*
         * Si on reçoit un slotId,
         * on l'utilise directement.
         */

        const slots =
            this.getFormationSlots();


        const slot =
            slots.find(
                current =>
                    current.id ===
                    String(position)
            );


        if (
            slot
        ) {

            this.positions[key] =
                slot.id;

            return;

        }


        /*
         * Compatibilité avec l'ancien système :
         * si on reçoit simplement "DC",
         * trouver une place libre de ce poste.
         */

        const positionText =
            String(
                position || ""
            )
            .toUpperCase()
            .trim();


        const playerCurrentSlot =
            this.positions[key];


        const freeSlot =
            slots.find(
                current => {

                    if (
                        current.poste
                        .toUpperCase()
                        .trim()
                        !==
                        positionText
                    ) {

                        return false;

                    }


                    /*
                     * Autoriser le slot actuel.
                     */

                    if (
                        current.id ===
                        playerCurrentSlot
                    ) {

                        return true;

                    }


                    return !Object.values(
                        this.positions
                    ).includes(
                        current.id
                    );

                }
            );


        if (
            freeSlot
        ) {

            this.positions[key] =
                freeSlot.id;

        }

    }



    /* ================================================= */
    /* ID DE POSITION DU JOUEUR */
    /* ================================================= */

    getPositionIdForPlayer(
        playerId
    ) {

        const key =
            String(
                playerId
            );


        return (
            this.positions[key] ||
            null
        );

    }



    /* ================================================= */
    /* POSTE DE LA POSITION */
    /* ================================================= */

    getPosition(
        playerId
    ) {

        const slotId =
            this.getPositionIdForPlayer(
                playerId
            );


        if (!slotId) {

            return "Libre";

        }


        const slots =
            this.getFormationSlots();


        const slot =
            slots.find(
                current =>
                    current.id ===
                    slotId
            );


        if (!slot) {

            return "Libre";

        }


        return slot.poste;

    }



    /* ================================================= */
    /* OBTENIR LE SLOT */
    /* ================================================= */

    getPlayerSlot(
        playerId
    ) {

        const slotId =
            this.getPositionIdForPlayer(
                playerId
            );


        if (!slotId) {

            return null;

        }


        const slots =
            this.getFormationSlots();


        return (
            slots.find(
                slot =>
                    slot.id ===
                    slotId
            ) ||
            null
        );

    }



    /* ================================================= */
    /* REMPLAÇANTS */
    /* ================================================= */

    addSubstitute(
        player
    ) {

        if (
            this.substitutes.length >= 9
        ) {

            return false;

        }


        const key =
            this.getPlayerKey(
                player
            );


        const alreadyStarter =
            this.lineup.some(
                starter =>
                    this.getPlayerKey(
                        starter
                    ) ===
                    key
            );


        if (
            alreadyStarter
        ) {

            return false;

        }


        const alreadySubstitute =
            this.substitutes.some(
                substitute =>
                    this.getPlayerKey(
                        substitute
                    ) ===
                    key
            );


        if (
            alreadySubstitute
        ) {

            return false;

        }


        this.substitutes.push(
            player
        );


        return true;

    }



    removeSubstitute(
        playerId
    ) {

        const key =
            String(
                playerId
            );


        this.substitutes =
            this.substitutes.filter(
                player =>
                    this.getPlayerKey(
                        player
                    ) !==
                    key
            );

    }



    /* ================================================= */
    /* POSITIONNEMENT */
    /* ================================================= */

    getPositionLine(
        position
    ) {

        if (!position) {

            return "unknown";

        }


        const poste =
            String(
                position
            )
            .toUpperCase()
            .trim();


        const defense =
            [

                "GB",
                "GK",

                "DG",
                "DD",

                "DC",
                "DCD",
                "DCG",

                "DLD",
                "DLG",

                "LIB",
                "LATERAL",
                "LAT"

            ];


        if (
            defense.includes(
                poste
            )
        ) {

            return "defense";

        }


        const midfield =
            [

                "MDC",
                "MC",
                "MCD",
                "MCG",

                "MOC",
                "MOCD",
                "MOCG",

                "MG",
                "MD",

                "MO",
                "MIL"

            ];


        if (
            midfield.includes(
                poste
            )
        ) {

            return "midfield";

        }


        const attack =
            [

                "AG",
                "AD",

                "BU",
                "AC",
                "AT",

                "ATT",
                "SA",
                "BT"

            ];


        if (
            attack.includes(
                poste
            )
        ) {

            return "attack";

        }


        return "unknown";

    }



    /* ================================================= */
    /* STATUT DU POSTE */
    /* ================================================= */

    getPositionStatus(
        player,
        position
    ) {

        if (
            !player ||
            !position
        ) {

            return "red";

        }


        const naturalPosition =
            String(
                player.poste || ""
            )
            .toUpperCase()
            .trim();


        const currentPosition =
            String(
                position || ""
            )
            .toUpperCase()
            .trim();


        if (
            naturalPosition ===
            currentPosition
        ) {

            return "green";

        }


        const naturalLine =
            this.getPositionLine(
                naturalPosition
            );


        const currentLine =
            this.getPositionLine(
                currentPosition
            );


        if (
            naturalLine !==
                "unknown" &&

            naturalLine ===
                currentLine
        ) {

            return "yellow";

        }


        return "red";

    }



    /* ================================================= */
    /* PÉNALITÉ */
    /* ================================================= */

    getPositionPenalty(
        player,
        position
    ) {

        const status =
            this.getPositionStatus(
                player,
                position
            );


        switch (
            status
        ) {

            case "green":

                return 0;


            case "yellow":

                return -5;


            case "red":

                return -10;


            default:

                return -10;

        }

    }



    /* ================================================= */
    /* NOTE EFFECTIVE */
    /* ================================================= */

    getEffectiveRating(
        player,
        position = null
    ) {

        if (!player) {

            return 0;

        }


        const baseRating =
            Number(
                player.note
            ) || 0;


        const currentPosition =
            position ||
            this.getPosition(
                this.getPlayerKey(
                    player
                )
            );


        const penalty =
            this.getPositionPenalty(
                player,
                currentPosition
            );


        return Math.max(
            0,
            baseRating +
            penalty
        );

    }



    getPositionRating(
        player,
        position = null
    ) {

        return this.getEffectiveRating(
            player,
            position
        );

    }



    getPositionColor(
        player,
        position = null
    ) {

        return this.getPositionStatus(
            player,
            position
        );

    }



    /* ================================================= */
    /* RÔLES */
    /* ================================================= */

    setRole(
        playerId,
        role
    ) {

        this.roles[
            String(
                playerId
            )
        ] =
            role;

    }



    getRole(
        playerId
    ) {

        return (
            this.roles[
                String(
                    playerId
                )
            ] ||
            ""
        );

    }



    /* ================================================= */
    /* STYLE */
    /* ================================================= */

    setStyle(
        type,
        value
    ) {

        if (
            this.style[type] !==
            undefined
        ) {

            this.style[type] =
                value;

        }

    }



    /* ================================================= */
    /* FORCE ÉQUIPE */
    /* ================================================= */

    getTeamStrength() {

        if (
            this.lineup.length === 0
        ) {

            return 0;

        }


        let total =
            0;


        this.lineup.forEach(
            player => {

                const position =
                    this.getPosition(
                        this.getPlayerKey(
                            player
                        )
                    );


                total +=
                    this.getEffectiveRating(
                        player,
                        position
                    );

            }
        );


        return Math.round(
            total /
            this.lineup.length
        );

    }



    /* ================================================= */
    /* BONUS TACTIQUE */
    /* ================================================= */

    getTacticalBonus() {

        let bonus =
            0;


        switch (
            this.style.mentality
        ) {

            case "Offensive":

                bonus += 5;

                break;


            case "Défensive":

                bonus -= 2;

                break;

        }


        bonus +=
            (
                this.style.pressing -
                50
            ) / 10;


        return Math.round(
            bonus
        );

    }



    /* ================================================= */
    /* DONNÉES */
    /* ================================================= */

    getData() {

        return {

            formation:
                this.formation,

            currentTactic:
                this.currentTactic,

            lineup:
                this.lineup,

            substitutes:
                this.substitutes,

            roles:
                this.roles,

            positions:
                this.positions,

            style:
                this.style

        };

    }

}
