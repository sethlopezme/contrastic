import store from 'store';
import { removeAllSavedContrasts, removeSavedContrast, setPreviewColors, setView } from 'store/actions';
import SwatchComponent from 'components/swatch';

export default {
	name: 'SavedContrastsView',
	template: require('./template.html'),
	props: ['savedContrasts', 'toggleView'],
	components: {
		swatch: SwatchComponent
	},
	methods: {
		clearSavedContrasts() {
			store.dispatch(removeAllSavedContrasts());
		},
		removeSavedContrast(index) {
			store.dispatch(removeSavedContrast(index));
		},
		selectSavedContrast(index) {
			const colors = this.savedContrasts[index].colors;
			const ratio = this.savedContrasts[index].ratio;

			store.dispatch(setPreviewColors(colors, ratio));
			store.dispatch(setView('default'));
		}
	}
};
