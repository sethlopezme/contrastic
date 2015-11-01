import remote from 'remote';
import store from 'store';
import { removeSavedContrast, saveContrast, setPreviewColors, setPreviewFilter } from 'store/actions';
import PreviewComponent from 'components/preview';

const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');
const colorSyntax = /^(#?([a-f\d]{3}|[a-f\d]{6})|rgb\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)\)|hsl\((0|360|35\d|3[0-4]\d|[12]\d\d|0?\d?\d),(0|100|\d{1,2})%,(0|100|\d{1,2})%\))$/;
const malformedHexSyntax = /^([a-f\d]{3}|[a-f\d]{6})$/;
const filters = [
	{ name: 'normal', label: 'Normal Vision' },
	{ name: 'achromatopsia', label: 'Achromatopsia - No Color (Grayscale)' },
	{ name: 'achromatomaly', label: 'Achromatomaly - Low Color' },
	{ name: 'protanopia', label: 'Protanopia - No Red' },
	{ name: 'protanomaly', label: 'Protanomaly - Low Red' },
	{ name: 'deuteranopia', label: 'Deuteranopia - No Green' },
	{ name: 'deuteranomaly', label: 'Deuteranomaly - Low Green' },
	{ name: 'tritanopia', label: 'Tritanopia - No Blue' },
	{ name: 'tritanomaly', label: 'Tritanomaly - Low Blue' }
];
let filterMenu;

export default {
	name: 'ContrastView',
	template: require('./template.html'),
	props: ['currentColors', 'filter', 'filteredColors', 'ratio', 'saved'],
	data() {
		return {
			model: this.currentColors.slice()
		};
	},
	components: {
		preview: PreviewComponent
	},
	methods: {
		onUpdateModel(value) {
			// cancel if the model is the same as the current colors
			if (value[0] === this.currentColors[0] && value[1] === this.currentColors[1]) {
				return false;
			}

			// strip the whitespace from the color values
			let newColors = value.map((v) => {
				return v.toLowerCase().replace(/\s*/g, '');
			});

			// test the color values for malformed hex syntax and fix them
			if (colorSyntax.test(newColors[0]) && colorSyntax.test(newColors[1])) {
				newColors = newColors.map((v) => {
					return malformedHexSyntax.test(v) ? `#${v}` : v;
				});

				store.dispatch(setPreviewColors(newColors));
			}
		},
		onUpdateCurrentColors(value) {
			this.model = value.slice(0, 2);
		},
		onFilterButtonClick() {
			const filterButtonPosition = this.$els.filterButton.getBoundingClientRect();
			const position = {
				x: (filterButtonPosition.left + filterButtonPosition.width) | 0,
				y: (filterButtonPosition.top + filterButtonPosition.height) + 10 | 0
			};

			filterMenu = new Menu();

			for (let i = 0, filter; (filter = filters[i++]);) {
				filterMenu.append(new MenuItem({
					checked: filter.name === this.filter,
					click: this.onFilterMenuClick.bind(this, filter.name),
					enabled: filter.name !== this.filter,
					label: filter.label,
					type: 'checkbox'
				}));
			}

			filterMenu.popup(remote.getCurrentWindow(), position.x, position.y);
		},
		onFilterMenuClick(filter) {
			filterMenu = null;
			store.dispatch(setPreviewFilter(filter));
		},
		toggleSavedContrast() {
			if (this.saved !== false) {
				store.dispatch(removeSavedContrast(this.saved));
			} else {
				store.dispatch(saveContrast(this.currentColors));
			}
		}
	},
	ready() {
		this.$watch('currentColors', this.onUpdateCurrentColors);
		this.$watch('model', this.onUpdateModel, {
			deep: true
		});
	}
};
