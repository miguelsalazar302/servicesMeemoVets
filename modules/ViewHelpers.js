import React, {Component} from "react";
import {
	View,
	Text,
} from "react-native";
import moment from "moment/moment";
import locales_es from "./../locales/es";

/*
* Takes an Integer and returns a String as a "24hs." format.
* */
const getTwentyFourFormatAsString = (int) => {
	return String(int < 10 ? "0" + int : int);
};

// REACT NATIVE CORE JS PATCH
const jsCoreDateCreator = (dateString) => {
	// regex check ONLY "YYYY-MM-DD HH:MM:SS"
	if (/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(dateString)) {
		// dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
		let dateParam = dateString.split(/[\s-:]/);
		dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();
		// return new Date(...dateParam);
		return new Date(moment(dateString, "YYYY-MM-DD hh:mm:ss"));
	} else {
		// return new Date(dateString);
		return new Date(moment(dateString));
	}
};

export function renderAge(dateString, textStyles) {
	const today = moment();
	// const birthDate = new Date(dateString);
	// const birthDate = this.jsCoreDateCreator(dateString);
	const birthDate = moment(dateString, "YYYY-MM-DDThh:mm:ssZ");
	// let age = today.getFullYear() - birthDate.getFullYear();
	let years = today.diff(birthDate, 'year');
	birthDate.add(years, 'years');

	let months = today.diff(birthDate, 'months');
	birthDate.add(months, 'months');

	// let days = today.diff(birthDate, 'days');

	return (
	  years || months ?
		<View>
			<Text style={textStyles}>
				{locales_es.age + ': '}{years ? years : ''} {years > 1 ? locales_es.years : years > 0 ? locales_es.year : ''} {months > 0 ? months : ''} {months > 0 && months === 1 ? locales_es.month : months > 1 ? locales_es.months : ''}</Text>
		</View>
		: null
	);
}

/*
	* DATE VIEW PARSING
	* Takes a event date and returns it as a parsed custom RN-TAG-VIEW format output
	* only:string | 'day','month','year'
	* */
export function parseEventDate(eventDate, shortMode, /*string*/only, includeTime) {

	if (!eventDate) {
		return;
	}

	// const date = new Date(eventDate);
	const date = typeof eventDate === 'string' ? jsCoreDateCreator(eventDate) : eventDate;
	console.log(date);

	let monthMatch = {};

	if (shortMode) {
		monthMatch = {
			'Ene': 0,
			'Feb': 1,
			'Mar': 2,
			'Abr': 3,
			'May': 4,
			'Jun': 5,
			'Jul': 6,
			'Ago': 7,
			'Sep': 8,
			'Oct': 9,
			'Nov': 10,
			'Dic': 11
		};
	} else {
		monthMatch = {
			'Enero': 0,
			'Febrero': 1,
			'Marzo': 2,
			'Abril': 3,
			'Mayo': 4,
			'Junio': 5,
			'Julio': 6,
			'Agosto': 7,
			'Septiembre': 8,
			'Octubre': 9,
			'Noviembre': 10,
			'Diciembre': 11
		};
	}

	let month = date.getMonth();

	Object.keys(monthMatch).map((key) => {
		if (month === monthMatch[key]) {
			month = key;
		}
		return key;
	});

	const day = date.getDate();
	const year = date.getFullYear();

	// oNLY
	if (only) {
		switch (only) {
			case 'day':
				return day;
			case 'month':
				return month;
			case 'year':
				return year;
			default :
				return new Error('Unexpected ');
		}
	}
	// Only

	return (
	  <Text>
		  {typeof month === 'string' && shortMode ? <Text>{month} </Text> : null}
		  <Text>{day} </Text>
		  {typeof month === 'string' && !shortMode ? <Text>de {month} </Text> : null}
		  <Text>{year} </Text>
		  {includeTime
		    ? <Text>
			    {getTwentyFourFormatAsString(date.getHours())}:{getTwentyFourFormatAsString(date.getMinutes())}
			    </Text>
		    : null}
	  </Text>
	);
}