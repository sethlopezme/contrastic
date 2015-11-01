export default {
	name: 'PreviewComponent',
	template: require('./template.html'),
	props: ['colors', 'ratio'],
	computed: {
		styles() {
			return {
				background: this.colors[0],
				color: this.colors[1]
			};
		},
		level() {
			if (this.ratio >= 7) {
				return 'AAA';
			} else if (this.ratio >= 4.5 && this.ratio < 7) {
				return 'AA';
			} else if (this.ratio >= 3 && this.ratio < 4.5) {
				return 'AA Large';
			}

			return 'Fail';
		},
		explanation() {
			if (this.ratio >= 7) {
				return 'Meets the WCAG 2.0 AAA enhanced contrast criteria and the AA minimum contrast criteria.';
			} else if (this.ratio >= 4.5 && this.ratio < 7) {
				return 'Meets the WCAG 2.0 AA minimum contrast criteria. Does not meet the AAA enhanced contrast criteria.';
			} else if (this.ratio >= 3 && this.ratio < 4.5) {
				return 'Meets the WCAG 2.0 AA minimum contrast criteria for text that is at least 18pt (24px), or 14pt (19px) and bold. Does not meet the AAA enhanced contrast criteria.';
			}

			return 'Does not meet the WCAG 2.0 AA or AAA contrast criteria.';
		},
		accessibleExplanation() {
			return `The ratio between ${this.colors.background} and ${this.colors.foreground} is ${this.ratio}. ${this.explanation}`;
		}
	}
};
