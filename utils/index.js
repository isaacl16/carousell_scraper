const fs = require('fs');

exports.readData = (fileName) => {
    console.log('Begin read: ' + fileName)
    try {
        const data = fs.readFileSync(`./data/${fileName}`)
        console.log("Read complete: " + fileName)
        return JSON.parse(data)
    } catch (err) {
        console.log('File not found: ' + fileName)
        return {}
    }
}

exports.writeData = (fileName, data) => {
    console.log('Begin write: ' + fileName)
    const jsonString = JSON.stringify(data)
    fs.writeFile(`./data/${fileName}`, jsonString, 'utf8', () => {
        console.log("Write complete: " + fileName)
    });
    return
}