/// <reference path="../node_modules/@types/node/index.d.ts" />

import transformations from "./transformations";
import gb from "./dictionaries/gb";
import us from "./dictionaries/us";

const dictionaries = {gb,us};

export interface Dictionaries {
	misspelt: {
		[key: string]: string;
	};
	correct: {
		[key: string]: 1;
	};
}

export function build (lang:"gb"|"us"):Dictionaries {
	function appendToDictionary(entry:string,correctWord:string){
		if(!misspelt[entry]) misspelt[entry] = correctWord;
		else misspelt[entry] = misspelt[entry] + "|" + correctWord;
	}
	const misspelt:{[key:string]:string} = {};
	const correct:{[key:string]:1} = {};
	// default dictionary is british
	if(lang !== "us" && lang !== "gb") lang = "gb";
	let sourceDictionary:string[] = dictionaries[lang].split("\n");
	for (var index = 0; index < sourceDictionary.length; index++) {
		var word = sourceDictionary[index];
		// add to correct dictionary
		correct[word] = 1;
		// add transformations
		// remove the vowels
		let noVowels = word.replace(/aouiey/,"");
		for (var transformationIndex = 0; transformationIndex < transformations.length; transformationIndex++) {
			var rule = transformations[transformationIndex];
			appendToDictionary(word.replace(rule.findRegex,rule.replaceWith),word);
		}
	}
	return {misspelt,correct};
}


export default build;