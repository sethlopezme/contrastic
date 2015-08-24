import ipc from 'ipc';
import Color from 'color';
import Vue from 'vue';

import ContrastView from 'views/contrast';
import HistoryView from 'views/history';
import SettingsView from 'views/settings';

let settings = localStorage.getItem('settings');
let history = localStorage.getItem('history');

Vue.config.debug = true;

// check for the existence of the settings object
if (settings !== null) {
	settings = JSON.parse(settings);
} else {
	settings = {
		launchAtStartup: false
	};

	// localStorage.setItem('settings', JSON.stringify(settings));
}

// check for the existence of the history array
if (history !== null) {
	history = JSON.parse(history);
} else {
	history = [];
	localStorage.setItem('history', JSON.stringify(history));
}

const tinge = new Vue({
	el: 'html',
	components: {
		contrast: ContrastView,
		history: HistoryView,
		settings: SettingsView
	},
	data: {
		view: 'main',
		tabs: [
			{
				name: 'History',
				view: 'history',
				icon: 'clock'
			},
			{
				name: 'Home',
				view: 'main',
				icon: 'droplet'
			},
			{
				name: 'Settings',
				view: 'settings',
				icon: 'cog'
			}
		],
		history,
		settings
	},
	computed: {
		last: {
			get: function getLast() {
				const background = '#008c8e';
				const foreground = '#ffffff';
				const ratio = (new Color(background)).contrast(new Color(foreground)).toFixed(2);

				return this.history[0] || {
					background,
					foreground,
					ratio
				};
			},
			set: function setLast(snapshot) {
				if (this.history.length === this.settings.historyCount) {
					this.history.pop();
				}

				this.history.unshift(snapshot);
				localStorage.setItem('history', JSON.stringify(this.history));
			}
		}
	},
	methods: {
		onRoute(view) {
			this.view = view;
		},
		onQuit() {
			ipc.send('quit');
		}
	}
});
