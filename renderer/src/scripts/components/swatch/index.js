export default {
	name: 'SwatchComponent',
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
		}
	}
};
