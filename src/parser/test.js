const tokenizer = require('../tokenizer/index')
const parser = require('./index')

// 测试
var str = `
    let a = 1
    let b = 2
    const c = 4
`

var tokens = tokenizer(str)
console.log(tokens)
var ast = parser(tokens)
console.log(ast)