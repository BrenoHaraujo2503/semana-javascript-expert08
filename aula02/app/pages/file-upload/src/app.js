import Clock from './deps/clock.js';
import View from './view.js'

const view = new View()
const clock = new Clock()

const worker = new Worker('./src/worker/worker.js', { 
    type: 'module'
})

worker.onerror = (error) => {
    console.error('WORKER', error)
}

worker.onmessage = ({data}) => {
    if(data.status !== 'done') return;

    clock.stop()
    view.updatedElapsedTime(`Process took ${took.replace('ago', '')}`)
    if(!data.buffers) return;
    view.downloadBlobAsFile(
        data.buffers,
        data.filename
    )
}

let took = ''
view.configureOnFileChange(file => {
    const canvas = view.getCanvas()
    worker.postMessage({
        file,
        canvas
    }, [
        canvas
    ])

    clock.start((time) => {
        took = time;
        view.updatedElapsedTime(`Process started ${time}`)
    })
})

async function fakeFetch() {
    const filePath = '/videos/frag_bunny.mp4'
    const response = await fetch(filePath)

    // Tamanho do arquivo!
    // const response = await fetch(filePath, {
    //     method: 'HEAD'
    // })
    // response.headers.get('content-length')
    // debugger
    const file = new File([await response.blob()], filePath, {
        type: 'video/mp4',
        lastModified: Date.now()
    })
    const event = new Event('change')
    Reflect.defineProperty(event, 'target', { value: { files: [file] } })

    document.getElementById('fileUpload').dispatchEvent(event)
}