import { createStore } from 'redux';
import { PREVIEW_FILTERS } from './actions';
import reducer from './reducer';

const defaultState = {
	currentColors: ['#008c8e', '#ffffff'],
	filter: PREVIEW_FILTERS.normal,
	filteredColors: ['#008c8e', '#ffffff'],
	launchAtLogin: false,
	view: 'default',
	ratio: 4.08,
	saved: false,
	savedContrasts: []
};
let data = localStorage.getItem('app-data');
let store;

if (data !== null) {
	data = Object.assign({}, defaultState, JSON.parse(data));
} else {
	data = Object.assign({}, defaultState);
}

store = createStore(reducer, data);

export default store;
