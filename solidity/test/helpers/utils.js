async function shouldThrow (promise, reason)
{
    try {
        await promise
    } catch (error) {
        console.log("-------------------------")
        console.log(error)
        expect(reason).to.equal(getReason(error))
        return
    }

    assert(false, "contract didn't throw")
}

function getReason (error) {
    if (error.reason) {
        return error.reason
    }
}

module.exports = {
    shouldThrow
}
