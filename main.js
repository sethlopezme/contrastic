/* eslint no-console: 0 */
import path from 'path';
import app from 'app';
import ipc from 'ipc';
import Menu from 'menu';
import Tray from 'tray';
import BrowserWindow from 'browser-window';

const trayIcon = path.join(__dirname, 'tray-icon.png');
const mainWindowEntry = path.join('file://', __dirname, 'renderer', 'build', 'index.html');
const mainWindowConfig = {
	frame: false,
	height: 315,
	resizable: false,
	show: false,
	title: app.getName(),
	transparent: true,
	width: 430
};
const feedbackWindowEntry = path.join('file://', __dirname, 'renderer', 'build', 'feedback.html');
const feedbackWindowConfig = {
	frame: false,
	height: 450,
	resizable: false,
	title: app.getName(),
	transparent: true,
	width: 350
};
let mainWindow = null;
let feedbackWindow = null;
let tray = null;
const appMenu = [
	{ label: app.getName(), submenu: [
		{ label: `About ${app.getName()}`, selector: 'orderFrontStandardAboutPanel:' },
		{ label: 'Quit', accelerator: 'Cmd+Q', selector: 'terminate:' }
	]},
	{ label: 'Edit', submenu: [
		{ label: 'Undo', accelerator: 'Cmd+Z', selector: 'undo:' },
		{ label: 'Redo', accelerator: 'Cmd+Shift+Z', selector: 'redo:' },
		{ type: 'separator' },
		{ label: 'Cut', accelerator: 'Cmd+X', selector: 'cut:' },
		{ label: 'Copy', accelerator: 'Cmd+C', selector: 'copy:' },
		{ label: 'Paste', accelerator: 'Cmd+V', selector: 'paste:' },
		{ label: 'Select All', accelerator: 'Cmd+A', selector: 'selectAll:' }
	]},
	{ label: 'Developer', submenu: [
		{ label: 'Reload', accelerator: 'Cmd+R', click: () => { mainWindow.reload(); } },
		{ label: 'Toggle DevTools', accelerator: 'Cmd+Alt+I', click: () => { BrowserWindow.getFocusedWindow().toggleDevTools(); } }
	]}
];

console.log(app.getAppPath());
console.log(app.getPath('home'));

function onTrayClicked(event, bounds) {
	if (mainWindow.isVisible()) {
		mainWindow.hide();
	} else {
		const position = {
			x: (bounds.x + (bounds.width / 2)) - (mainWindow.getSize()[0] / 2),
			y: (bounds.y + bounds.height)
		};

		mainWindow.setPosition(position.x, position.y);
		mainWindow.show();
	}
}

function onBlurMainWindow() {
	if (mainWindow.isVisible()) {
		mainWindow.hide();
	}
}

function onFeedbackWindowOpen() {
	feedbackWindow = new BrowserWindow(feedbackWindowConfig);

	feedbackWindow.loadUrl(feedbackWindowEntry);
	feedbackWindow.on('close', onFeedbackWindowClosed);
}

function onFeedbackWindowClose() {
	feedbackWindow.close();
}

function onFeedbackWindowClosed() {
	feedbackWindow = null;
}

app.dock.hide();
app.on('ready', () => {
	Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
	mainWindow = new BrowserWindow(mainWindowConfig);
	tray = new Tray(trayIcon);

	mainWindow.loadUrl(mainWindowEntry);
	mainWindow.on('blur', onBlurMainWindow);

	tray.setToolTip(`${app.getName()} ${app.getVersion()}`);
	tray.on('clicked', onTrayClicked);
	tray.on('double-clicked', onTrayClicked);

	ipc.on('quit', app.quit.bind(app));
	ipc.on('feedback-open', onFeedbackWindowOpen);
	ipc.on('feedback-close', onFeedbackWindowClose);
});
