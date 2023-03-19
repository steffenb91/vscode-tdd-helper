import * as vscode from 'vscode';

// Define the steps in the TDD workflow
const TDDSteps = [
  { name: 'Unit Test', color: 'lime' },
  { name: 'Implementation', color: 'aqua' },
  { name: 'Refactoring', color: 'orchid' }
];

const OuterCycle = [
  { name: 'Integration Test', color: 'orange' },
];


let currentStep = 0;
let banner: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Create the banner element
  banner = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);

  // Register the command to move to the next step
  context.subscriptions.push(vscode.commands.registerCommand('tddWorkflow.nextStep', () => {
    currentStep = (currentStep + 1) % TDDSteps.length;
    updateBanner(TDDSteps[currentStep].name, TDDSteps[currentStep].color);
  }));

  context.subscriptions.push(vscode.commands.registerCommand('tddWorkflow.firstStep', () => {
    updateBanner(OuterCycle[0].name, OuterCycle[0].color);
    currentStep = -1;
  }));

  // Register the command to move to the previous step
  context.subscriptions.push(vscode.commands.registerCommand('tddWorkflow.previousStep', () => {
    currentStep = (currentStep - 1 + TDDSteps.length) % TDDSteps.length;
    updateBanner(TDDSteps[currentStep].name, TDDSteps[currentStep].color);
  }));

  // Show the initial banner
  currentStep = -1;
  updateBanner(OuterCycle[0].name, OuterCycle[0].color);
}


function updateBanner(text: string, color: string) {
  banner.text = `TDD Phase: ${text}` + ` $(circle-filled)`;
  banner.color = color;
  banner.show();
}

export function deactivate() {
  // Hide the banner when the extension is deactivated
  banner.dispose();
}
