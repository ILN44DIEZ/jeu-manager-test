class Player {
    constructor(data = {}) {
        this.id = data.id || Date.now() + Math.floor(Math.random() * 1000);

        this.firstName = data.firstName || "";
        this.lastName = data.lastName || "";

        this.age = data.age || 18;
        this.nationality = data.nationality || "";

        this.position = data.position || "MC";
        this.number = data.number || 0;
        this.preferredFoot = data.preferredFoot || "Droit";

        this.overall = data.overall || 60;
        this.potential = data.potential || 75;

        this.value = data.value || 1000000;
        this.salary = data.salary || 5000;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    setNumber(number) {
        this.number = number;
    }

    setPosition(position) {
        this.position = position;
    }

    setOverall(overall) {
        this.overall = Math.max(1, Math.min(99, overall));
    }

    setPotential(potential) {
        this.potential = Math.max(this.overall, Math.min(99, potential));
    }

    setValue(value) {
        this.value = Math.max(0, value);
    }

    setSalary(salary) {
        this.salary = Math.max(0, salary);
    }

    getData() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age,
            nationality: this.nationality,
            position: this.position,
            number: this.number,
            preferredFoot: this.preferredFoot,
            overall: this.overall,
            potential: this.potential,
            value: this.value,
            salary: this.salary
        };
    }
}