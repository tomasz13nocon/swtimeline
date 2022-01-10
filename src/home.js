import React from "react";
import produce from "immer";

import Timeline from "./timeline.js";
import Legend from "./legend.js";
import Filters from "./filters.js";

import rawData from "./data.json";

const filtersTemplate = {
	"type": {
		name: null,
		children: {
			"book": {
				name: "Novels",
				children: {
					"publisher": {
						name: "Publisher",
						children: {
							"Del Rey": true,
							"Disney–Lucasfilm Press": false,
							"Golden Books": false,
							"China Literature": true,
							"Random House Audio": true,
							"Other": false,
						},
					},
					"audience": {
						name: "Target audience",
						children: {
							"Adult": true,
							"Young Adult": true,
							"Junior": false,
							"Young Readers": false,
							"Unknown": true,
						},
					},
					"adaptation": {
						name: "Adaptations",
						value: false,
					},
				},
			},
			"comic": {
				name: "Comics",
				children: {
					"publisher": {
						name: "Publisher",
						children: {
							"Marvel Comics": true,
							"IDW": false,
							"Dark Horse Comics": true,
							"Other": false,
						},
					},
					"subtype": {
						name: "Format",
						children: {
							"Series": true,
							"Story arc": true,
							"Single issue": true,
							"Trade paperback": false,
						},
					},
				},
			},
		},
	},
};

const _createStateFrom = obj => {
	if (!obj) throw "Incorrect template structure!";
	let ret = {};
	for (const [key, value] of Object.entries(obj)) {
		ret[key] = typeof value === "boolean" ?
			value :
			(value.value !== undefined ?
				value.value :
				_createStateFrom(value.children || value));
		// value.value - object representing a single filter
		// value.children - standard structure
		// value - object with direct children
	}
	return ret;
}

// template is an object containing the recursive structure of the filters.
// This template can also contain values useful for e.g. rendering.
// It needs to have the following structure:
// keys correspond to data's keys.
// values can be one of:
// A boolean representing a single filter
// An object with a "value" key representing a single filter
// An object without a "value" key representing a nested group of filters
//    Such an object can have a "children" key with a value being an object
//    containing the main structure recursively
//    or follow the main structure itself.
// Wheter you use "children" and "value" keys depends on if you want to include other data
// for a filter or group to be used later (when rendering). The 2 approaches can be mixed freely.
const createState = template => {
	try {
		return _createStateFrom(template);
	}
	catch (e) {
		throw e instanceof RangeError ?
			"Incorrect template structure! (infinite recursion)" :
			e;
	}
}

const _setChildren = (children, to) => {
	for (let [key, value] of Object.entries(children)) {
		if (typeof value === "boolean") {
			children[key] = to;
		}
		else {
			_setChildren(value, to);
		}
	}
}

const reducer = (state, { path, to }) => {
	return produce(state, draft => {
		let atPath = _.get(draft, path);
		typeof atPath === "boolean" ?
			_.set(draft, path, to) :
			_setChildren(atPath, to)
	});
}

export default function Home() {
	const [filterText, setFilterText] = React.useState("");

	const [filters, dispatch] = React.useReducer(reducer, filtersTemplate, filtersTemplate => {
		return createState(filtersTemplate);
	});

	return (
		<>
			<Filters
				filterText={filterText}
				filterTextChanged={setFilterText}
				filters={filters}
				filtersChanged={dispatch}
				filtersTemplate={filtersTemplate} />
			<Legend />
			<Timeline filterText={filterText} filters={filters} rawData={rawData} />
		</>
	);
};