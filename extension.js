const vscode = require('vscode');

function colonize( option ) {
    var editor = vscode.window.activeTextEditor;
    if ( !editor ) return;

    var lineIndex = editor.selection.active.line;
    var lineObject = editor.document.lineAt( lineIndex );
    var lineLength = lineObject.text.length;

    if ( lineObject.text.charAt( lineLength - 1 ) != ";" && !lineObject.isEmptyOrWhitespace ) {
        var semiResult = editor.edit( ( editBuilder ) => {
            editBuilder.insert(new vscode.Position( lineIndex, lineLength ), ";");
        });

        if ( !semiResult ) return;
    }

    var cursorResult;

    option == 'endline'
        ? cursorResult = vscode.commands.executeCommand('cursorEnd')
        : cursorResult = vscode.commands.executeCommand('editor.action.insertLineAfter')
}

function activate(context) {

    var endLineDisposable = vscode.commands.registerCommand('colonize.endline', () => {
        colonize('endline');
    });


    var newLineDisposable = vscode.commands.registerCommand('colonize.newline', () => {
        colonize('newline');
    });

    context.subscriptions.push( endLineDisposable );
    context.subscriptions.push( newLineDisposable );
}

exports.activate = activate;