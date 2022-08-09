const PlayerContract = artifacts.require("PlayerContract")

const utils = require("./helpers/utils.js")

contract("PlayerContract", accounts => {

    let instance, sender

    beforeEach(async () => {
        instance = await PlayerContract.new()
        sender = accounts[0]
    })

    context("PLAYER CREATION", async () => {

        it("should create player if no player exists for sender", async () => {
            let player = await instance.addressToPlayer(sender)
            expect(player.id.toNumber()).to.equal(0)

            let result = await instance.createPlayer("orcun")

            player = await instance.players(0)
            expect(player.id.toNumber()).to.equal(1)

            player = await instance.addressToPlayer(sender)
            expect(player.name).to.equal("orcun")
            expect(player.id.toNumber()).to.equal(1)
            expect(player.winCount.toNumber()).to.equal(0)
            expect(player.lossCount.toNumber()).to.equal(0)

            expect(result.receipt.status).to.equal(true)
            expect(result.logs[0].event).to.equal("NewPlayerCreated")
            expect(result.logs[0].args[0].toNumber()).to.equal(1)
            expect(result.logs[0].args[1]).to.equal("orcun")
        })

        it("should throw error if player already exists for sender", async () => {
            await instance.createPlayer("orcun")

            await utils.shouldThrow(
                instance.createPlayer("orcun"),
                "Player: player already exists for address"
            )
        })

    })

    context("PLAYER FETCHING", async () => {

        it("should fetch created player", async () => {
            await instance.createPlayer("orcun")
            player = await instance.getPlayer()

            expect(player.name).to.equal("orcun")
            expect(player.id).to.equal("1")
            expect(player.winCount).to.equal("0")
            expect(player.lossCount).to.equal("0")
        })

        it("should throw error if player not exists for address", async () => {
            await utils.shouldThrow(
                instance.getPlayer(),
                "Player: player not exist for address"
            )
        })

    })

})
