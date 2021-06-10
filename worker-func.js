
let idCounter = 0

function workerFunc(...funcData) {
	return new Promise((resolve, reject) => {

		const worker = new Worker('./func-worker.js')

		worker.postMessage({ type: 'init', args: funcData })

		worker.addEventListener('message', e => {
			resolve(function call(...args) {
				return new Promise((resolve, reject) => {
					const id = idCounter++

					console.log(`Sending: id (${id}) args (${JSON.stringify(args)})`)

					worker.postMessage({ type: 'call', id, args })
					worker.addEventListener('message', function onsettle(e) {
						if (e.data.id === id) {
							console.log(`Worker responded: ${JSON.stringify(e.data)}`)

							worker.removeEventListener('message', onsettle)
							if (e.data.type === 'resolve') resolve(e.data.value)
							else if (e.data.type === 'reject') reject(e.data.error)
						}
					})
				})
			})
		}, { once: true })
	})
}
