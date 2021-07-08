// 语法解析函数，接收 tokens (tokenizer的返回结果) 作为参数

module.exports = function parser(tokens) {
    // 记录当前解析到词的位置
    var current = 0

    // 通过深度遍历来解析 token节点，定义 walk 函数
    function walk() {
        // 从当前 token 开始解析
        var token = tokens[current]
        // 获取下一个节点的 token
        var nextToken = tokens[current + 1]

        // 对于不同类型的结点，对应的处理方法也不同
        // 检查是不是数字类型
        if (token.type === 'Numeric') {
            // 如果是，current 自增。
            current++
            // 然后我们会返回一个新的 AST 结点
            return {
                type: 'Literal',
                value: Number(token.value),
                row: token.value
            }
        }

        // 检查是不是变量类型
        if (token.type === 'Identifier') {
            // 如果是，current 自增。
            current++;
            // 然后我们会返回一个新的 AST 结点
            return {
                type: 'Identifier',
                name: token.value,
            };
        }

        // 检查是不是运算符类型
        if (token.type === 'Punctuator') {
            // 如果是，current 自增。
            current++;
            // 判断运算符类型，根据类型返回新的 AST 节点
            if (/[\+\-\*/]/im.test(token.value))
                return {
                    type: 'BinaryExpression',
                    operator: token.value,
                }
            if (/\=/.test(token.value))
                return {
                    type: 'AssignmentExpression',
                    operator: token.value
                }
        }

        // 检查是不是关键字
        if (token.type === 'Keyword') {
            var value = token.value
            // 检查是不是定义语句
            if (value === 'var' || value === 'let' || value === 'const') {
                current++;
                // 获取定义的变量
                var variable = walk()
                // 判断是否是赋值符号
                var equal = walk()
                var rightVar
                if (equal.operator === '=') {
                    // 获取所赋予的值
                    rightVar = walk()
                } else {
                    // 不是赋值符号，说明只是定义变量
                    rightVar = null
                    current--
                }
                // 定义声明
                var declaration = {
                    type: 'VariableDeclarator',
                    id: variable, // 定义的变量
                    init: rightVar // 赋予的值
                }
                // 定义要返回的节点
                return {
                    type: 'VariableDeclaration',
                    declarations: [declaration],
                    kind: value,
                };
            }
        }

        // 遇到了一个类型未知的结点，就抛出一个错误。
        throw new TypeError(token.type);
    }
    // 现在，我们创建 AST，根结点是一个类型为 `Program` 的结点。
    var ast = {
        type: 'Program',
        body: [],
        sourceType: "script"
    };

    // 开始 walk 函数，把结点放入 ast.body 中。
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    // 最后我们的语法分析器返回 AST 
    return ast;
}
