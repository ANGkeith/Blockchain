/* global artifacts, contract */
const ChainList = artifacts.require("./ChainList.sol");

// test suite
contract("ChainList", function(accounts) {
    let chainListInstance;
    const seller = accounts[0];
    const buyer = accounts[1];
    const articleName1 = "article 1";
    const articleDescription1 = "Description for article 1";
    const articlePrice1 = "10";
    const articleName2 = "article 2";
    const articleDescription2 = "Description for article 2";
    const articlePrice2 = "20";
    let sellerBalanceBeforeBuy, buyerBalanceBeforeBuy, buyerBalanceAfterBuy, sellerBalanceAfterBuy;

    describe("Testing", function() {
        // add a test hook
        beforeEach("set up", async function() {
            chainListInstance = await ChainList.deployed();
        });

        it("should be initialized with empty values", async function() {
            const numberOfArticles = await chainListInstance.getNumberOfArticles();
            assert.equal(numberOfArticles.toString(), 0, "number of articles must be zero");
            const articlesForSale = await chainListInstance.getArticlesForSale();
            assert.equal(articlesForSale.length, 0, "there shouldn't be any article for sale");
        });

        it("should let us sell a first article", async function() {
            const receipt = await chainListInstance.sellArticle(
                articleName1,
                articleDescription1,
                web3.utils.toWei(articlePrice1, "ether").toString(),
                {from: seller}
            );
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
            assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
            assert.equal(receipt.logs[0].args._id.toString(), 1, "id must be 1");
            assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
            assert.equal(
                receipt.logs[0].args._name,
                articleName1,
                "event article name must be " + articleName1
            );
            assert.equal(
                receipt.logs[0].args._price.toString(),
                web3.utils.toWei(articlePrice1, "ether"),
                "event article price must be " + web3.utils.toWei(articlePrice1, "ether")
            );

            const numberOfArticles = await chainListInstance.getNumberOfArticles();
            assert.equal(numberOfArticles, 1, "number of articles must be one");
            const articlesForSale = await chainListInstance.getArticlesForSale();
            assert.equal(articlesForSale.length, 1, "there must be one article for sale");
            assert.equal(articlesForSale[0].toString(), 1, "article id must be 1");
            const article = await chainListInstance.articles(articlesForSale[0]);
            assert.equal(article[0].toString(), "1", "article id must be 1");
            assert.equal(article[1], seller, "seller must be " + seller);
            assert.equal(article[2], 0x0, "buyer must be empty");
            assert.equal(article[3], articleName1, "article name must be " + articleName1);
            assert.equal(
                article[4],
                articleDescription1,
                "article description must be " + articleDescription1
            );
            assert.equal(
                article[5].toString(),
                web3.utils.toWei(articlePrice1, "ether"),
                "article price must be " + web3.utils.toWei(articlePrice1, "ether")
            );
        });

        it("should let us sell a second article", async function() {
            const receipt = await chainListInstance.sellArticle(
                articleName2,
                articleDescription2,
                web3.utils.toWei(articlePrice2, "ether"),
                {from: seller}
            );
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
            assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
            assert.equal(receipt.logs[0].args._id.toString(), 2, "id must be 2");
            assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
            assert.equal(
                receipt.logs[0].args._name,
                articleName2,
                "event article name must be " + articleName2
            );
            assert.equal(
                receipt.logs[0].args._price.toString(),
                web3.utils.toWei(articlePrice2, "ether"),
                "event article price must be " + web3.utils.toWei(articlePrice2, "ether")
            );

            const numberOfArticles = await chainListInstance.getNumberOfArticles();
            assert.equal(numberOfArticles.toString(), 2, "number of articles must be two");

            const articlesForSale = await chainListInstance.getArticlesForSale();
            assert.equal(articlesForSale.length, 2, "there must be two article for sale");
            assert.equal(
                articlesForSale[1].toString(),
                2,
                "second article must have article id must be 2"
            );

            const article = await chainListInstance.articles(articlesForSale[1]);
            assert.equal(article[0].toString(), 2, "article id must be 2");
            assert.equal(article[1], seller, "seller must be " + seller);
            assert.equal(article[2], 0x0, "buyer must be empty");
            assert.equal(article[3], articleName2, "article name must be " + articleName2);
            assert.equal(
                article[4],
                articleDescription2,
                "article description must be " + articleDescription2
            );
            assert.equal(
                article[5].toString(),
                web3.utils.toWei(articlePrice2, "ether"),
                "article price must be " + web3.utils.toWei(articlePrice2, "ether")
            );
        });

        it("should buy an article", async function() {
            sellerBalanceBeforeBuy = parseFloat(
                web3.utils.fromWei(await web3.eth.getBalance(seller), "ether").toString()
            );
            buyerBalanceBeforeBuy = parseFloat(
                web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether").toString()
            );
            const receipt = await chainListInstance.buyArticle(1, {
                from: buyer,
                value: web3.utils.toWei(articlePrice1, "ether"),
            });
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
            assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
            assert.equal(receipt.logs[0].args._id.toString(), 1, "id must be 1");
            assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
            assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
            assert.equal(
                receipt.logs[0].args._name,
                articleName1,
                "event article name must be " + articleName1
            );
            assert.equal(
                receipt.logs[0].args._price.toString(),
                web3.utils.toWei(articlePrice1, "ether"),
                "event article price must be " + web3.utils.toWei(articlePrice1, "ether")
            );

            sellerBalanceAfterBuy = parseFloat(
                web3.utils.fromWei(await web3.eth.getBalance(seller), "ether").toString()
            );
            buyerBalanceAfterBuy = parseFloat(
                web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether").toString()
            );

            assert.equal(
                sellerBalanceAfterBuy - sellerBalanceBeforeBuy,
                articlePrice1,
                "seller should have earned " + articlePrice1 + " ETH"
            );
            assert.equal(
                buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice1,
                true,
                "seller should have earned " + articlePrice1 + " ETH"
            );
            assert.equal(
                buyerBalanceBeforeBuy - buyerBalanceAfterBuy >= articlePrice1,
                true,
                "gas price should not be zero"
            );
            const articlesForSale = await chainListInstance.getArticlesForSale();
            assert.equal(
                articlesForSale.length,
                1,
                "there should now be only 1 article left for sale"
            );
            assert.equal(
                articlesForSale[0].toString(),
                2,
                "article 2 should be the only article left for sale"
            );
            const numberOfArticles = await chainListInstance.getNumberOfArticles();
            assert.equal(
                numberOfArticles.toString(),
                2,
                "there should still be 2 articles in total"
            );
        });
    });
});
