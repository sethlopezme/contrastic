export default {
	name: 'SwatchComponent',
	template: require('./template.html'),
	props: ['snapshot'],
	computed: {
		styles() {
			return {
				background: this.snapshot.background,
				color: this.snapshot.foreground
			};
		},
		level() {
			if (this.snapshot.ratio >= 7) {
				return 'AAA';
			} else if (this.snapshot.ratio >= 4.5 && this.snapshot.ratio < 7) {
				return 'AA';
			} else if (this.snapshot.ratio >= 3 && this.snapshot.ratio < 4.5) {
				return 'AA Large';
			}

			return 'Fail';
		}
	}
};
