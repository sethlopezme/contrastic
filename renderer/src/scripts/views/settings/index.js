import ipc from 'ipc';
import store from 'store';
import { saveSettings } from 'store/actions';

export default {
	name: 'SettingsView',
	template: require('./template.html'),
	props: ['pkg', 'launchAtLogin', 'toggleView'],
	data() {
		return {
			model: {
				launchAtLogin: this.launchAtLogin
			}
		};
	},
	computed: {
		contributors() {
			return this.pkg.contributors.reduce((prev, curr, i, arr) => {
				const separator = i === (arr.length - 1) ? ' & ' : ', ';

				return `${prev.name + separator + curr.name}`;
			});
		},
		year() {
			return (new Date()).getFullYear();
		}
	},
	methods: {
		onUpdateModel(value) {
			store.dispatch(saveSettings(value));
		},
		onClickFeedback() {
			ipc.send('feedback-open');
		}
	},
	ready() {
		this.$watch('model', this.onUpdateModel, {
			deep: true
		});
	}
};
