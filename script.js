// 1) DONNÉES DU MANAGER
let manager = {
    club: "",
    saison: 1,
    budget: 5000000,
    reputation: 50,
    matchActuel: 0,
    points: 0
};


// 2) LISTE DES CLUBS DU CHAMPIONNAT
let clubs = [
    {nom:"Paris FC", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Lyon", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Marseille", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Monaco", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Lille", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Rennes", points:0, victoires:0, nuls:0, defaites:0, buts:0}
];


// 3) CALENDRIER
let calendrier = [
    "Lyon",
    "Marseille",
    "Monaco",
    "Lille",
    "Rennes",
];


// 4) DÉMARRER UNE CARRIÈRE
function startGame(clubChoisi){

    manager.club = clubChoisi;

    afficherCalendrier();
}


// 5) AFFICHER LE CALENDRIER
function afficherCalendrier(){

    let html = `
    <h2>Saison ${manager.saison}</h2>
    <p>Club : ${manager.club}</p>
    <h3>Calendrier</h3>
    `;

    calendrier.forEach((adversaire,index)=>{

        html += `
        <p>
        Journée ${index+1} : 
        ${manager.club} - ${adversaire}
        </p>
        `;
    });


    html += `
    <button onclick="jouerMatch()">
    Jouer le prochain match
    </button>

    <button onclick="afficherClassement()">
    Voir classement
    </button>
    `;


    document.getElementById("result").innerHTML = html;
}


// 6) JOUER UN MATCH
function jouerMatch(){

    let adversaire = calendrier[manager.matchActuel];

    let monClub = clubs.find(c=>c.nom===manager.club);
    let clubAdverse = clubs.find(c=>c.nom===adversaire);


    let scoreMoi = Math.floor(Math.random()*4);
    let scoreAdverse = Math.floor(Math.random()*4);


    monClub.buts += scoreMoi;
    clubAdverse.buts += scoreAdverse;


    if(scoreMoi > scoreAdverse){
        monClub.points += 3;
        monClub.victoires++;
    }
    else if(scoreMoi < scoreAdverse){
        clubAdverse.points += 3;
        clubAdverse.victoires++;
    }
    else{
        monClub.points++;
        clubAdverse.points++;
        monClub.nuls++;
        clubAdverse.nuls++;
    }


    manager.matchActuel++;


    document.getElementById("result").innerHTML =
    `
    ${manager.club} ${scoreMoi} - ${scoreAdverse} ${adversaire}
    `;


    setTimeout(afficherCalendrier,1500);
}


// 7) AFFICHER LE CLASSEMENT
function afficherClassement(){

    clubs.sort((a,b)=>b.points-a.points);


    let html = `
    <h2>🏆 Classement</h2>
    `;


    clubs.forEach((club,index)=>{

        html += `
        <p>
        ${index+1}. ${club.nom} 
        - ${club.points} pts
        </p>
        `;
    });


    document.getElementById("result").innerHTML = html;
}