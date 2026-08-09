class Tactics {

    constructor(dataManager = null) {

        this.dataManager = dataManager;

        this.formation = "4-3-3";

        this.currentTactic = "Équilibrée";

        this.lineup = [];

        this.substitutes = [];

        this.roles = {};

        this.positions = {};

        this.style = {

            mentality: "Équilibrée",

            pressing: 50,

            tempo: 50,

            possession: 50

        };

    }


    setDataManager(dataManager) {

        this.dataManager = dataManager;

    }


    getPlayerKey(player) {

        if (!player) {

            return "";

        }


        if (player.id !== undefined &&
            player.id !== null) {

            return String(player.id);

        }


        return (
            String(player.prenom || "") +
            "_" +
            String(player.nom || "") +
            "_" +
            String(player.numero || "")
        );

    }


    setFormation(formation) {

        if (!this.dataManager) {

            this.formation = formation;

            return true;

        }


        const formationData =
            this.dataManager.getFormation(
                formation
            );


        if (formationData) {

            this.formation = formation;

            return true;

        }


        return false;

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


    setTactic(name) {

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


    /* ========================= */
    /* INITIALISATION EFFECTIF */
    /* ========================= */

    initializeSquad(players) {

        this.lineup = [];

        this.substitutes = [];

        this.positions = {};

        this.roles = {};


        if (
            !players ||
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


        const availablePlayers =
            [...players];


        /* ========================= */
        /* 11 TITULAIRES */
        /* ========================= */

        formation.postes.forEach(
            poste => {

                if (
                    this.lineup.length >= 11
                ) {

                    return;

                }


                let index =
                    availablePlayers.findIndex(
                        player =>
                            player.poste ===
                            poste.poste
                    );


                if (index === -1) {

                    index =
                        this.getBestPlayerIndex(
                            availablePlayers
                        );

                }


                if (index === -1) {

                    return;

                }


                const player =
                    availablePlayers[index];


                this.lineup.push(
                    player
                );


                this.positions[
                    this.getPlayerKey(player)
                ] =
                    poste.poste;


                availablePlayers.splice(
                    index,
                    1
                );

            }
        );


        /* ========================= */
        /* COMPLÉTER LES 11 */
        /* ========================= */

        while (
            this.lineup.length < 11 &&
            availablePlayers.length > 0
        ) {

            const player =
                availablePlayers.shift();


            const poste =
                formation.postes[
                    this.lineup.length
                ];


            this.lineup.push(
                player
            );


            if (poste) {

                this.positions[
                    this.getPlayerKey(player)
                ] =
                    poste.poste;

            }

        }


        /* ========================= */
        /* 9 REMPLAÇANTS */
        /* ========================= */

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


    getBestPlayerIndex(players) {

        if (
            !players ||
            players.length === 0
        ) {

            return -1;

        }


        let bestIndex = 0;


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

                bestIndex = i;

            }

        }


        return bestIndex;

    }


    /* ========================= */
    /* TITULAIRES */
    /* ========================= */

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
            this.getPlayerKey(player);


        const alreadyStarter =
            this.lineup.some(
                starter =>
                    this.getPlayerKey(
                        starter
                    ) === key
            );


        if (alreadyStarter) {

            return false;

        }


        const alreadySubstitute =
            this.substitutes.some(
                substitute =>
                    this.getPlayerKey(
                        substitute
                    ) === key
            );


        if (alreadySubstitute) {

            return false;

        }


        this.lineup.push(
            player
        );


        if (position) {

            this.positions[key] =
                position;

        }


        return true;

    }


    removeStarter(playerId) {

        const player =
            this.lineup.find(
                joueur =>
                    this.getPlayerKey(
                        joueur
                    ) === String(playerId)
            );


        if (player) {

            delete this.positions[
                this.getPlayerKey(player)
            ];

        }


        this.lineup =
            this.lineup.filter(
                joueur =>
                    this.getPlayerKey(
                        joueur
                    ) !== String(playerId)
            );

    }


    setPosition(
        playerId,
        position
    ) {

        this.positions[
            String(playerId)
        ] =
            position;

    }


    getPosition(playerId) {

        return (
            this.positions[
                String(playerId)
            ] ||
            "Libre"
        );

    }


    /* ========================= */
    /* REMPLAÇANTS */
    /* ========================= */

    addSubstitute(player) {

        if (
            this.substitutes.length >= 9
        ) {

            return false;

        }


        const key =
            this.getPlayerKey(player);


        const alreadyStarter =
            this.lineup.some(
                starter =>
                    this.getPlayerKey(
                        starter
                    ) === key
            );


        if (alreadyStarter) {

            return false;

        }


        const alreadySubstitute =
            this.substitutes.some(
                substitute =>
                    this.getPlayerKey(
                        substitute
                    ) === key
            );


        if (alreadySubstitute) {

            return false;

        }


        this.substitutes.push(
            player
        );


        return true;

    }


    removeSubstitute(playerId) {

        this.substitutes =
            this.substitutes.filter(
                player =>
                    this.getPlayerKey(
                        player
                    ) !== String(playerId)
            );

    }


    /* ========================= */
    /* RÔLES */
    /* ========================= */

    setRole(
        playerId,
        role
    ) {

        this.roles[
            String(playerId)
        ] =
            role;

    }


    getRole(playerId) {

        return (
            this.roles[
                String(playerId)
            ] ||
            ""
        );

    }


    /* ========================= */
    /* STYLE */
    /* ========================= */

    setStyle(
        type,
        value
    ) {

        if (
            this.style[type] !== undefined
        ) {

            this.style[type] =
                value;

        }

    }


    /* ========================= */
    /* FORCE ÉQUIPE */
    /* ========================= */

    getTeamStrength() {

        if (
            this.lineup.length === 0
        ) {

            return 0;

        }


        let total = 0;


        this.lineup.forEach(
            player => {

                total +=
                    Number(
                        player.note
                    ) || 0;

            }
        );


        return Math.round(
            total /
            this.lineup.length
        );

    }


    /* ========================= */
    /* BONUS TACTIQUE */
    /* ========================= */

    getTacticalBonus() {

        let bonus = 0;


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


    /* ========================= */
    /* DONNÉES */
    /* ========================= */

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
