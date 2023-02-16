/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/


import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;
export function activate({ subscriptions }: vscode.ExtensionContext) {
	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);


	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem(vscode.window.activeTextEditor);
}

function getFolderBeforeMidgard(path: string) {
	const folderParts = path.split("/");
	const midgardIndex = folderParts.indexOf("midgard");
	if (midgardIndex !== -1) {
		return folderParts[midgardIndex - 1];
	}
	return null;

}

function updateStatusBarItem(editor: vscode.TextEditor | undefined): void {
	if (!editor) {
		return;
	}
	const folderBeforeMidgard = getFolderBeforeMidgard(editor.document.uri.path);

	if (!folderBeforeMidgard) {
		myStatusBarItem.hide();
		return;
	}

	myStatusBarItem.text = `midgard`;
	myStatusBarItem.show();


	myStatusBarItem.text = `${folderBeforeMidgard}`;
	myStatusBarItem.show();
}
