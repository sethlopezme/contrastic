import ipc from 'ipc';
import Color from 'color';
import Vue from 'vue';

import ContrastView from 'views/contrast';
import SavedColorsView from 'views/saved-colors';
import SettingsView from 'views/settings';

const settingsDefaults = {
	language: 'en',
	launchAtStartup: false
};
const savedColorsMax = 100;
let settings = localStorage.getItem('tinge:settings');
let savedColors = localStorage.getItem('tinge:saved-colors');

Vue.config.debug = true;

// check for the existence of the settings object
if (settings !== null) {
	settings = Object.assign(settingsDefaults, JSON.parse(settings));
} else {
	settings = settingsDefaults;
}

localStorage.setItem('tinge:settings', JSON.stringify(settings));

// check for the existence of the history array
if (savedColors !== null) {
	savedColors = JSON.parse(savedColors);
} else {
	savedColors = [];
}

localStorage.setItem('tinge:saved-colors', JSON.stringify(savedColors));

const tinge = new Vue({
	el: 'html',
	components: {
		contrast: ContrastView,
		savedColors: SavedColorsView,
		settings: SettingsView
	},
	data: {
		savedColors,
		settings,
		view: 'contrast'
	},
	computed: {
		last: {
			get: function getLast() {
				const background = '#008c8e';
				const foreground = '#ffffff';
				const ratio = (new Color(background)).contrast(new Color(foreground)).toFixed(2);

				return this.savedColors[0] || {
					background,
					foreground,
					ratio
				};
			},
			set: function setLast(snapshot) {
				if (this.savedColors.length === savedColorsMax) {
					this.savedColors.pop();
				}

				this.savedColors.unshift(snapshot);
				localStorage.setItem('tinge:saved-colors', JSON.stringify(this.savedColors));
			}
		}
	},
	methods: {
		onQuit() {
			ipc.send('quit');
		},
		route(view) {
			this.view = view;
		}
	}
});
