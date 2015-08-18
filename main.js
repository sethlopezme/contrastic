/* eslint no-console: 0 */
import crashReporter from 'crash-reporter';
import electronDebug from 'electron-debug';
import app from 'app';
import ipc from 'ipc';
import BrowserWindow from 'browser-window';

crashReporter.start();
electronDebug();

const entry = `file://${__dirname}/app/index.html`;
const winConfig = {
	frame: false,
	height: 400,
	resizable: false,
	show: false,
	title: 'Juxtapose',
	transparent: true,
	width: 300
};
let win = null;

app.on('ready', () => {
	win = new BrowserWindow(winConfig);
	win.loadUrl(entry);
});
