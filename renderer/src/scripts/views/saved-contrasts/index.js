import SwatchComponent from 'components/swatch';

export default {
	name: 'SavedContrastsView',
	template: require('./template.html'),
	inherit: true,
	components: {
		swatch: SwatchComponent
	},
	methods: {
		clearSavedContrasts() {
			this.savedContrasts = [];
			this.commitSavedContrasts();
		},
		removeSavedContrast(index) {
			this.savedContrasts.$remove(index);
			this.commitSavedContrasts();
		},
		selectSavedContrast(item) {
			this.$dispatch('saved-contrasts:select', item);
		}
	}
};
