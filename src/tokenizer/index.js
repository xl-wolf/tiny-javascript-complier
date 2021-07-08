// 解析代码，最后返回 tokens
module.exports = function tokenizer(input) {
    // 记录当前解析到代码的位置
    var current = 0
    // tokens 用来保存我们解析的 token
    var tokens = []

    // 利用循环进行解析
    while (current < input.length) {
        // 提取出当前要解析的字符
        var char = input[current]

        // 处理符号: 检查是否是符号
        var PUNCTUATOR = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
        if (PUNCTUATOR.test(char)) {
            // 创建变量用于保存匹配的符号
            var punctuators = char
            // 判断是否箭头函数
            if (char === '=' && input[current + 1] === '>') {
                punctuators += input[++current]
            }
            current++;
            // 最后把数据更新到 tokens 中
            tokens.push({
                type: 'Punctuator',
                value: punctuators
            })
            // 进入下一次循环
            continue
        }

        // 处理空格: 如果是空格，则直接进入下一个循环
        var WHITESPACE = /\s/
        if (WHITESPACE.test(char)) {
            current++
            continue
        }

        // 处理数字: 检查是否是数字
        var NUMBERS = /[0-9]/
        if (NUMBERS.test(char)) {
            // 创建变量用于保存匹配的数字
            var number = ''
            // // 循环遍历接下来的字符，直到下一个字符不是数字为止
            while (NUMBERS.test(char)) {
                number += char
                char = input[++current]
            }
            // 最后把数据更新到 tokens 中
            tokens.push({
                type: 'Numeric',
                value: number
            })
            // 进入下一次循环
            continue
        }

        // 处理字符: 检查是否是字符
        var LETTERS = /[a-z]/i
        if (LETTERS.test(char)) {
            var value = ''

            // 用一个循环遍历所有的字母，把它们存入 value 中。
            while (LETTERS.test(char)) {
                value += char
                char = input[++current]
            }
            // 判断当前字符串是否是关键字
            KEYWORD = /function|var|return|let|const|if|for/i
            if (KEYWORD.test(value)) {
                // 标记关键字
                tokens.push({
                    type: 'Keyword',
                    value: value
                })
            } else {
                // 标记变量
                tokens.push({
                    type: 'Identifier',
                    value: value
                })
            }
            // 进入下一次循环
            continue
        }
        // 最后如果我们没有匹配上任何类型的 token，那么我们抛出一个错误。
        throw new TypeError('I dont know what this character is: ' + char)
    }
    // 词法分析器的最后我们返回 tokens 数组。
    return tokens
}
