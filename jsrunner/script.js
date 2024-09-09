/**
 * @returns {Array} Array containing position of every single occurrenct of searchString
 * @param {String} searchString
 */

/*String.prototype.indexOfAll = function(searchString) {
    let lastPos = this.indexOf(searchString)
    if(lastPos == -1) return [] 
    const indexes = [ ]
    while(lastPos > -1) {
        console.log(lastPos)
        indexes.push(lastPos)
        lastPos = this.indexOf(searchString, lastPos + 1)
    }
    return indexes
}*/

// let runner = function(){}

/**
 * @param {String} url 
 */
window.loadThis = function(url) {
    const xhttp = new XMLHttpRequest()
    xhttp.open('GET', url)
    xhttp.addEventListener('load', e => {
        if(xhttp.status != 200) return
        new Function(xhttp.responseText)()
    })
    xhttp.send()
}

function runCode(code) {
    const toRun = `const outDiv = document.getElementById('out')\noutDiv.innerHTML = ''\n${code}` 
    new Function(toRun)()
}

function saveCode(code) {
    const blob = new Blob([code])
    const bloburl = URL.createObjectURL(blob)
    console.log(bloburl)
    const link = document.createElement('a')
    link.href = bloburl
    const name = prompt('Enter Program Name:')
    link.download = `${name}.js`
    link.click()
}

function loadCode(code) {
    document.getElementById('code').value = code
}

window.onload = () => {
    document.getElementById('run').onclick = () => runCode(document.getElementById('code').value)
    document.getElementById('save').onclick = () => saveCode(document.getElementById('code').value)
    /**
     * @type {HTMLFormElement}
     */
    const loadForm = document.getElementById('load')
    loadForm.addEventListener('submit', e => {
        e.preventDefault()
        const file = e.target.elements.file.files[0]
        if(!file) return
        const reader = new FileReader()
        reader.addEventListener('load', e => {loadCode(reader.result)})
        reader.readAsText(file, 'utf-8')
    })
}
