class TacticsManager {


    constructor(dataManager) {


        this.dataManager = dataManager;


        this.formation = null;


        this.titulaires = [];


        this.remplacants = [];


        this.reserves = [];


    }



    choisirFormation(nomFormation) {


        const formation =

            this.dataManager.getFormation(
                nomFormation
            );



        if (!formation) {


            console.error(
                "❌ Formation introuvable"
            );


            return false;


        }



        this.formation = formation;



        console.log(
            "✅ Formation choisie :",
            formation.nom
        );



        return true;


    }



    getFormation() {


        return this.formation;


    }



    placerJoueurs(joueurs) {


        if (!this.formation) {


            console.error(
                "❌ Aucune formation sélectionnée"
            );


            return;


        }



        this.titulaires = [];



        this.formation.postes.forEach(
            
            poste => {


                const joueur = joueurs.find(

                    j =>

                    j.poste === poste.poste

                );



                if (joueur) {


                    this.titulaires.push({


                        id: poste.id,


                        poste: poste.poste,


                        joueur: joueur,


                        x: poste.x,


                        y: poste.y


                    });


                }


            }

        );



        console.log(
            "✅ Composition créée",
            this.titulaires
        );


    }



    ajouterRemplacants(joueurs) {


        this.remplacants = joueurs.filter(

            joueur =>

            !this.titulaires.some(

                titulaire =>

                titulaire.joueur === joueur

            )

        );


    }



    getTitulaires() {


        return this.titulaires;


    }



    getRemplacants() {


        return this.remplacants;


    }



    changerJoueur(positionId, nouveauJoueur) {


        const joueurPosition =

            this.titulaires.find(

                joueur =>

                joueur.id === positionId

            );



        if (joueurPosition) {


            joueurPosition.joueur =
                nouveauJoueur;


            console.log(
                "🔄 Joueur remplacé"
            );


        }


    }



    sauvegarderTactique() {


        return {


            formation:

                this.formation.nom,


            titulaires:

                this.titulaires.map(j => ({


                    poste: j.poste,


                    joueur:

                        j.joueur.prenom
                        +
                        " "
                        +
                        j.joueur.nom


                }))


        };


    }



}