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


    /*
     * =========================
     * INITIALISATION EFFECTIF
     * =========================
     *
     * 11 titulaires
     * 9 remplaçants
     * Le reste = réservistes
     */

    initializeSquad(players) {

        this.lineup = [];

        this.substitutes = [];

        this.positions = {};

        this.roles = {};


        if (!players || players.length === 0) {

            return;

        }


        const formation =
            this.getFormationData();


        if (!formation) {

            console.error(
                "❌ Impossible d'initialiser l'effectif : formation introuvable."
            );

            return;

        }


        const availablePlayers =
            [...players];


        /*
         * Sélection des 11 titulaires
         */

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


                /*
                 * Si aucun joueur ne correspond
                 * exactement au poste, on prend
                 * le meilleur joueur disponible.
                 */

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


                this.positions[player.id] =
                    poste.poste;


                availablePlayers.splice(
                    index,
                    1
                );

            }
        );


        /*
         * Si certaines positions n'ont pas
         * trouvé de joueur, on complète
         * avec les meilleurs joueurs restants.
         */

        while (
            this.lineup.length < 11 &&
            availablePlayers.length > 0
        ) {

            const player =
                availablePlayers.shift();


            this.lineup.push(
                player
            );


            const poste =
                formation.postes[
                    this.lineup.length - 1
                ];


            if (poste) {

                this.positions[player.id] =
                    poste.poste;

            }

        }


        /*
         * 9 remplaçants
         */

        while (
            this.substitutes.length < 9 &&
            availablePlayers.length > 0
        ) {

            this.substitutes.push(
                availablePlayers.shift()
            );

        }


        console.log(
            "⚽ Équipe initialisée :",
            this.lineup.length,
            "titulaires,",
            this.substitutes.length,
            "remplaçants,",
            availablePlayers.length,
            "réservistes."
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


    addStarter(
        player,
        position = null
    ) {

        if (
            this.lineup.length >= 11
        ) {

            return false;

        }


        const alreadyStarter =
            this.lineup.some(
                starter =>
                    starter.id === player.id
            );


        if (alreadyStarter) {

            return false;

        }


        const alreadySubstitute =
            this.substitutes.some(
                substitute =>
                    substitute.id === player.id
            );


        if (alreadySubstitute) {

            return false;

        }


        this.lineup.push(
            player
        );


        if (position) {

            this.positions[player.id] =
                position;

        }


        return true;

    }


    removeStarter(playerId) {

        this.lineup =
            this.lineup.filter(
                player =>
                    player.id !== playerId
            );


        delete this.positions[playerId];

    }


    setPosition(
        playerId,
        position
    ) {

        this.positions[playerId] =
            position;

    }


    getPosition(playerId) {

        return (
            this.positions[playerId] ||
            "Libre"
        );

    }


    addSubstitute(player) {

        if (
            this.substitutes.length >= 9
        ) {

            return false;

        }


        const alreadyStarter =
            this.lineup.some(
                starter =>
                    starter.id === player.id
            );


        if (alreadyStarter) {

            return false;

        }


        const alreadySubstitute =
            this.substitutes.some(
                substitute =>
                    substitute.id === player.id
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
                    player.id !== playerId
            );

    }


    setRole(playerId, role) {

        this.roles[playerId] =
            role;

    }


    getRole(playerId) {

        return (
            this.roles[playerId] ||
            ""
        );

    }


    setStyle(type, value) {

        if (
            this.style[type] !== undefined
        ) {

            this.style[type] =
                value;

        }

    }


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
                this.style.pressing - 50
            ) / 10;


        return Math.round(
            bonus
        );

    }


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
