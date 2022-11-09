const http = require('http')
const fs = require('fs')
const childProcess = require('child_process')
const pidFile = __dirname + '/pid'

let starting = false
let network = 'goerli'

function isOracleRunning () {
	try {
		const processId = Number(fs.readFileSync(pidFile))
		process.kill(processId, 0)
		return true
	} catch (error) {
		_console.error(error)
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

function oracleStartPromise (resolve) {
	if (isOracleRunning()) {
		resolve()
	} else {
		setTimeout(oracleStartPromise, 1000, resolve)
	}
}

// Starting the oracle takes time. Oracle became started if `isOracleRunning` returns true (e.g. PID recorded).
// After the process starts, there is a time period until the process records its PID.
// During this period another calls to start must be prevented in order to prevent running more than one oracle.
async function startOracle () {
	if (starting) {
		return false
	}
	starting = true
	const result = await processStart()
	starting = false
	return result
}

// It takes time for oracle to record its PID and expose itself for control checks.
// Therefore we must wait until `isOracleRunning` returns true.
async function processStart () {
	try {
		if (isOracleRunning()) {
			return false
		}
		const subProcess = childProcess.spawn(
			'truffle',
			['exec', 'oracle/oracled.js', '--network', network, '>', 'log/oracle.log'],
			{
				stdio: 'ignore',
				shell: true,
				detached: true
			}
		)
		subProcess.unref()
		await new Promise(oracleStartPromise)
		return true
	} catch (error) {
		_console.error(error)
		return false
	}
}

const server = http.createServer()
	.on('request', async (request, response) => {
		_console.log('request came')
		let result = false
		switch (request.url) {
		case '/start':
			_console.log('requested start')
			result = await startOracle()
			break
		case '/stop':
			_console.log('requested stop')
			result = stopOracle()
			break
		case '/check':
			_console.log('requested check')
			result = isOracleRunning()
			break
		}
		response.setHeader('Access-Control-Allow-Origin', '*')
		response.end(result ? '1' : '0')
	})

server.listen(8001)

if (process.argv[3] !== undefined) {
	network = process.argv[3]
}

const _console = {
	log: param => { console.log(Date() + '    ' + param) },
	error: param => {
		console.error(Date() + '    error')
		console.error(param)
	}
}
