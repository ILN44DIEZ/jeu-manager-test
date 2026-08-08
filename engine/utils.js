const Utils = {

    clamp(value, min, max) {

        return Math.max(
            min,
            Math.min(max, value)
        );

    },


    random(min, max) {

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;

    },


    randomFloat(min, max) {

        return Math.random() * (max - min) + min;

    },


    randomItem(array) {

        if (!array || array.length === 0) {

            return null;

        }

        return array[
            Math.floor(
                Math.random() * array.length
            )
        ];

    },


    shuffle(array) {

        if (!Array.isArray(array)) {

            return [];

        }

        return [...array].sort(
            () => Math.random() - 0.5
        );

    },


    formatMoney(value) {

        return Number(value || 0)
            .toLocaleString("fr-FR")
            + " €";

    },


    formatNumber(value) {

        return Number(value || 0)
            .toLocaleString("fr-FR");

    },


    capitalize(text) {

        if (!text) {

            return "";

        }

        return text.charAt(0).toUpperCase()
            + text.slice(1);

    },


    deepClone(object) {

        return JSON.parse(
            JSON.stringify(object)
        );

    }

};
