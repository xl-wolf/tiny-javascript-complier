// 所以我们定义一个遍历器，它有两个参数，AST 和 vistor
function traverser(ast, visitor) {
    // 遍历树中每个节点，调用 traverseNode
    function traverseArray(array, parent) {
        if (typeof array.forEach === 'function')
            array.forEach(function (child) {
                traverseNode(child, parent);
            });
    }

    // 处理 ast 节点的函数, 使用 visitor 定义的转换函数进行转换
    function traverseNode(node, parent) {
        // 首先看看 visitor 中有没有对应 type 的处理函数。
        var method = visitor[node.type]
        // 如果有，参入参数
        if (method) {
            method(node, parent)
        }

        // 下面对每一个不同类型的结点分开处理。
        switch (node.type) {

            // 从顶层的 Program 开始
            case 'Program':
                traverseArray(node.body, node)
                break

            case 'VariableDeclaration':
                traverseArray(node.declarations, node)
                break

            case 'VariableDeclarator':
                traverseArray(node.init, node)
                break

            case 'AssignmentExpression':
                traverseArray(node.right, node)
                break

            // 如果是变量和数值，直接退出
            case 'Identifier':
            case 'Literal':
                break

            // 同样，如果不能识别当前的结点，那么就抛出一个错误。
            default:
                throw new TypeError(node.type)
        }
    }
    // 最后我们对 AST 调用 traverseNode，开始遍历。注意 AST 并没有父结点。
    traverseNode(ast, null)
}

// 定义我们的转换器函数，接收 AST 作为参数
module.exports = function transformer(ast) {
    // 创建新的 ast 抽象树
    var newAst = {
      type: 'Program',
      body: [],
      sourceType: "script"
    };
  
    // 下面是个代码技巧，在父结点上定义一个属性 context（上下文），之后，就可以把结点放入他们父结点的 context 中。
    ast._context = newAst.body
  
    // 我们把 AST 和 visitor 函数传入遍历器
    traverser(ast, {
      // 把 VariableDeclaration kind 属性进行转换
      VariableDeclaration: function(node, parent) {
        var variableDeclaration = {
          type: 'VariableDeclaration',
          declarations: node.declarations,
          kind: "var"
        };
        // 把新的 VariableDeclaration 放入到 context 中。
        parent._context.push(variableDeclaration)
      }
    });
    // 最后返回创建好的新 AST。
    return newAst
}
