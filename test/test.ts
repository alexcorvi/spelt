import {readFileSync,writeFileSync} from "fs";
import spelt from "../src/index";

import {dictionary} from "spelt-gb-dict";
const checker = spelt({distanceThreshold:0,dictionary:dictionary});

const cases:{[key:string]:string[]} = {};

readFileSync(__dirname+"/list.txt","utf8")
.replace(/^\#.*\n/gm,"")
.split(/\n/)
.forEach((line)=>{
	const l = line.replace(/ +/g,"").split(/\t/);
	cases[l[0]] = l[1].split(/,/);
});

const misspellings = Object.keys(cases);
let inaccuracies = 0;

let d:string[][] = [];

for (var index = 0; index < misspellings.length; index++) {
	let misspelling = misspellings[index];
	let expectedCorrections = cases[misspelling];
	let resultCorrections = checker(misspelling).corrections.filter((x,i)=>i<5).map(x=>x.correction);
	expectedCorrections.forEach((expected)=>{
		if(resultCorrections.indexOf(expected.toLowerCase()) === -1) {
			// diagnosis
			/*
			console.log(misspelling,expected,"\t",resultCorrections.join(" "));
			console.log("------");
			*/
			d.push([misspelling,expected]);
			inaccuracies++;
		}
	});
}

console.log(inaccuracies);
console.log("Accuracy:",Math.round(((misspellings.length - inaccuracies)*100)/misspellings.length),"%");
writeFileSync("./d.json",JSON.stringify(d,null,4));