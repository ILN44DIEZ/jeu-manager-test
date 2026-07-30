class PlayerFactory {

    static createRandomPlayer(position = null) {

        const positions = [
            "GK",
            "DC",
            "DD",
            "DG",
            "MC",
            "MOC",
            "MD",
            "MG",
            "AD",
            "AG",
            "BU"
        ];

        const chosenPosition =
            position ||
            positions[Math.floor(Math.random() * positions.length)];


        const age =
            Math.floor(Math.random() * 18) + 17;


        const potential =
            Math.floor(Math.random() * 31) + 70;


        const overall =
            Math.floor(Math.random() * 31) + 50;


        const player = {

            firstName:
                PlayerFactory.randomFirstName(),

            lastName:
                PlayerFactory.randomLastName(),

            age: age,

            nationality:
                PlayerFactory.randomCountry(),

            position:
                chosenPosition,

            overall:
                overall,

            potential:
                Math.max(potential, overall),

            value:
                overall * overall * 1000,

            salary:
                overall * 200
        };


        player.attributes =
            PlayerFactory.generateAttributes(
                chosenPosition,
                overall
            );


        return player;
    }



    static generateAttributes(position, overall) {

        let base = overall;


        let attributes = {

            speed: base,
            acceleration: base,
            stamina: base,
            strength: base,

            ballControl: base,
            dribbling: base,
            shortPass: base,
            longPass: base,

            crossing: base,
            shooting: base,
            finishing: base,

            tackling: base,
            marking: base,
            interception: base,

            vision: base,
            composure: base,
            decisions: base,
            determination: base
        };


        if (position === "BU" ||
            position === "AD" ||
            position === "AG") {

            attributes.finishing += 10;
            attributes.shooting += 8;
            attributes.speed += 5;
        }


        if (position === "DC" ||
            position === "DD" ||
            position === "DG") {

            attributes.tackling += 10;
            attributes.marking += 10;
            attributes.strength += 5;
        }


        if (position === "MC" ||
            position === "MOC") {

            attributes.shortPass += 10;
            attributes.vision += 10;
            attributes.ballControl += 5;
        }


        if (position === "GK") {

            attributes.reflexes = base + 10;
            attributes.diving = base + 10;
            attributes.positioning = base + 10;
        }


        return attributes;
    }



    static randomFirstName() {

        const names = [
            "Lucas",
            "Hugo",
            "Adam",
            "Léo",
            "Noah",
            "Ethan",
            "Louis",
            "Mathis"
        ];

        return names[
            Math.floor(Math.random() * names.length)
        ];
    }



    static randomLastName() {

        const names = [
            "Martin",
            "Bernard",
            "Dubois",
            "Moreau",
            "Petit",
            "Garcia",
            "Robert",
            "Leroy"
        ];

        return names[
            Math.floor(Math.random() * names.length)
        ];
    }



    static randomCountry() {

        const countries = [
            "France",
            "Espagne",
            "Italie",
            "Angleterre",
            "Allemagne",
            "Brésil"
        ];

        return countries[
            Math.floor(Math.random() * countries.length)
        ];
    }

}