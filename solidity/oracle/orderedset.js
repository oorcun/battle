module.exports = class OrderedSet {

	set = null

	constructor (iterable) {
		this.set = new Set(iterable)
		this.#order()
	}

	add (value) {
		this.set.add(value)
		this.#order()
		return this
	}

	delete (value) {
		this.set.delete(value)
		return this
	}

	#order () {
		this.set = new Set([...this.set].sort((a, b) => a - b))
	}

}
