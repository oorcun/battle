async function shouldThrow (promise, reason)
{
    try {
        await promise
    } catch (error) {
        expect(reason).to.equal(error.reason)
        return
    }

    assert(false, "contract didn't throw")
}

module.exports = {
    shouldThrow
}
