// =======================
// PROFIL MANAGER
// =======================
let manager = {
    club: "",
    saison: 1,
    budget: 5000000,
    reputation: 50,
    matchActuel: 0,
    saisonTerminee: false
};
// =======================
// CLUBS DU CHAMPIONNAT
// =======================
let clubs = [
    {nom:"Paris FC", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Lyon", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Marseille", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Monaco", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Lille", points:0, victoires:0, nuls:0, defaites:0, buts:0},
    {nom:"Rennes", points:0, victoires:0, nuls:0, defaites:0, buts:0}
];
// =======================
// CALENDRIER
// =======================
let calendrier = [
    "Lyon",
    "Marseille",
    "Monaco",
    "Lille",
    "Rennes"
];
// =======================
// CHOIX DU CLUB
// =======================
function startGame(clubChoisi){
    if(manager.club !== ""){
        document.getElementById("result").innerHTML = `
        <h3>❌ Changement impossible</h3>
        <p>Tu es déjà entraîneur de ${manager.club}.</p>
        <p>Tu dois terminer la saison.</p>
        `;
        return;
    }
    manager.club = clubChoisi;
    afficherCalendrier();
}
// =======================
// AFFICHER CALENDRIER
// =======================
function afficherCalendrier(){
    let html = `
    <h2>🏟 Saison ${manager.saison}</h2>
    <p>Club : ${manager.club}</p>
    <p>Budget : ${manager.budget} €</p>
    <h3>Calendrier</h3>
    `;
    calendrier.forEach((adversaire,index)=>{
        let statut = index < manager.matchActuel 
        ? "✅ Joué"
        : "⏳ À jouer";
        html += `
        <p>
        Journée ${index+1} :
        ${manager.club} - ${adversaire}
        ${statut}
        </p>
        `;
    });
    if(!manager.saisonTerminee){
        html += `
        <button onclick="jouerMatch()">
        Jouer le prochain match
        </button>
        `;
    }
    html += `
    <button onclick="afficherClassement()">
    Voir classement
    </button>
    `;
    document.getElementById("result").innerHTML = html;
}
// =======================
// JOUER UN MATCH
// =======================
function jouerMatch(){
    if(manager.matchActuel >= calendrier.length){
        finDeSaison();
        return;
    }
    let adversaire = calendrier[manager.matchActuel];
    let monClub = clubs.find(c=>c.nom === manager.club);
    let clubAdverse = clubs.find(c=>c.nom === adversaire);
    let scoreMoi = Math.floor(Math.random()*4);
    let scoreAdverse = Math.floor(Math.random()*4);
    monClub.buts += scoreMoi;
    clubAdverse.buts += scoreAdverse;
    let resultat = "";
    if(scoreMoi > scoreAdverse){
        monClub.points += 3;
        monClub.victoires++;
        manager.reputation += 2;
        resultat = "✅ Victoire";
    }
    else if(scoreMoi < scoreAdverse){
        clubAdverse.points += 3;
        clubAdverse.victoires++;
        manager.reputation -= 1;
        resultat = "❌ Défaite";
    }
    else{
        monClub.points++;
        clubAdverse.points++;
        monClub.nuls++;
        clubAdverse.nuls++;
        resultat = "🤝 Match nul";
    }
    manager.matchActuel++;
    document.getElementById("result").innerHTML = `
    <h3>
    ${manager.club} ${scoreMoi} - ${scoreAdverse} ${adversaire}
    </h3>
    <p>${resultat}</p>
    `;
    setTimeout(afficherCalendrier,1500);
}
// =======================
// CLASSEMENT
// =======================
function afficherClassement(){
    clubs.sort((a,b)=> b.points - a.points);
    let html = `
    <h2>🏆 Classement Ligue</h2>
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
// =======================
// FIN DE SAISON
// =======================
function finDeSaison(){
    manager.saisonTerminee = true;
    let monClub = clubs.find(c=>c.nom === manager.club);
    document.getElementById("result").innerHTML = `
    <h2>🏁 Fin de saison</h2>
    <p>
    ${manager.club} termine avec 
    ${monClub.points} points.
    </p>
    <p>
    Réputation : ${manager.reputation}/100
    </p>
    <h3>
    La prochaine étape sera le mercato.
    </h3>
    `;
}