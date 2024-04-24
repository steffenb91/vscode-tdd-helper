import * as vscode from 'vscode';

// Define the steps in the TDD workflow
const TDDSteps = [
  { name: 'Unit Test', color: vscode.workspace.getConfiguration().get<string>("tdd-testhelper.unitTestPhaseColor") },
  { name: 'Implementation', color: vscode.workspace.getConfiguration().get<string>("tdd-testhelper.implementPhaseColor") },
  { name: 'Refactoring', color: vscode.workspace.getConfiguration().get<string>("tdd-testhelper.refactorPhaseColor") }
];

const OuterCycle = [
  { name: 'Integration Test', color: vscode.workspace.getConfiguration().get<string>("tdd-testhelper.integrationTestPhaseColor") },
];


let currentStep = 0;
let banner: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Create the banner element
  banner = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);

  // Register the command to move to the next step
  context.subscriptions.push(vscode.commands.registerCommand('tddWorkflow.nextStep', () => {
    currentStep = (currentStep + 1) % TDDSteps.length;
    updateBanner(TDDSteps[currentStep].name, TDDSteps[currentStep].color ?? '#ffffff');
    updateActivityAndStatusBarColor(TDDSteps[currentStep].color ?? '#ffffff');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('tddWorkflow.firstStep', () => {
    updateBanner(OuterCycle[0].name, OuterCycle[0].color ?? '#ffffff');
    currentStep = -1;
  }));

  // Register the command to move to the previous step
  context.subscriptions.push(vscode.commands.registerCommand('tddWorkflow.previousStep', () => {
    currentStep = (currentStep - 1 + TDDSteps.length) % TDDSteps.length;
    updateBanner(TDDSteps[currentStep].name, TDDSteps[currentStep].color ?? '#ffffff');
    updateActivityAndStatusBarColor(TDDSteps[currentStep].color ?? '#ffffff');
  }));

  // Show the initial banner
  currentStep = -1;
  updateBanner(OuterCycle[0].name, OuterCycle[0].color ?? '#ffffff');
}

function updateActivityAndStatusBarColor(color: string) {
  // Apply the color to the entire window
  vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
    "activityBar.background": color,
    "statusBar.background": color,
  }, vscode.ConfigurationTarget.Global);
}


function updateBanner(text: string, color: string) {
  banner.text = `TDD Phase: ${text}` + ` $(circle-filled)`;
  banner.color = "black";
  banner.show();
  showNotification(text);
}

function showNotification(text: string) {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Well done! You are in ${text} mode`,
    cancellable: true
  }, (progress) => {
    progress.report({ increment: 100 });
    const p = new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });

    return p;
  });
}

export function deactivate() {
  // Hide the banner when the extension is deactivated
  banner.dispose();
  vscode.workspace.getConfiguration().update('workbench.colorCustomizations',
    undefined, vscode.ConfigurationTarget.Global);

}
