const vscode = require('vscode')

function colonize (option) {
  var editor = vscode.window.activeTextEditor
  if (!editor) return

  vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {
    var lineIndex = editor.selection.active.line
    var lineObject = editor.document.lineAt(lineIndex)
    var lineLength = lineObject.text.length

    if (lineObject.text.charAt(lineLength - 1) !== ';' && !lineObject.isEmptyOrWhitespace) {
      var semiResult = editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(lineIndex, lineLength), ';')
      })

      if (!semiResult) return
    } else if (option === 'stayPosition' && !lineObject.isEmptyOrWhitespace) {
      var semiResult = editor.edit((editBuilder) => {
        var start = new vscode.Position(lineIndex, lineLength - 1);
        var end = new vscode.Position(lineIndex, lineLength);
        editBuilder.delete(new vscode.Range(start, end));
      });

      if (!semiResult) return
    }

    switch (option) {
      case "endline": 
        vscode.commands.executeCommand('cursorEnd')
        break;
      case "newline": 
        vscode.commands.executeCommand('editor.action.insertLineAfter')
        break;
    }
  })
}

function activate (context) {
  var endLineDisposable = vscode.commands.registerCommand('colonize.endline', () => {
    colonize('endline')
  })

  var newLineDisposable = vscode.commands.registerCommand('colonize.newline', () => {
    colonize('newline')
  })

  var stayPositionDisposable = vscode.commands.registerCommand('colonize.stayPosition', () => {
    colonize('stayPosition')
  })

  context.subscriptions.push(endLineDisposable)
  context.subscriptions.push(newLineDisposable)
  context.subscriptions.push(stayPositionDisposable)
}

exports.activate = activate
