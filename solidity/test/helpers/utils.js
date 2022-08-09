async function shouldThrow (promise, reason)
{
    try {
        await promise
    } catch (error) {
        expect(reason).to.equal(getReason(error))
        return
    }

    assert(false, "contract didn't throw")
}

function getReason (error) {
    if (error.reason) {
        return error.reason
    }
    for (key in error.data) {
        if (key.startsWith("0x")) {
            return error.data[key].reason
        }
    }
}

module.exports = {
    shouldThrow
}
