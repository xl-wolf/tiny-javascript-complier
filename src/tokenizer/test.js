const tokenizer = require('./index') 
// 测试
var str = `
    let a = 1
    let b = 2
    const c = 4
`

var newStr = tokenizer(str)
console.log(newStr)