/* global artifacts, contract */
const ChainList = artifacts.require("./ChainList.sol");

// test suite
contract("ChainList", function(accounts) {
    let chainListInstance;
    const seller = accounts[0];
    const buyer = accounts[1];
    const articleName = "article 1";
    const articleDescription = "Description for article 1";
    const articlePrice = "10";
    const articlePriceInWei = web3.utils.toWei(articlePrice, "ether");

    describe("Testing exceptions", function() {
        // add a test hook
        beforeEach("set up", async function() {
            chainListInstance = await ChainList.deployed();
        });

        function article1RemainUnchanged(article) {
            assert.equal(article[0].toString(), 1, "article is must be 1");
            assert.equal(article[1], seller, "seller must be " + seller);
            assert.equal(article[2], 0x0, "buyer must be empty");
            assert.equal(article[3], articleName, "article name must be " + articleName);
            assert.equal(
                article[4],
                articleDescription,
                "article description must be " + articleDescription
            );
            assert.equal(
                article[5].toString(),
                web3.utils.toWei(articlePrice, "ether"),
                "article price must be " + web3.utils.toWei(articlePrice, "ether")
            );
        }

        it("should throw an exception if you try to buy an article when there is n article for sale yet", async function() {
            try {
                await chainListInstance.buyArticle(1, {
                    from: buyer,
                    value: web3.utils.toWei(articlePrice, "ether"),
                });
                // test case should fail if no error is thrown
                assert.fail();
            } catch (error) {
                assert.equal(error.reason, "must have at least one article to buy");
            }
            const numberOfArticles = await chainListInstance.getNumberOfArticles();
            assert.equal(numberOfArticles.toString(), 0, "number of article must be zero");
        });

        it("should throw exception if you try to buy an article that does not exist", async function() {
            await chainListInstance.sellArticle(
                articleName,
                articleDescription,
                web3.utils.toWei(articlePrice, "ether"),
                { from: seller }
            );
            try {
                await chainListInstance.buyArticle(2, {
                    from: buyer,
                    value: web3.utils.toWei(articlePrice, "ether"),
                });
                assert.fail();
            } catch (error) {
                assert.equal(error.reason, "must be a valid articleId");
            }
            const article1 = await chainListInstance.articles(1);
            article1RemainUnchanged(article1);
        });

        it("should throw exception if you try to buy your own article", async function() {
            try {
                await chainListInstance.buyArticle(1, {
                    from: seller,
                    value: articlePriceInWei,
                });
                assert.fail();
            } catch (error) {
                assert.equal(error.reason, "must not be able to buy own article");
            }
            const article1 = await chainListInstance.articles(1);
            article1RemainUnchanged(article1);
        });

        it("should throw exception if you try to buy an article with a wrong price", async function() {
            try {
                await chainListInstance.buyArticle(1, {
                    from: buyer,
                    value: 0,
                });
                assert.fail();
            } catch (error) {
                assert.equal(error.reason, "value provided must match price of article");
            }
            const article1 = await chainListInstance.articles(1);
            article1RemainUnchanged(article1);
        });

        it("should throw an exception if you try to buy an article that has been sold", async function() {
            await chainListInstance.buyArticle(1, {
                from: buyer,
                value: articlePriceInWei,
            });
            try {
                await chainListInstance.buyArticle(1, {
                    from: buyer,
                    value: articlePriceInWei,
                });
                assert.fail();
            } catch (error) {
                assert.equal(error.reason, "must not be able to buy an article that has been sold");
            }

            const article = await chainListInstance.articles(1);
            assert.equal(article[0].toString(), 1, "article is must be 1");
            assert.equal(article[1], seller, "seller must be " + seller);
            assert.equal(article[2], buyer, "buyer must be " + buyer);
            assert.equal(article[3], articleName, "article name must be " + articleName);
            assert.equal(
                article[4],
                articleDescription,
                "article description must be " + articleDescription
            );
            assert.equal(
                article[5].toString(),
                web3.utils.toWei(articlePrice, "ether"),
                "article price must be " + web3.utils.toWei(articlePrice, "ether")
            );
        });
    });
});
