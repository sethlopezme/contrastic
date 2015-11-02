export default {
	name: 'FeedbackView',
	template: require('./template.html'),
	props: ['pkg'],
	methods: {
		onSubmit(event) {
			event.preventDefault();

			const xhr = new XMLHttpRequest();
			const data = {};

			// loop over the elements and add them to the data object
			Array.from(this.$els.feedbackForm.elements).forEach((input) => {
				if (input.constructor !== HTMLButtonElement) {
					data[input.name] = input.value;
				}
			});

			xhr.onreadystatechange = function onReadyStateChange() {
				console.log('onReadyStateChange');
				if (xhr.readyState === 4) {
					console.log('xhr.readyState === 4');
					switch (xhr.status) {
						case 200:
							console.log('200');
							break;
						default:
							console.log(xhr.status);
							console.log(xhr.statusText);
							console.log(xhr.response);
							break;
					}
				}
			};
			xhr.open('POST', 'http://formspree.io/seth@sethlopez.me');
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(data));

			// new Notification('Feedback Received', {
			// 	body: 'We appreciate your feedback!'
			// });
		}
	},
	ready() {
		Array.from(this.$els.feedbackForm.elements).forEach((input) => {
			if (input.constructor !== HTMLButtonElement) {
				input.addEventListener('invalid', _onInvalidInput);
				input.addEventListener('input', _onInputInput);
			}
		});
	}
};

function _onInvalidInput() {
	this.classList.add('form-field__input--invalid');
}

function _onInputInput() {
	this.classList.remove('form-field__input--invalid');
}
