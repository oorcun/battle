const PlayerContract = artifacts.require("PlayerContract");

module.exports = function (deployer) {
  deployer.deploy(PlayerContract);
};
