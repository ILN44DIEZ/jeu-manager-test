class Player {
    constructor(data = {}) {

        // Identité
        this.id = data.id || Date.now() + Math.floor(Math.random() * 1000);

        this.firstName = data.firstName || "";
        this.lastName = data.lastName || "";

        this.age = data.age || 18;
        this.nationality = data.nationality || "";

        // Football
        this.position = data.position || "MC";
        this.number = data.number || 0;
        this.preferredFoot = data.preferredFoot || "Droit";

        // Niveau
        this.overall = data.overall || 60;
        this.potential = data.potential || 75;

        this.value = data.value || 1000000;
        this.salary = data.salary || 5000;

        // Physique
        this.height = data.height || 180;
        this.weight = data.weight || 75;


        // Attributs
        this.attributes = data.attributes || {

            speed: 60,
            acceleration: 60,
            stamina: 60,
            strength: 60,
            agility: 60,

            ballControl: 60,
            dribbling: 60,
            shortPass: 60,
            longPass: 60,
            crossing: 60,
            shooting: 60,
            finishing: 60,

            tackling: 60,
            marking: 60,
            interception: 60,
            positioning: 60,

            vision: 60,
            composure: 60,
            decisions: 60,
            determination: 60,
            leadership: 60,

            goalkeeper: {
                reflexes: 10,
                diving: 10,
                aerialAbility: 10,
                kicking: 10,
                positioning: 10
            }
        };


        // État physique
        this.fitness = data.fitness || 100;
        this.fatigue = data.fatigue || 0;
        this.morale = data.morale || 75;
        this.energy = data.energy || 100;


        // Blessures
        this.injury = data.injury || null;
        this.injuryDays = data.injuryDays || 0;


        // Statistiques
        this.stats = data.stats || {

            appearances: 0,
            minutesPlayed: 0,

            goals: 0,
            assists: 0,

            averageRating: 0
        };
    }


    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }


    train(attribute, intensity = 1) {

        if (!this.attributes[attribute]) return;

        let improvement = 0.1 * intensity;

        if (this.age < 23) {
            improvement *= 1.5;
        }

        this.attributes[attribute] += improvement;


        if (this.attributes[attribute] > 99) {
            this.attributes[attribute] = 99;
        }


        this.calculateOverall();
        this.updateMarketValue();
    }



    calculateOverall() {

        let total = 0;
        let count = 0;


        for (let attribute in this.attributes) {

            if (typeof this.attributes[attribute] === "number") {

                total += this.attributes[attribute];
                count++;
            }
        }


        if (count > 0) {

            this.overall =
                Math.round(total / count);
        }


        if (this.overall > 99) {
            this.overall = 99;
        }
    }



    developPotential() {

        if (this.age >= 30) return;

        let chance = Math.random();


        if (chance > 0.5 &&
            this.overall < this.potential) {

            this.train(
                Object.keys(this.attributes)
                [Math.floor(
                    Math.random() *
                    Object.keys(this.attributes).length
                )],
                1
            );
        }
    }



    ageUp() {

        this.age++;


        // Progression jeune
        if (this.age < 24) {

            this.developPotential();

        }


        // Déclin après 32 ans
        if (this.age > 32) {

            this.overall -= 1;

            if (this.overall < 1) {
                this.overall = 1;
            }
        }


        this.updateMarketValue();
    }



    updateMarketValue() {

        let base =
            this.overall *
            this.overall *
            1000;


        let potentialBonus =
            (this.potential - this.overall)
            * 50000;


        let ageFactor = 1;


        if (this.age > 30) {
            ageFactor = 0.7;
        }


        this.value =
            Math.round(
                (base + potentialBonus)
                * ageFactor
            );
    }



    playMatch(minutes, rating) {

        this.stats.appearances++;
        this.stats.minutesPlayed += minutes;


        let total =
            this.stats.averageRating *
            (this.stats.appearances - 1);


        this.stats.averageRating =
            (total + rating)
            /
            this.stats.appearances;


        this.fatigue += 10;
        this.energy -= 15;


        if (this.fatigue > 100)
            this.fatigue = 100;


        if (this.energy < 0)
            this.energy = 0;
    }



    rest() {

        this.fatigue -= 20;
        this.energy += 20;


        if (this.fatigue < 0)
            this.fatigue = 0;


        if (this.energy > 100)
            this.energy = 100;
    }



    getData() {

        return {

            id: this.id,

            firstName: this.firstName,
            lastName: this.lastName,

            age: this.age,
            nationality: this.nationality,

            position: this.position,

            overall: this.overall,
            potential: this.potential,

            value: this.value,
            salary: this.salary,

            attributes: this.attributes,

            fitness: this.fitness,
            fatigue: this.fatigue,
            morale: this.morale,
            energy: this.energy,

            injury: this.injury,
            injuryDays: this.injuryDays,

            stats: this.stats
        };
    }
}