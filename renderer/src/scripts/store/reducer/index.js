import Color from 'color';
import ColorBlind from 'color-blind';
import { ACTION_TYPES, PREVIEW_FILTERS } from 'store/actions';

/**
 * Reduces the current state.
 *
 * @param    {Object}  state   The current state of the application.
 * @param    {Object}  action  The action to perform.
 *
 * @returns  {Object}          The new state of the application.
 */
export default function reducer(state, action) {
	switch (action.type) {
		case ACTION_TYPES.REMOVE_ALL_SAVED_CONTRASTS:
			return Object.assign({}, state, {
				saved: false,
				savedContrasts: []
			});

		case ACTION_TYPES.REMOVE_SAVED_CONTRAST:
			{
				const savedContrasts = state.savedContrasts.slice();

				savedContrasts.splice(action.index, 1);

				return Object.assign({}, state, {
					saved: false,
					savedContrasts
				});
			}

		case ACTION_TYPES.SAVE_CONTRAST:
			{
				const savedContrasts = state.savedContrasts.slice(0, 49);

				savedContrasts.unshift({
					colors: action.colors,
					ratio: action.ratio || _calculateColorRatio(action.colors)
				});

				return Object.assign({}, state, {
					saved: 0,
					savedContrasts
				});
			}

		case ACTION_TYPES.SAVE_SETTINGS:
			return Object.assign({}, state, action.settings);

		case ACTION_TYPES.SET_PREVIEW_COLORS:
			{
				const currentColors = action.colors;
				const filteredColors = _filterColors(currentColors, state.filter);
				const ratio = action.ratio || _calculateColorRatio(filteredColors);
				let saved = false;
				let i = state.savedContrasts.length;

				// loop through the saved contrasts to determine if the current color
				// combination has been saved
				while (i--) {
					const savedContrast = state.savedContrasts[i];

					if (_compareColors([savedContrast.colors[0], action.colors[0]]) && _compareColors([savedContrast.colors[1], action.colors[1]])) {
						saved = i;
						break;
					}
				}

				return Object.assign({}, state, {
					currentColors,
					filteredColors,
					ratio,
					saved
				});
			}

		case ACTION_TYPES.SET_PREVIEW_FILTER:
			{
				const filter = action.filter;
				const filteredColors = _filterColors(state.currentColors, filter);
				const ratio = _calculateColorRatio(filteredColors);

				return Object.assign({}, state, {
					filter,
					filteredColors,
					ratio
				});
			}

		case ACTION_TYPES.SET_VIEW:
			return Object.assign({}, state, {
				view: action.view
			});

		default:
			return state;
	}
}

/**
 * Compares the hex-equivalent of two colors to determine if they're the same.
 *
 * @param    {Array}  colors  The array of colors to use.
 *
 * @returns  {Boolean}        Are the colors the same?
 */
function _compareColors(colors) {
	return (new Color(colors[0])).hexString() === (new Color(colors[1])).hexString();
}

/**
 * Filters two colors according to a particular color blindness.
 *
 * @param    {Array}   colors  The colors to filter.
 * @param    {String}  filter  The filter to apply.
 *
 * @returns  {Array}           The filtered colors.
 */
function _filterColors(colors, filter) {
	if (filter === PREVIEW_FILTERS.normal) {
		return colors;
	}

	const bg = new Color(colors[0]);
	const fg = new Color(colors[1]);

	return [
		(new Color(ColorBlind[filter](bg.hexString()))).hexString(),
		(new Color(ColorBlind[filter](fg.hexString()))).hexString()
	];
}

/**
 * Determined the contrast ratio between two colors.
 *
 * @param    {Array}  colors  The colors to test.
 *
 * @returns  {Float}          The contrast ratio.
 */
function _calculateColorRatio(colors) {
	const bg = new Color(colors[0]);
	const fg = new Color(colors[1]);

	return bg.contrast(fg).toFixed(2);
}
