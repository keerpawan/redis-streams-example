'use strict'

const {Readable} = require('stream')

const createReader = (redis, key, opt = {}) => {
	// by setting this property you can set how long to wait for
	// 0 = Forever
	// 1 = 1ms
	const block = opt.block || 0

	// maintain internal cursor pointer
	let cursor = opt.cursor || 0

	const onData = (err, res) => {
		if (err) {
			out.emit('error', err)
			return
		}

		// end of stream?
		if (!res) {
			out.push(null)
			return
		}

		// unpack result, move cursor
		const rows = res[0][1] // get rows for the only stream we queried
		const nrOfRows = rows.length
		cursor = rows[nrOfRows - 1][0]

		// parse rows and emit items
		for (let i = 0; i < nrOfRows; i++) {
			const raw = rows[i][1]
			const message = {}
			for (let i = 0; i < raw.length; i += 2) message[raw[i]] = raw[i + 1]
			const id = rows[i][0]
			out.push({ id, message })
		}
	}

	const read = (count) => {
		redis.xread('count', count, 'block', block, 'streams', key, cursor, onData)
	}

	const out = new Readable({
		objectMode: true,
		highWaterMark: 32,
		read
	})
	return out
}

module.exports = createReader
