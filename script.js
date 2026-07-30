let manager = {
    club: "",
    saison: 1,
    budget: 5000000,
    reputation: 50,
    matchActuel: 0,
    points: 0
};

let calendrier = [
    "Lyon",
    "Marseille",
    "Monaco",
    "Lille",
    "Rennes",
    "Nice",
    "Nantes",
    "Lens",
    "Bordeaux",
    "Toulouse"
];


function startGame(clubChoisi){

    manager.club = clubChoisi;

    afficherCalendrier();
}


function afficherCalendrier(){

    let html = `
    <h2>Saison ${manager.saison}</h2>
    <p>Club : ${manager.club}</p>
    <p>Points : ${manager.points}</p>
    <h3>Calendrier</h3>
    `;

    calendrier.forEach((adversaire, index)=>{

        let statut = index < manager.matchActuel 
        ? "✅ Terminé" 
        : "⏳ À jouer";

        html += `
        <p>
        Journée ${index + 1} : ${manager.club} - ${adversaire}
        ${statut}
        </p>
        `;
    });


    html += `
    <button onclick="jouerMatch()">
    Jouer le prochain match
    </button>
    `;


    document.getElementById("result").innerHTML = html;
}



function jouerMatch(){

    if(manager.matchActuel >= calendrier.length){
        document.getElementById("result").innerHTML += 
        "<h2>Saison terminée 🏆</h2>";
        return;
    }


    let adversaire = calendrier[manager.matchActuel];

    let resultat = Math.random();


    let texte = `
    <h3>Match : ${manager.club} - ${adversaire}</h3>
    `;


    if(resultat > 0.55){

        manager.points += 3;
        manager.reputation += 2;

        texte += "✅ Victoire (+3 points)";

    } else if(resultat > 0.25){

        manager.points += 1;

        texte += "🤝 Match nul (+1 point)";

    } else {

        manager.reputation -= 1;

        texte += "❌ Défaite";

    }


    manager.matchActuel++;

    document.getElementById("result").innerHTML = texte;

    setTimeout(afficherCalendrier, 1500);
}