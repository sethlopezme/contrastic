/* eslint no-console: 0 */
import path from 'path';
import crashReporter from 'crash-reporter';
// import electronDebug from 'electron-debug';
import app from 'app';
import ipc from 'ipc';
import Menu from 'menu';
import Tray from 'tray';
import BrowserWindow from 'browser-window';

crashReporter.start();
// electronDebug();

const entry = path.join('file://', __dirname, 'renderer', 'build', 'index.html');
const trayIcon = path.join(__dirname, 'tray-icon.png');
const winConfig = {
	frame: false,
	height: 305,
	resizable: false,
	show: false,
	title: app.getName(),
	transparent: true,
	width: 450
};
let win = null;
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
		{ label: 'Reload', accelerator: 'Cmd+R', click: () => {win.reload(); } },
		{ label: 'Toggle DevTools', accelerator: 'Cmd+Alt+I', click: () => { win.toggleDevTools(); } }
	]}
];

function onWinBlur() {
	if (win.isVisible()) {
		win.hide();
	}
}

function onTrayClicked(event, bounds) {
	if (win.isVisible()) {
		win.hide();
	} else {
		const position = {
			x: (bounds.x + (bounds.width / 2)) - (win.getSize()[0] / 2),
			y: (bounds.y + bounds.height)
		};

		win.setPosition(position.x, position.y);
		win.show();
	}
}

app.dock.hide();
app.on('ready', () => {
	Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));
	win = new BrowserWindow(winConfig);
	tray = new Tray(trayIcon);

	win.loadUrl(entry);
	win.on('blur', onWinBlur);

	tray.setToolTip(`${app.getName()} ${app.getVersion()}`);
	tray.on('clicked', onTrayClicked);
	tray.on('double-clicked', onTrayClicked);

	ipc.on('quit', app.quit.bind(app));
});
