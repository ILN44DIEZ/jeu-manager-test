class SaveManager {

    constructor() {

        this.saveSlots = 3;

    }



    /* ================================================= */
    /* SAUVEGARDE */
    /* ================================================= */

    saveGame(slot, gameData) {

        if (
            slot < 1 ||
            slot > this.saveSlots
        ) {

            console.log(
                "Emplacement invalide"
            );

            return false;

        }


        const data = {

            date:
                new Date().toISOString(),

            game:
                gameData

        };


        localStorage.setItem(

            "managerCareer_save_" + slot,

            JSON.stringify(data)

        );


        console.log(
            "💾 Partie sauvegardée dans le slot",
            slot
        );


        return true;

    }



    /* ================================================= */
    /* CHARGEMENT */
    /* ================================================= */

    loadGame(slot) {

        if (
            slot < 1 ||
            slot > this.saveSlots
        ) {

            return null;

        }


        const save =
            localStorage.getItem(

                "managerCareer_save_" + slot

            );


        if (!save) {

            return null;

        }


        try {

            return JSON.parse(
                save
            );

        } catch (error) {

            console.error(
                "❌ Sauvegarde corrompue :",
                error
            );

            return null;

        }

    }



    /* ================================================= */
    /* SUPPRESSION */
    /* ================================================= */

    deleteSave(slot) {

        if (
            slot < 1 ||
            slot > this.saveSlots
        ) {

            return false;

        }


        localStorage.removeItem(

            "managerCareer_save_" + slot

        );


        console.log(
            "🗑️ Sauvegarde supprimée : slot",
            slot
        );


        return true;

    }



    /* ================================================= */
    /* LISTE DES SAUVEGARDES */
    /* ================================================= */

    getSaveList() {

        const saves = [];


        for (
            let i = 1;
            i <= this.saveSlots;
            i++
        ) {

            const save =
                localStorage.getItem(

                    "managerCareer_save_" + i

                );


            if (!save) {

                continue;

            }


            try {

                const data =
                    JSON.parse(
                        save
                    );


                saves.push({

                    slot:
                        i,

                    date:
                        data.date

                });

            } catch (error) {

                console.error(
                    "❌ Sauvegarde invalide :",
                    i
                );

            }

        }


        return saves;

    }



    /* ================================================= */
    /* EXPORT */
    /* ================================================= */

    exportSave(slot) {

        const save =
            this.loadGame(
                slot
            );


        if (!save) {

            return null;

        }


        return JSON.stringify(
            save
        );

    }



    /* ================================================= */
    /* IMPORT */
    /* ================================================= */

    importSave(
        slot,
        data
    ) {

        if (
            slot < 1 ||
            slot > this.saveSlots
        ) {

            return false;

        }


        try {

            /*
             * On vérifie que les données
             * sont bien du JSON valide.
             */

            const parsed =
                JSON.parse(
                    data
                );


            if (
                !parsed ||
                !parsed.game
            ) {

                console.error(
                    "❌ Format de sauvegarde invalide."
                );

                return false;

            }


            localStorage.setItem(

                "managerCareer_save_" + slot,

                JSON.stringify(
                    parsed
                )

            );


            console.log(
                "📥 Sauvegarde importée dans le slot",
                slot
            );


            return true;

        } catch (error) {

            console.error(
                "❌ Impossible d'importer la sauvegarde :",
                error
            );

            return false;

        }

    }



    /* ================================================= */
    /* DONNÉES TACTIQUES */
    /* ================================================= */

    getTacticsData(tactics) {

        if (!tactics) {

            return null;

        }


        return {

            formation:
                tactics.formation,

            currentTactic:
                tactics.currentTactic,

            lineup:
                tactics.lineup,

            substitutes:
                tactics.substitutes,

            roles:
                tactics.roles,

            positions:
                tactics.positions,

            style:
                tactics.style

        };

    }



    /* ================================================= */
    /* RESTAURATION TACTIQUE */
    /* ================================================= */

    loadTacticsData(
        tactics,
        tacticsData
    ) {

        if (
            !tactics ||
            !tacticsData
        ) {

            return false;

        }


        if (
            tacticsData.formation
        ) {

            tactics.formation =
                tacticsData.formation;

        }


        if (
            tacticsData.currentTactic
        ) {

            tactics.currentTactic =
                tacticsData.currentTactic;

        }


        if (
            Array.isArray(
                tacticsData.lineup
            )
        ) {

            tactics.lineup =
                tacticsData.lineup;

        }


        if (
            Array.isArray(
                tacticsData.substitutes
            )
        ) {

            tactics.substitutes =
                tacticsData.substitutes;

        }


        if (
            tacticsData.roles
        ) {

            tactics.roles =
                tacticsData.roles;

        }


        if (
            tacticsData.positions
        ) {

            tactics.positions =
                tacticsData.positions;

        }


        if (
            tacticsData.style
        ) {

            tactics.style =
                tacticsData.style;

        }


        console.log(
            "⚽ Tactiques restaurées."
        );


        return true;

    }

}
