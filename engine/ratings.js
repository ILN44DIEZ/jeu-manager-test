const Ratings = {

    clamp(value) {

        return Math.max(
            1,
            Math.min(99, Number(value) || 1)
        );

    },


    calculateAverage(player) {

        if (!player) {

            return 0;

        }


        const values = [

            player.note,

            player.overall,

            player.rating

        ];


        const validValues =
            values.filter(
                value =>
                    typeof value === "number"
            );


        if (validValues.length === 0) {

            return 0;

        }


        const total =
            validValues.reduce(
                (sum, value) =>
                    sum + value,
                0
            );


        return Math.round(
            total / validValues.length
        );

    },


    calculatePotential(player) {

        if (!player) {

            return 0;

        }


        const note =
            Number(player.note) || 0;


        const potential =
            Number(player.potentiel) || note;


        return this.clamp(
            potential
        );

    },


    getPositionBonus(player, position) {

        if (!player || !position) {

            return 0;

        }


        if (player.poste === position) {

            return 5;

        }


        return 0;

    },


    calculatePlayerRating(
        player,
        position = null
    ) {

        if (!player) {

            return 0;

        }


        let rating =
            Number(player.note) || 0;


        rating +=
            this.getPositionBonus(
                player,
                position
            );


        if (player.forme !== undefined) {

            rating +=
                (Number(player.forme) - 50) / 20;

        }


        if (player.moral !== undefined) {

            rating +=
                (Number(player.moral) - 50) / 25;

        }


        return Math.round(
            this.clamp(rating)
        );

    },


    calculateTeamRating(players) {

        if (
            !Array.isArray(players) ||
            players.length === 0
        ) {

            return 0;

        }


        const ratings =
            players.map(
                player =>
                    this.calculatePlayerRating(
                        player
                    )
            );


        const total =
            ratings.reduce(
                (sum, rating) =>
                    sum + rating,
                0
            );


        return Math.round(
            total / ratings.length
        );

    }

};
