function generateNCharAlphaNumeric(length){

    const charSet = "abcdefghijklmnopqrstuvwxyz";
    let output = "";
    for(let i = 0; i < length; i++){
        output += charSet[Math.floor(Math.random() * (charSet.length - 1))]
    }

    return output;

}

module.exports = { generateNCharAlphaNumeric };