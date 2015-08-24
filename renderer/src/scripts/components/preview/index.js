export default {
	name: 'PreviewComponent',
	template: require('./template.html'),
	props: ['colors', 'dark'],
	computed: {
		styles() {
			return {
				background: this.colors.background,
				color: this.colors.foreground
			};
		},
		level() {
			if (this.colors.ratio >= 7) {
				return 'AAA';
			} else if (this.colors.ratio >= 4.5 && this.colors.ratio < 7) {
				return 'AA';
			} else if (this.colors.ratio >= 3 && this.colors.ratio < 4.5) {
				return 'AA Large';
			}

			return 'Fail';
		},
		ratio() {
			return this.colors.ratio;
		},
		explanation() {
			if (this.colors.ratio >= 7) {
				return 'This combination meets the WCAG 2.0 AAA success criteria for enhanced contrast. It also meets the AA success criteria for minimum contrast.';
			} else if (this.colors.ratio >= 4.5 && this.colors.ratio < 7) {
				return 'This combination meets the WCAG 2.0 AA success criteria for minimum contrast. It does not meet the AAA success criteria for enhanced contrast.';
			} else if (this.colors.ratio >= 3 && this.colors.ratio < 4.5) {
				return 'This combination meets the WCAG 2.0 AA success criteria for minimum contrast when foreground text is at least 18pt (~24px), or 14pt (~19px) and bold. It does not meet the AAA success criteria for enhanced contrast.';
			}

			return 'This combination does not meet the WCAG 2.0 AA success criteria for minimum contrast, nor the AAA success criteria for enhanced contrast.';
		},
		accessibleExplanation() {
			return `The ratio between ${this.colors.background} and ${this.colors.foreground} is ${this.colors.ratio}. ${this.explanation}`;
		}
	}
};
