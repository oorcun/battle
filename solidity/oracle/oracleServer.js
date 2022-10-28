const http = require('http')
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

const server = http.createServer()
	.on('request', (request, response) => {
		let result = false
		switch (request.url) {
		case '/start':
			result = startOracle()
			break
		case '/stop':
			result = stopOracle()
			break
		case '/check':
			result = isOracleRunning()
			break
		}
		response.end(result ? '1' : '0')
	})

server.listen(8001)
