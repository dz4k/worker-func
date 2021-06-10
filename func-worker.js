
let func

onmessage = e => {
	switch (e.data.type) {
	case 'init':
		func = new Function(...e.data.args)
		postMessage({ type: 'didInit' })
		break;
	case 'call':
		const id = e.data.id
		try {
			postMessage({ type: 'resolve', id, value: func(...e.data.args) })
		} catch (error) {
			postMessage({ type: 'reject', id, error })
		}
		break;
	}
}
