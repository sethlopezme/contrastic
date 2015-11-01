import ipc from 'ipc';
import store from 'store';
import { setView, PREVIEW_FILTERS } from 'store/actions';
import Vue from 'vue';

import ContrastView from 'views/contrast';
import SavedContrastsView from 'views/saved-contrasts';
import SettingsView from 'views/settings';

Vue.config.debug = true;

const pkg = require('../../../package.json');
// define the Vue app
const app = new Vue({
	el: 'html',
	components: {
		contrast: ContrastView,
		savedContrasts: SavedContrastsView,
		settings: SettingsView
	},
	data: {
		pkg: {
			author: pkg.author,
			contributors: pkg.contributors,
			description: pkg.description,
			homepage: pkg.homepage,
			name: pkg.productName,
			repository: pkg.repository,
			version: pkg.version
		},
		state: store.getState()
	},
	computed: {
		title: {
			get: function getTitle() {
				switch (this.state.view) {
					case 'saved-contrasts':
						return 'Saved Contrasts';
					case 'settings':
						return 'Settings';
					default:
						return this.pkg.name;
				}
			}
		}
	},
	methods: {
		onQuit() {
			ipc.send('quit');
		},
		commitState() {
			// changes to the state before it's committed
			const state = Object.assign({}, this.state, {
				filter: PREVIEW_FILTERS.normal,
				filteredColors: this.state.currentColors,
				view: 'default'
			});

			localStorage.setItem('app-data', JSON.stringify(state));
		},
		toggleView(view) {
			store.dispatch(setView(this.state.view === view ? 'default' : view));
		}
	},
	ready() {
		// watch the state and commit it to local storage when it changes
		this.$watch('state', this.commitState, {
			deep: true,
			immediate: true
		});

		store.subscribe(() => {
			this.state = store.getState();
		});
	}
});
