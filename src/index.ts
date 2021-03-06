import {Dictionaries} from "./build_dictionaries";
import transformations from "./transformations";
import distance from "strdistance";
import builder from "./build_dictionaries";



export interface Correction {
	correction:string;
	distance:number;
}

export interface CheckResult {
	raw:string;
	correct:boolean;
	corrections:Correction[];
}

export interface Options {
	dictionary:string;
	distanceThreshold:number;
}

export function buildSpelt ({dictionary, distanceThreshold=0.22}: Options) {
	const dictionaries:Dictionaries = builder(dictionary);
	return function check (raw:string):CheckResult{
		let correct:1|undefined = dictionaries.correct[raw];
		if((!correct) && /^((\d{1,3})+(,\d{3})*(\.\d+)?)$/.test(raw)) correct = 1;
		if((!correct) && /\W+/.test(raw)) correct = 1;
		let corrections:Correction[] = [];
		let breaker = false;
		if(!correct) {
			for (let index = 0; index < transformations.length; index++) {
				if(breaker) break;
				let rule = transformations[index];
				let transformed = raw.replace(rule.regex,rule.replaceWith);
				let misspeltEntry = (dictionaries.misspelt[transformed]||"").split("|");
				for (let index = 0; index < misspeltEntry.length; index++) {
					var correctionWord = misspeltEntry[index];
					if(!correctionWord) continue; // ignore empty ones
					if(corrections.find(x=>x.correction === correctionWord)) continue; // don't add repeated ones
					const calculatedDistance = distance(raw,correctionWord);
					if(calculatedDistance < 2) corrections.push({
						correction:correctionWord,
						distance:calculatedDistance
					});
					if(calculatedDistance<distanceThreshold) {
						breaker = true;
						break;
					}
				}
			}
		}
		return {raw,correct:!!correct,corrections:corrections.sort((a,b)=>a.distance - b.distance)};
	};
}

export default buildSpelt;