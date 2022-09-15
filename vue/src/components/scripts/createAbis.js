const fs = require('fs')

const playerContract = require('../../../../solidity/build/contracts/PlayerContract.json')

fs.writeFileSync('src/components/abis/PlayerContract.js', 'export default ' + JSON.stringify(playerContract.abi, null, '\t'))
