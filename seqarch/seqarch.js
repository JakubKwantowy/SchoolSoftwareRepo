/**
 * @param {Uint8Array} data 
 */
const PointerBuffer = function (data) {
    this.data = data
    this.pointer = 0
}

/**
 * @returns {Number}
 * @param {Uint8Array} buffer 
 */
function bufferToNum(buffer) {
    let num = 0
    for(v of buffer.reverse()) {
        num = num << 8
        num = num | v
    }
    return num
}

/**
 * @returns {Uint8Array}
 * @param {Number} num 
 */
function numToBuffer(num) {
    let a = num
    const buffer = new Uint8Array(8)
    for(let i=0;i<8;i++) {
        buffer[i] = a & 255
        a = a >> 8
    }
    return buffer
}


/**
 * @param {Number} length 
 * @returns {Uint8Array} 
 */
PointerBuffer.prototype.read = function (length) {
    this.pointer += length
    return this.data.slice(this.pointer - length, this.pointer)
}

/**
 * @param {String} name
 * @param {Number} dtype
 * @param {Uint8Array} data 
 */
const ArchiveEntry = function (name, dtype, data) {
    this.name = name
    this.dtype = dtype & 255
    this.data = data
}

const SequentialArchive = function () {
    /**
     * @type {Object.<string, ArchiveEntry>}
     */
    this.entries = {}
}

/**
 * @param {ArchiveEntry} entry 
 */
SequentialArchive.prototype.put = function (entry) {
    this.entries[entry.name] = entry
}

/**
 * @returns {ArchiveEntry}
 * @param {String} name 
 */
SequentialArchive.prototype.get = function (name) {
    return this.entries[name]
}

/**
 * @param {String} name 
 */
SequentialArchive.prototype.rm = function (name) {
    if(name in this.entries) 
        delete this.entries[name]
}

/**
 * @param {PointerBuffer} input
 */
SequentialArchive.prototype.parse = function (input) {
    let buffer = input.read(8)
    const header = '_SEQARC_'
    for(let i=0;i<8;i++) {
        if(buffer[i] != header.charCodeAt(i)) {
            alert('Error: Bad Archive Header!')
            return
        }
    }
    buffer = input.read(16)
    while(buffer.length) {
        const namebuffer = new Uint8Array(17)
        namebuffer.set(buffer, 0)
        const name = new TextDecoder('utf-8').decode(namebuffer.slice(0, namebuffer.indexOf(0)))
        const dtype = input.read(1)[0]
        buffer = input.read(8)
        const length = bufferToNum(buffer)
        const data = input.read(length)
        const entry = new ArchiveEntry(name, dtype, data)
        this.put(entry)
        buffer = input.read(16)
    }
}

/**
 * @returns {Uint8Array}
 */
SequentialArchive.prototype.toRaw = function () {
    let data = new TextEncoder('utf-8').encode('_SEQARC_')
    for(const name in current_archive.entries) {
        const entry = current_archive.get(name)
        const unpaddedname = new TextEncoder('utf-8').encode(name.substring(0, 16))
        const ename = new Uint8Array(16)
        ename.fill(0)
        ename.set(unpaddedname, 0)
        const dtype = new Uint8Array([entry.dtype])
        const size = numToBuffer(entry.data.length)
        const edata = entry.data
        const rawentry = new Uint8Array(25 + edata.length)
        rawentry.set(ename, 0)
        rawentry.set(dtype, 16)
        rawentry.set(size, 17)
        rawentry.set(edata, 25)
        
        const olddata = data
        data = new Uint8Array(olddata.length + rawentry.length)
        data.set(olddata, 0)
        data.set(rawentry, olddata.length)
    }
    return data
}

function archiveToScreen() {
    const display = document.getElementById('display')
    display.innerHTML = ''
    for(const name in current_archive.entries) {
        const entry = current_archive.get(name)
        display.innerHTML += `<a href="javascript:blobify('${name}')">${name}</a> | ${entry.dtype} | ${entry.data.length} | <a href="javascript:remove('${name}')">DEL</a><br>`
    }
}

function blobify(name) {
    const blob = new Blob([current_archive.get(name).data])
    const url = URL.createObjectURL(blob)
    const downloader = document.createElement('a')
    downloader.href = url
    downloader.target = '_blank'
    downloader.click()
}

function download_archive() {
    const data = current_archive.toRaw()
    const blob = new Blob([data])
    const url = URL.createObjectURL(blob)
    const downloader = document.createElement('a')
    downloader.href = url
    downloader.target = '_blank'
    downloader.download = 'archive.sea'
    downloader.click()
}

function remove(name) {
    current_archive.rm(name)
    archiveToScreen()
}

let current_archive = new SequentialArchive()

document.getElementById('loader').addEventListener('change', e => {
    const file = e.target.files[0]
    if(file == undefined) return
    const reader = new FileReader()
    reader.addEventListener('load', e => {
        const data = new Uint8Array(reader.result)
        const archive = new SequentialArchive()
        archive.parse(new PointerBuffer(data))
        current_archive = archive
        archiveToScreen()
    })
    reader.readAsArrayBuffer(file)
})

document.getElementById('uploader').addEventListener('submit', e => {
    e.preventDefault()
    console.log('test')
    const name = e.target.elements.name.value
    const dtype = parseInt(e.target.elements.type.value)
    const file = e.target.elements.file.files[0]
    if(file && name && (dtype != NaN)) {
        const reader = new FileReader()
        reader.addEventListener('load', e => {
            const data = new Uint8Array(reader.result)
            const entry = new ArchiveEntry(name, dtype, data)
            current_archive.put(entry)
            archiveToScreen()
        })
        reader.readAsArrayBuffer(file)
    }
})
