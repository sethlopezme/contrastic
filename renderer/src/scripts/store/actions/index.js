export const REMOVE_ALL_SAVED_CONTRASTS = Symbol();
export const REMOVE_SAVED_CONTRAST = Symbol();
export const SAVE_CONTRAST = Symbol();
export const SAVE_SETTINGS = Symbol();
export const SET_PREVIEW_COLORS = Symbol();
export const SET_PREVIEW_FILTER = Symbol();
export const SET_VIEW = Symbol();

export const ACTION_TYPES = {
	REMOVE_ALL_SAVED_CONTRASTS,
	REMOVE_SAVED_CONTRAST,
	SAVE_CONTRAST,
	SAVE_SETTINGS,
	SET_PREVIEW_COLORS,
	SET_PREVIEW_FILTER,
	SET_VIEW
};

export const PREVIEW_FILTERS = {
	normal:        'normal',
	achromatopsia: 'achromatopsia',
	achromatomaly: 'achromatomaly',
	protanopia:    'protanopia',
	protanomaly:   'protanomaly',
	deuteranopia:  'deuteranopia',
	deuteranomaly: 'deuteranomaly',
	tritanopia:    'tritanopia',
	tritanomaly:   'tritanomaly'
};

export function removeAllSavedContrasts() {
	return {
		type: REMOVE_ALL_SAVED_CONTRASTS
	};
}

export function removeSavedContrast(index) {
	return {
		type: REMOVE_SAVED_CONTRAST,
		index
	};
}

export function saveContrast(colors, ratio) {
	return {
		type: SAVE_CONTRAST,
		colors,
		ratio
	};
}

export function saveSettings(settings) {
	return {
		type: SAVE_SETTINGS,
		settings
	};
}

export function setPreviewColors(colors, ratio) {
	return {
		type: SET_PREVIEW_COLORS,
		colors,
		ratio
	};
}

export function setPreviewFilter(filter) {
	return {
		type: SET_PREVIEW_FILTER,
		filter
	};
}

export function setView(view) {
	return {
		type: SET_VIEW,
		view
	};
}
