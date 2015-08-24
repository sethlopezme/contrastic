/* eslint no-console: 0 */
import path from 'path';
import crashReporter from 'crash-reporter';
import electronDebug from 'electron-debug';
import app from 'app';
import ipc from 'ipc';
import Tray from 'tray';
import BrowserWindow from 'browser-window';

crashReporter.start();
electronDebug();

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
	win = new BrowserWindow(winConfig);
	tray = new Tray(trayIcon);

	win.loadUrl(entry);
	win.on('blur', onWinBlur);

	tray.setToolTip(`${app.getName()} ${app.getVersion()}`);
	tray.on('clicked', onTrayClicked);
	tray.on('double-clicked', onTrayClicked);

	ipc.on('quit', app.quit.bind(app));
});
