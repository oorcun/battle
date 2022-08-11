async function shouldThrow (promise, reason = '')
{
	try {
		await promise
	} catch (error) {
		if (reason) {
			expect(reason).to.equal(getReason(error))
		}
		return
	}

	assert(false, 'contract did not throw')
}

function getCurrentMinuteTimestamp () {
	return Math.floor(Math.floor(Date.now() / 1000) / 60) * 60
}




function getReason (error) {
	if (error.reason) {
		return error.reason
	}
	for (let key in error.data) {
		if (key.startsWith('0x')) {
			return error.data[key].reason
		}
	}
}




module.exports = {
	shouldThrow,
	getCurrentMinuteTimestamp
}
