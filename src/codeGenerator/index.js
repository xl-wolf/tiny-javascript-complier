module.exports = function codeGenerator(node) {
    // 对于不同类型的结点分开处理
    switch (node.type) {
        // 如果是 Program 结点，那么我们会遍历它的 body 属性中的每一个结点。
        case 'Program':
            return node.body.map(codeGenerator)
                .join('\n')

        // VariableDeclaration 结点
        case 'VariableDeclaration':
            return (
                node.kind + ' ' + node.declarations.map(codeGenerator).join('\n')
            )

        // VariableDeclarator 节点
        case 'VariableDeclarator':
            return (
                codeGenerator(node.id) + ' = ' +
                codeGenerator(node.init)
            )

        // 处理变量
        case 'Identifier':
            return node.name

        // 处理数值
        case 'Literal':
            return node.value

        // 如果我们不能识别这个结点，那么抛出一个错误。
        default:
            throw new TypeError(node.type)
    }
}
