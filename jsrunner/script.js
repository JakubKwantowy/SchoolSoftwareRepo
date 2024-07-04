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

window.onload = () => document.getElementById('run').onclick = () => runCode(document.getElementById('code').value)
