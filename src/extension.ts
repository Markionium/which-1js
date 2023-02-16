/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from "vscode";
import { execa } from "execa";
import * as path from "path";

let myStatusBarItem: vscode.StatusBarItem;
export function activate({ subscriptions }: vscode.ExtensionContext) {
  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  );

  vscode.workspace.onDidChangeWorkspaceFolders(() => showGitRootInStatusBar);
  subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(showGitRootInStatusBar)
  );

  showGitRootInStatusBar();
}

function getDirectoryToLookFor(
  textEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
): string | undefined {
  const fileName = textEditor?.document.uri;
  if (fileName) {
    if (fileName?.scheme !== "file") {
      return;
    }

    return path.dirname(fileName.fsPath);
  }

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (workspaceFolder && workspaceFolder.uri.scheme === "file") {
    return workspaceFolder.uri.fsPath;
  }
  return undefined;
}

function showGitRootInStatusBar() {
  const directoryToLookFor = getDirectoryToLookFor();

  if (directoryToLookFor) {
    findGitRoot(directoryToLookFor)
      .then((gitRoot) => {
        const gitRootFolder = gitRoot.split(path.sep).pop();

        if (gitRootFolder) {
          updateStatusBarItem(gitRootFolder);
        }
      })
      .catch(() => {
        // No git root found nothing to do here.
      });
  }
}

function updateStatusBarItem(value: string | null): void {
  if (!value) {
    myStatusBarItem.hide();
    return;
  }

  myStatusBarItem.text = `${value}`;
  myStatusBarItem.show();
}

function findGitRoot(filePath: string): Promise<string> {
  return execa("git", ["rev-parse", "--show-toplevel"], {
    cwd: filePath,
  }).then(({ stdout }) => stdout);
}
