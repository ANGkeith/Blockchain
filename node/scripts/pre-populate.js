/* global artifacts */
let app;

const ChainList = artifacts.require("../contracts/ChainList.sol");

const seller = "0x2e2c380c6f369e9f8f20b9092c659592919f5904";

const articlePrice = "29";

const articleName1 = "Lamborghini Aventador-S";
const articleDescription1 =
    "Following the Miura, Islero, Countach and Urraco, today’s most iconic Lamborghini reflects the heritage of the historic S models into the Aventador S. The exclusive design and a V12 engine that develops an extraordinary 740 hp combine with the most sophisticated technology available, LDVA (Lamborghini Dinamica Veicolo Attiva, Lamborghini Active Vehicle Dynamics).";

const articleName2 = "Lamborghini Urus";
const articleDescription2 =
    "The soul of a super sports car and the functionality of an SUV: the Lamborghini Urus is the first Super Sport Utility Vehicle in the world. Unmistakably born of the House of the Raging Bull, Urus is a revolutionary vehicle. With extreme proportions, cutting-edge design, extraordinary driving dynamics and heart-pounding performance, Urus is pure Lamborghini.";

const articleName3 = "Lamborghini Huracan-Evo";
const articleDescription3 =
    "The Huracán EVO is the evolution of the most successful V10-powered Lamborghini ever. The result of fine-tuning and refining existing features, combined with new design solutions that increase performance, the car stands out for its ability to anticipate and cater to the driver’s behavior, expectations and desires.";

async function main() {
    app = await ChainList.deployed();
    await app.sellArticle(
        articleName1,
        articleDescription1,
        web3.utils.toWei(articlePrice, "ether").toString(),
        {from: seller}
    );
    await app.sellArticle(
        articleName2,
        articleDescription2,
        web3.utils.toWei(articlePrice, "ether").toString(),
        {from: seller}
    );
    await app.sellArticle(
        articleName3,
        articleDescription3,
        web3.utils.toWei(articlePrice, "ether").toString(),
        {from: seller}
    );
}

// For truffle exec
module.exports = function(callback) {
    main()
        .then(() => callback())
        .catch(err => callback(err));
};
