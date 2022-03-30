const StarNotary = artifacts.require("StarNotary");

module.exports = function(deployer) {
  const name = "Star Notary Project";
  const symbol = "SNP";

  deployer.deploy(StarNotary, name, symbol);
};
