class SaveManager {

    constructor() {

        this.saveSlots = 3;

    }



    saveGame(slot, gameData) {

        if (slot < 1 || slot > this.saveSlots) {

            console.log("Emplacement invalide");

            return false;
        }


        const data = {

            date: new Date().toISOString(),

            game: gameData

        };


        localStorage.setItem(

            "managerCareer_save_" + slot,

            JSON.stringify(data)

        );


        return true;
    }



    loadGame(slot) {

        if (slot < 1 || slot > this.saveSlots) {

            return null;

        }


        const save = localStorage.getItem(

            "managerCareer_save_" + slot

        );


        if (!save) {

            return null;

        }


        return JSON.parse(save);

    }



    deleteSave(slot) {

        localStorage.removeItem(

            "managerCareer_save_" + slot

        );

    }



    getSaveList() {

        let saves = [];


        for (let i = 1; i <= this.saveSlots; i++) {

            const save =
                localStorage.getItem(
                    "managerCareer_save_" + i
                );


            if (save) {

                const data = JSON.parse(save);


                saves.push({

                    slot: i,

                    date: data.date

                });

            }

        }


        return saves;

    }



    exportSave(slot) {

        const save = this.loadGame(slot);


        if (!save) {

            return null;

        }


        return JSON.stringify(save);

    }



    importSave(slot, data) {

        localStorage.setItem(

            "managerCareer_save_" + slot,

            data

        );

    }

}