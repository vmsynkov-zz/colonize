'use strict';
import * as vscode from 'vscode';

function colonize(option) {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  let lineIndex = editor.selection.active.line;
  let lineObject = editor.document.lineAt(lineIndex);
  let lineLength = lineObject.text.length;

  if (lineObject.text.charAt(lineLength - 1) == ";" || lineObject.isEmptyOrWhitespace) {

    return;

  } else {

    let semiResult = editor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(lineIndex, lineLength), ";");
    });

    if (!semiResult) {
      vscode.window.showErrorMessage('Failed inserting semicolon')
    } else {
      if (option == 'newline') {
        var cursorResult = vscode.commands.executeCommand('editor.action.insertLineAfter');
      } else {
        var cursorResult = vscode.commands.executeCommand('cursorEnd');
      }

      if (!cursorResult) {
        vscode.window.showErrorMessage('Failed moving cursor')
      }
    }
  }
}

export function activate(context: vscode.ExtensionContext) {

  let ordinaryDisposable = vscode.commands.registerCommand('colonize.ordinary', () => {
    colonize(null);
  });


  let newlineDisposable = vscode.commands.registerCommand('colonize.newline', () => {
    colonize('newline');
  });

  context.subscriptions.push(ordinaryDisposable);
  context.subscriptions.push(newlineDisposable);
}

export function deactivate() {}