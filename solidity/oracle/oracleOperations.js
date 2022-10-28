const fs = require('fs')
const childProcess = require('child_process')
const pidFile = __dirname + '/pid'

function isOracleRunning () {
	try {
		const processId = Number(fs.readFileSync(pidFile))
		process.kill(processId, 0)
		return true
	} catch {
		return false
	}
}

function stopOracle () {
	try {
		const processId = Number(fs.readFileSync(pidFile))
		process.kill(processId, 'SIGINT')
		return true
	} catch {
		return false
	}
}

function startOracle () {
	try {
		if (isOracleRunning()) {
			return false
		}
		const subProcess = childProcess.spawn(
			'truffle',
			['exec', 'oracle/oracled.js', '--network', 'goerli', '>', 'log/oracle.log'],
			{
				stdio: 'ignore',
				shell: true
			}
		)
		subProcess.unref()
		return true
	} catch {
		return false
	}
}

module.exports = {
	isOracleRunning,
	startOracle,
	stopOracle
}

// if (process.argv.length !== 3) {
// 	console.info('Usage: node oracleOperations.js --[start|stop|check]')
// }

// switch (process.argv[2]) {
// case '--start':
// 	console.info(startOracle())
// 	break
// case '--stop':
// 	console.info(stopOracle())
// 	break
// case '--check':
// 	console.info(isOracleRunning())
// 	break
// }
