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

function runCode(code) {
    let runner = function(){}
    const toRun = `const outDiv = document.getElementById('out')\noutDiv.innerHTML = ''\n${code}` 
    runner = new Function(toRun)
    runner()
}

window.onload = () => document.getElementById('run').onclick = () => runCode(document.getElementById('code').value)
