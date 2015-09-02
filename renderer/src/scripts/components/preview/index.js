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
				return 'Meets the WCAG 2.0 AAA enhanced contrast criteria and the AA minimum contrast criteria.';
			} else if (this.colors.ratio >= 4.5 && this.colors.ratio < 7) {
				return 'Meets the WCAG 2.0 AA minimum contrast criteria. Does not meet the AAA enhanced contrast criteria.';
			} else if (this.colors.ratio >= 3 && this.colors.ratio < 4.5) {
				return 'Meets the WCAG 2.0 AA minimum contrast criteria for text that is at least 18pt/24px, or 14pt/19px and bold. Does not meet the AAA enhanced contrast criteria.';
			}

			return 'Does not meet the WCAG 2.0 AA or AAA contrast criteria.';
		},
		accessibleExplanation() {
			return `The ratio between ${this.colors.background} and ${this.colors.foreground} is ${this.colors.ratio}. ${this.explanation}`;
		}
	}
};
