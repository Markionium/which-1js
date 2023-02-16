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
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItemForEditor));

	// update status bar item once at start
	updateStatusBarItemForEditor(vscode.window.activeTextEditor);
	const openedFolder = vscode.workspace.workspaceFolders?.[0];
	if (!openedFolder) {
		return;
	}
	const folderBeforeMidgard = getFolderBeforeMidgard(openedFolder?.uri.path);
	updateStatusBarItem(folderBeforeMidgard);
}

function getFolderBeforeMidgard(path: string) {
	const folderParts = path.split("/");
	const midgardIndex = folderParts.indexOf("midgard");
	if (midgardIndex !== -1) {
		return folderParts[midgardIndex - 1];
	}
	return null;

}

function updateStatusBarItemForEditor(editor: vscode.TextEditor | undefined): void {
	if (!editor) {
		return;
	}
	const folderBeforeMidgard = getFolderBeforeMidgard(editor.document.uri.path);

	if (!folderBeforeMidgard) {
		myStatusBarItem.hide();
		return;
	}

	updateStatusBarItem(folderBeforeMidgard);
}

function updateStatusBarItem(value: string | null): void {
	if (!value) {
		myStatusBarItem.hide();
		return;
	}

	myStatusBarItem.text = `${value}`;
	myStatusBarItem.show();
}
