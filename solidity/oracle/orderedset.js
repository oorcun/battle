module.exports = class OrderedSet {

	set = null

	constructor (iterable) {
		this.set = new Set(iterable)
	}

	add (value) {
		this.set = new Set([...this.set.add(value)].sort())
		return this
	}

	delete (value) {
		this.set.delete(value)
		return this
	}

}
