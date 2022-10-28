const http = require('http')
const { isOracleRunning, startOracle, stopOracle } = require('./oracleOperations.js')

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
