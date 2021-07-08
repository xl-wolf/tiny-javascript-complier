const tokenizer = require('./tokenizer/index')
const parser = require('./parser/index')
const transformer = require('./transformer/index')
const codeGenerator = require('./codeGenerator/index')

// 测试
var str = `
    let a = 1
    let b = 2
    const c = 4
`

var tokens = tokenizer(str)
// console.log('tokens',tokens)
var ast = parser(tokens)
// console.log('ast',ast)
var newAst = transformer(ast);
// console.log('newAst',newAst)
var newCode = codeGenerator(newAst)
console.log(`newCode
${newCode}`)
