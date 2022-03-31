const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");

    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    const _tx = await instance.buyStar(starId, {from: user2, value: balance});
    const gasUsed = web3.utils.toBN(_tx.receipt.gasUsed);
    const gasPrice = web3.utils.toBN(_tx.receipt.effectiveGasPrice);
    // console.log(tx, _tx);

    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    assert.equal(web3.utils.toBN(balanceOfUser2BeforeTransaction).toString(), web3.utils.toBN(starPrice).add(web3.utils.toBN(balanceAfterUser2BuysStar)).add(gasPrice.mul(gasUsed)).toString());
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
   const instance = await StarNotary.deployed();

   assert.equal(await instance.name.call(), "Star Notary Project");
   assert.equal(await instance.symbol.call(), "SNP");
});

it('lookUptokenIdToStarInfo test', async() => {
    const from = accounts[1];
    const starName = "My special star";
    const starId = 6;

    const instance = await StarNotary.deployed();
    await instance.createStar(starName, starId, { from });

    assert.equal(await instance.lookUptokenIdToStarInfo.call(starId), starName);
});

it('lets 2 users exchange stars', async() => {
    const owner1 = accounts[1];
    const starName1 = "Star of owner 1";
    const starId1 = 7;
    const owner2 = accounts[2];
    const starName2 = "Star of owner 2";
    const starId2 = 8;

    const instance = await StarNotary.deployed();
    await instance.createStar(starName1, starId1, { from: owner1 });
    await instance.createStar(starName2, starId2, { from: owner2 });

    await instance.exchangeStars(starId1, starId2, { from: owner1 })

    assert.equal(await instance.ownerOf.call(starId1), owner2);
    assert.equal(await instance.ownerOf.call(starId2), owner1);
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
});

