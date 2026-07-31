class Tactics {

    constructor(dataManager = null) {

        this.dataManager = dataManager;

        this.formation = "4-3-3";

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
            this.dataManager.getFormation(formation);


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



    addStarter(player, position = null) {

        if (this.lineup.length >= 11) {

            return false;

        }


        this.lineup.push(player);


        if (position) {

            this.positions[player.id] = position;

        }


        return true;

    }



    removeStarter(playerId) {

        this.lineup =
            this.lineup.filter(
                player => player.id !== playerId
            );


        delete this.positions[playerId];

    }



    setPosition(playerId, position) {

        this.positions[playerId] = position;

    }



    getPosition(playerId) {

        return this.positions[playerId] || "Libre";

    }



    addSubstitute(player) {

        if (this.substitutes.length >= 12) {

            return false;

        }


        this.substitutes.push(player);

        return true;

    }



    removeSubstitute(playerId) {

        this.substitutes =
            this.substitutes.filter(
                player => player.id !== playerId
            );

    }



    setRole(playerId, role) {

        this.roles[playerId] = role;

    }



    getRole(playerId) {

        return this.roles[playerId] || "";

    }



    setStyle(type, value) {

        if (this.style[type] !== undefined) {

            this.style[type] = value;

        }

    }



    getTeamStrength() {

        if (this.lineup.length === 0) {

            return 0;

        }


        let total = 0;


        this.lineup.forEach(player => {

            total += player.note;

        });


        return Math.round(
            total / this.lineup.length
        );

    }



    getTacticalBonus() {

        let bonus = 0;


        switch (this.style.mentality) {

            case "Offensive":
                bonus += 5;
                break;

            case "Défensive":
                bonus -= 2;
                break;

        }


        bonus +=
            (this.style.pressing - 50) / 10;


        return Math.round(bonus);

    }



    getData() {

        return {

            formation: this.formation,

            lineup: this.lineup,

            substitutes: this.substitutes,

            roles: this.roles,

            positions: this.positions,

            style: this.style

        };

    }

}