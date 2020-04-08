pragma solidity ^0.5;

contract ChainList {
    // custom types
    struct Article {
        uint id;
        address payable seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }


    // when it is declared public, the getter is auto generated
    mapping(uint => Article) public articles;
    uint articleCounter;

    // state variables
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;

    // events
    event LogSellArticle(
        uint indexed _id,
        address indexed _seller,
        string _name,
        uint256 _price
    );

    event LogBuyArticle(
        uint indexed _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // sell an article
    function sellArticle(string memory _name, string memory _description, uint256 _price) public {
        articleCounter++;
        articles[articleCounter] = Article(
            articleCounter,
            msg.sender,
            address(0),
            _name,
            _description,
            _price
        );
        emit LogSellArticle(articleCounter, msg.sender, _name, _price);
    }

    function getNumberOfArticles() public view returns (uint) {
        return articleCounter;
    }

    function getArticlesForSale() public view returns (uint[] memory) {
        // declaring memory make is more efficient, by default all variables are stored as storagee
        uint[] memory articleIds = new uint[](articleCounter);

        uint numberOfArticlesForSale = 0;

        for(uint i = 1; i <= articleCounter; i++) {
            if(articles[i].buyer == address(0)) {
                articleIds[numberOfArticlesForSale] = articles[i].id;
                numberOfArticlesForSale++;
            }

        }
        uint[] memory forSale = new uint[](numberOfArticlesForSale);
        for(uint j = 0; j < numberOfArticlesForSale; j++) {
            forSale[j] = articleIds[j];
        }
        return forSale;
    }


    // buy an article
    function buyArticle(uint _id) public payable {
        require(articleCounter > 0, "must have at least one article to buy");
        require(_id > 0 && _id <= articleCounter, "must be a valid articleId");
        Article storage article = articles[_id];
        require(article.buyer == address(0), "must not be able to buy an article that has been sold");
        require(msg.sender != article.seller, "must not be able to buy own article");
        require(msg.value == article.price, "value provided must match price of article");

        // keep buyer's information
        article.buyer = msg.sender;

        // the buyer can pay the seller
        article.seller.transfer(msg.value);

        // trigger the event
        emit LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
    }
}
