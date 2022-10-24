# What?

This is a simple game where players trying to win against each others by correctly predicting Bitcoin price directions over a minute. Rules of the game are simple: Predict the price for the next minute, and attack any player. If you are correct you win, if not you lose.

# Software?

Software consists of three parts:
- Smart contracts written with Solidity. It contains player and battle operations as well as price requests for required minutes. All contracts are thoroughly tested with automatic tests using the Truffle framework.
- Oracle daemon written with JavaScript. It is responsible for fetching (from Binance) and updating prices in smart contracts when required. The reason for this centralized oracle (instead of Chainlink) is because it is more challenging to implement and also faster for setting the prices quickly.
- Front-end web application written with Vue. This is a very basic application with no fancy stuff like transitions, animations or nice designs. In order to quickly update visuals, all information related to prices are directly fetched from Binance and only updated when the oracle updated the smart contracts (because they use the same API this is done in background automatically with no visual change to the user). To give a little semblance of battle, prices fetched from socket connection when the battle starts and updated in real-time with a bar to easily tell who is winning. When the battle finishes, players must wait for oracle to finish setting the price and must conclude the battles that they win to update their points. Currently, this application only supports Metamask wallet and only deployed on Goerli network.
