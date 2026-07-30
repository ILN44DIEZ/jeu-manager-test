class Tactics {

    constructor() {

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



    setFormation(formation) {

        const formations = [
            "4-3-3",
            "4-4-2",
            "4-2-3-1",
            "3-5-2"
        ];


        if (formations.includes(formation)) {

            this.formation = formation;

            return true;
        }


        return false;
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

        this.substitutes.push(player);

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

            total += player.overall;

        });


        return Math.round(
            total / this.lineup.length
        );
    }



    getTacticalBonus() {

        let bonus = 0;


        if (this.style.mentality === "Offensive") {

            bonus += 5;

        }


        if (this.style.mentality === "Défensive") {

            bonus -= 2;

        }


        bonus +=
            (this.style.pressing - 50) / 10;


        return Math.round(bonus);

    }



    getData() {

        return {

            formation: this.formation,

            lineup:
                this.lineup.map(
                    player => player.getData()
                ),

            substitutes:
                this.substitutes.map(
                    player => player.getData()
                ),

            roles: this.roles,

            positions: this.positions,

            style: this.style

        };

    }

}