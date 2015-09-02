import remote from 'remote';
import Color from 'color';
import ColorBlind from 'color-blind';
import PreviewComponent from 'components/preview';

const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');
const colorSyntax = /^(#?([a-f\d]{3}|[a-f\d]{6})|rgb\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)\)|hsl\((0|360|35\d|3[0-4]\d|[12]\d\d|0?\d?\d),(0|100|\d{1,2})%,(0|100|\d{1,2})%\))$/;
const malformedHexSyntax = /^([a-f\d]{3}|[a-f\d]{6})$/;
const previewModes = [
	{ key: 'normal', name: 'Normal Vision' },
	{ key: 'achromatopsia', name: 'Achromatopsia', description: 'No color (Grayscale)' },
	{ key: 'achromatomaly', name: 'Achromatomaly', description: 'Low color' },
	{ key: 'protanopia', name: 'Protanopia', description: 'No red' },
	{ key: 'protanomaly', name: 'Protanomaly', description: 'Low red' },
	{ key: 'deuteranopia', name: 'Deuteranopia', description: 'No green' },
	{ key: 'deuteranomaly', name: 'Deuteranomaly', description: 'Low green' },
	{ key: 'tritanopia', name: 'Tritanopia', description: 'No blue' },
	{ key: 'tritanomaly', name: 'Tritanomaly', description: 'Low blue' }
];

let previewModesContextMenu;

export default {
	name: 'ContrastView',
	template: require('./template.html'),
	inherit: true,
	data() {
		const data = {
			debounce: 150,
			previewMode: previewModes[0].key,
			model: {
				background: this.last.background,
				foreground: this.last.foreground
			}
		};

		for (let i = 0, mode; (mode = previewModes[i++]);) {
			data[mode.key] = mode.key === 'normal' ? this.last : {};
		}

		return data;
	},
	components: {
		preview: PreviewComponent
	},
	methods: {
		onModelChanged(value) {
			let background = value.background.toLowerCase().replace(/\s*/g, '');
			let foreground = value.foreground.toLowerCase().replace(/\s*/g, '');

			if (colorSyntax.test(background) && colorSyntax.test(foreground)) {
				background = malformedHexSyntax.test(background) ? `#${background}` : background;
				foreground = malformedHexSyntax.test(foreground) ? `#${foreground}` : foreground;

				this.updatePreviewModes(background, foreground);
			}
		},
		onPreviewModeButtonClick() {
			const previewModeButtonPosition = this.$$.previewModeButton.getBoundingClientRect();
			const position = {
				x: (previewModeButtonPosition.left + previewModeButtonPosition.width) | 0,
				y: (previewModeButtonPosition.top + previewModeButtonPosition.height) + 10 | 0
			};

			previewModesContextMenu = new Menu();

			for (let i = 0, mode; (mode = previewModes[i++]);) {
				const label = mode.name + (mode.description ? ` - ${mode.description}` : '');

				previewModesContextMenu.append(new MenuItem({
					checked: mode.key === this.previewMode,
					click: this.onPreviewModesContextMenuClick.bind(this, mode.key),
					enabled: mode.key !== this.previewMode,
					label,
					type: 'checkbox'
				}));
			}

			previewModesContextMenu.popup(remote.getCurrentWindow(), position.x, position.y);
		},
		onPreviewModesContextMenuClick(mode) {
			previewModesContextMenu = null;
			this.previewMode = mode;
		},
		updatePreviewModes(background, foreground) {
			const bg = new Color(background);
			const fg = new Color(foreground);
			const ratio = bg.contrast(fg).toFixed(2);

			this.previewMode = previewModes[0].key;

			for (let i = 0, mode; (mode = previewModes[i++]);) {
				if (mode.key === 'normal') {
					this.normal = {
						background,
						foreground,
						ratio,
						dark: bg.dark()
					};
				} else {
					const adjustedBg = new Color(ColorBlind[mode.key](bg.hexString()));
					const adjustedFg = new Color(ColorBlind[mode.key](fg.hexString()));
					const adjustedRatio = adjustedBg.contrast(adjustedFg).toFixed(2);

					this[mode.key] = {
						background: adjustedBg.hexString(),
						foreground: adjustedFg.hexString(),
						ratio: adjustedRatio,
						dark: adjustedBg.dark()
					};
				}
			}
		}
	},
	ready() {
		this.$watch('model', this.onModelChanged, {
			deep: true,
			immediate: true
		});
	}
};
