import ipc from 'ipc';
import Vue from 'vue';

import ContrastView from 'views/contrast';
import SavedContrastsView from 'views/saved-contrasts';
import SettingsView from 'views/settings';

const latestDefaults = {
	background: '#008c8e',
	foreground: '#ffffff'
};
const settingsDefaults = {
	language: 'en',
	launchAtStartup: false,
	savedMax: 50
};
const savedContrastsDefaults = [
	{
		background: '#008c8e',
		foreground: '#ffffff',
		ratio: 4.08,
		dark: true
	},
	{
		background: '#008c8e',
		foreground: '#ffffff',
		ratio: 4.08,
		dark: true
	},
	{
		background: '#008c8e',
		foreground: '#ffffff',
		ratio: 4.08,
		dark: true
	},
	{
		background: '#008c8e',
		foreground: '#ffffff',
		ratio: 4.08,
		dark: true
	}
];
let latest = localStorage.getItem('tinge:latest');
let settings = localStorage.getItem('tinge:settings');
let savedContrasts = localStorage.getItem('tinge:saved-contrasts');

Vue.config.debug = true;

// check for the existence of the settings object
if (settings !== null) {
	settings = Object.assign(settingsDefaults, JSON.parse(settings));
} else {
	settings = settingsDefaults;
}

// because we're potentially combining current settings with new defaults, go
// ahead and store the new settings object in localstorage
localStorage.setItem('tinge:settings', JSON.stringify(settings));

// check for the existence of the history array
if (savedContrasts !== null) {
	savedContrasts = JSON.parse(savedContrasts);
} else {
	savedContrasts = savedContrastsDefaults;

	localStorage.setItem('tinge:saved-contrasts', JSON.stringify(savedContrasts));
}

// check for the existence of the most recent object
if (latest !== null) {
	latest = JSON.parse(latest);
} else {
	latest = latestDefaults;

	localStorage.setItem('tinge:latest', JSON.stringify(latest));
}

// define the Vue app
const app = new Vue({
	el: 'html',
	components: {
		contrast: ContrastView,
		savedContrasts: SavedContrastsView,
		settings: SettingsView
	},
	data: {
		modal: null,
		latest,
		savedContrasts,
		settings
	},
	computed: {
		title: {
			get: function getTitle() {
				switch (this.modal) {
					case 'saved-contrasts':
						return 'Saved Contrasts';
					case 'settings':
						return 'Settings';
					default:
						return 'Tinge';
				}
			}
		}
	},
	methods: {
		onQuit() {
			ipc.send('quit');
		},
		toggleModal(modal) {
			this.modal = modal === this.modal ? null : modal;
		},
		commitSavedContrasts() {
			localStorage.setItem('tinge:saved-contrasts', JSON.stringify(this.savedContrasts));
		},
		commitSettings() {
			localStorage.setItem('tinge:settings', JSON.stringify(this.settings));
		},
		commitLatest() {
			localStorage.setItem('tinge:latest', JSON.stringify(this.latest));
		}
	},
	ready() {
		this.$on('saved-contrasts:select', (item) => {
			this.toggleModal(null);
			this.$.contrast.model = {
				background: item.background,
				foreground: item.foreground
			};
		});
	}
});
