const vscode = require('vscode')

function colonize (option) {
  var editor = vscode.window.activeTextEditor
  if (!editor) return

  vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {
    var lineIndex = editor.selection.active.line
    var lineObject = editor.document.lineAt(lineIndex)
    var lineLength = lineObject.text.length

    if (lineObject.text.charAt(lineLength - 1) !== ';' && !lineObject.isEmptyOrWhitespace) {
      var insertionSuccess = editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(lineIndex, lineLength), ';')
      })

      if (!insertionSuccess) return
    }

    if (option === 'hold') return

    option === 'endline'
      ? vscode.commands.executeCommand('cursorEnd')
      : vscode.commands.executeCommand('editor.action.insertLineAfter')
  })
}

function activate (context) {
  var endLineDisposable = vscode.commands.registerCommand('colonize.endline', () => {
    colonize('endline')
  })

  var holdDisposable = vscode.commands.registerCommand('colonize.hold', () => {
    colonize('hold')
  })

  var newLineDisposable = vscode.commands.registerCommand('colonize.newline', () => {
    colonize('newline')
  })

  context.subscriptions.push(endLineDisposable)
  context.subscriptions.push(newLineDisposable)
  context.subscriptions.push(holdDisposable)
}

exports.activate = activate
