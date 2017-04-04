import spelt from "../src/index";
import {readFileSync} from "fs";
const checker = spelt({distanceThreshold:0.22,lang:"gb"});
// this file has about 2000 misspellings
const file = readFileSync(__dirname+"/big-sample.txt","utf8").split(/\W+/);


// H.G Wells
let t0 = new Date().getTime();
let HGWellsMisspelt = 0;
for (var index = 0; index < file.length; index++) {
	if(!checker(file[index]).correct) HGWellsMisspelt++;
}
let HGWellsTimeToken = new Date().getTime() - t0;
console.log("+ H.G. Wells Novel");
console.log("\tWe processed",file.length,"words");
console.log("\tand found",HGWellsMisspelt,"misspelt words");
console.log("\tThe whole file was processed in",HGWellsTimeToken/1000,"seconds");
console.log("\tWith the rate of",Math.round(file.length/(HGWellsTimeToken/1000)),"words per second");
console.log("========================================");



// Wikipedia
const wikipediaEntries:string[] = [];
readFileSync(__dirname+"/list.txt","utf8")
.replace(/^\#.*\n/gm,"")
.split(/\n/)
.forEach((line)=>{
	const l = line.replace(/ +/g,"").split(/\t/);
	wikipediaEntries.push(l[0]);
});

t0 = new Date().getTime();
for (var index = 0; index < wikipediaEntries.length; index++) {
	checker(wikipediaEntries[index]);
}
let WikipediaTimeToken = new Date().getTime() - t0;
console.log("+ Wikipedia list");
console.log("\tWe processed",wikipediaEntries.length,"misspelt entries");
console.log("\tin",WikipediaTimeToken/1000,"seconds");
console.log("\tWith the rate of",Math.round(wikipediaEntries.length/(WikipediaTimeToken/1000)),"words per second");