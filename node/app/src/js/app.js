var App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,
    loading: false,

    init: async function() {
        return App.initWeb3();
    },

    initWeb3: async function() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            // ask user for consent to give consent
            try {
                await window.ethereum.enable();
                App.displayAccountInfo();
                return App.initContract();
            } catch (error) {
                // user deny
                console.error("Unable to retrieve your account");
            }
        } else {
            //no dapp browser
            console.log("Non-ethereum browser detected. You should consider trying Metamask");
        }
    },
    displayAccountInfo: async function() {
        const accounts = await window.web3.eth.getAccounts();
        App.account = accounts[0];
        if (App.account != null) {
            $("#account").text("Hi: " + App.account.slice(0, 7) + "...");
        } else {
            $("#account").text("Not logged In");
        }

        const balance = await window.web3.eth.getBalance(App.account);
        $("#accountBalance").text(window.web3.utils.fromWei(balance, "ether") + " ETH");
    },

    initContract: async function() {
        $.getJSON("ChainList.json", function(chainListArtifact) {
            App.contracts.ChainList = TruffleContract(chainListArtifact);
            App.contracts.ChainList.setProvider(window.web3.currentProvider);
            App.listenToEvents();
            return App.reloadArticles();
        });
    },
    reloadArticles: async function() {
        // avoid reentry
        if (App.loading) {
            return;
        }
        App.loading = true;

        // refresh account because the balance may have changed
        App.displayAccountInfo();

        try {
            const chainListInstance = await App.contracts.ChainList.deployed();
            const articleIds = await chainListInstance.getArticlesForSale();
            $("#articlesRow").empty();
            for (let i = 0; i < articleIds.length; i++) {
                const article = await chainListInstance.articles(articleIds[i]);
                App.displayArticle(article[0], article[1], article[3], article[4], article[5]);
            }
            App.loading = false;
        } catch (error) {
            console.error(error);
            App.loading = false;
        }
    },

    displayArticle: function(id, seller, name, description, price) {
        const articlesRow = $("#articlesRow");
        const etherPrice = web3.utils.fromWei(price, "ether");
        const articleTemplate = $("#articleTemplate");

        articleTemplate.find(".panel-title").text(name);
        articleTemplate.find(".article-description").text(description);
        articleTemplate.find(".article-price").text(etherPrice + " ETH");
        articleTemplate.find(".btn-buy").attr("data-id", id);
        articleTemplate.find(".btn-buy").attr("data-value", etherPrice);

        articleTemplate.find(".article-seller").text(seller);
        if (seller == App.account) {
            articleTemplate.find(".article-seller").append(" (You)".bold());
            articleTemplate.find(".btn-buy").prop("disabled", true);
            articleTemplate.find(".btn-buy").prop("title", "Not allowed to buy your own item");
        } else {
            articleTemplate.find(".btn-buy").prop("disabled", false);
            articleTemplate.find(".btn-buy").prop("title", "Buy item");
        }
        articlesRow.append(articleTemplate.html());
    },

    sellArticle: async function() {
        const articlePriceValue = parseFloat($("#article_price").val());
        const articlePrice = isNaN(articlePriceValue) ? "0" : articlePriceValue.toString();
        const _name = $("#article_name").val();
        const _description = $("#article_description").val();
        const _price = window.web3.utils.toWei(articlePrice, "ether");
        if (_name.trim() == "" || _price == "0") {
            return false;
        }
        try {
            const chainListInstance = await App.contracts.ChainList.deployed();
            const transactionReceipt = await chainListInstance
                .sellArticle(_name, _description, _price, {from: App.account, gas: 5000000})
                .on("transactionHash", hash => {
                    console.log("transaction hash", hash);
                });
            console.log("transaction receipt", transactionReceipt);
        } catch (error) {
            console.error(error);
        }
    },
    buyArticle: async function() {
        event.preventDefault();
        var _articleId = $(event.target).data("id");
        const articlePriceValue = parseFloat($(event.target).data("value"));
        const articlePrice = isNaN(articlePriceValue) ? "0" : articlePriceValue.toString();
        const _price = window.web3.utils.toWei(articlePrice, "ether");
        try {
            const chainListInstance = await App.contracts.ChainList.deployed();
            const transactionReceipt = await chainListInstance
                .buyArticle(_articleId, {
                    from: App.account,
                    value: _price,
                    gas: 5000000,
                })
                .on("transactionHash", hash => {
                    console.log("transaction hash", hash);
                });
            console.log("transaction receipt", transactionReceipt);
        } catch (error) {
            console.error(error);
        }
    },
    listenToEvents: async function() {
        const chainListInstance = await App.contracts.ChainList.deployed();

        if (App.logSellArticleEventListener == null) {
            console.log("subscribe to sell events");
            App.logSellArticleEventListener = chainListInstance
                .LogSellArticle({fromBlock: "0"})
                .on("data", event => {
                    $("#" + event.id).remove();
                    $("#events").append(
                        '<li class="list-group-item" id="' +
                            event.id +
                            '">' +
                            event.returnValues._name +
                            " is for sale</li>"
                    );
                    App.reloadArticles();
                })
                .on("error", error => {
                    console.error(error);
                });
        }

        if (App.logBuyArticleEventListener == null) {
            console.log("subscribe to buy events");
            App.logBuyArticleEventListener = chainListInstance
                .LogBuyArticle({fromBlock: "0"})
                .on("data", event => {
                    $("#" + event.id).remove();
                    $("#events").append(
                        '<li class="list-group-item" id="' +
                            event.id +
                            '">' +
                            event.returnValues._buyer +
                            " bought " +
                            event.returnValues._name +
                            "</li>"
                    );
                    App.reloadArticles();
                })
                .on("error", error => {
                    console.error(error);
                });
        }
        $("#events")[0].className = "list-group-collapse collapse-in collapse in";
    },

    stopListeningToEvents: async () => {
        if (App.logSellArticleEventListener != null) {
            console.log("unsubscribe from sell events");
            await App.logSellArticleEventListener.removeAllListeners();
            App.logSellArticleEventListener = null;
        }
        if (App.logBuyArticleEventListener != null) {
            console.log("unsubscribe from buy events");
            await App.logBuyArticleEventListener.removeAllListeners();
            App.logBuyArticleEventListener = null;
        }
        $("#events")[0].className = "list-group-collapse collapse-in collapse";
    },
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});

$(function() {
    $("#toggle-subscription").change(() => {
        if ($("#toggle-subscription").prop("checked")) {
            App.listenToEvents();
        } else {
            App.stopListeningToEvents();
        }
    });
});

$(function() {
    $("#toggle-events").on("hidden.bs.collapse", () => {
        console.log("hde");
    });
});

window.ethereum.on("accountsChanged", function() {
    App.displayAccountInfo();
    App.reloadArticles();
});
