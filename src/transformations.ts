const vowels = ["a","i","o","u","y","e"];
const emptyVoice = ["w","h"].concat(vowels);
const comesWithH = ["w","p","g","p","c","s"];

export interface ReplacementObject {
	regex:RegExp;
	replaceWith:string;
}

export const replaceRules:ReplacementObject[] = [
	// drop middle 1
	{
		regex:/(.)(.)(.)/g,
		replaceWith:"$1$3"
	},
	// drop middle 2
	{
		regex:/(..)(..)(..)/g,
		replaceWith:"$1$3"
	},
	// drop middle 3
	{
		regex:/(..)(...)(..)/g,
		replaceWith:"$1$3"
	},
	// drop middle 4
	{
		regex:/(..)(....)(..)/g,
		replaceWith:"$1$3"
	},
	// drop what's between first 2 and vowels
	{
		regex:new RegExp(`^(..)(.*)([${vowels.join("")}])`),
		replaceWith:"$1$3"
	}
];


export const rules:ReplacementObject[] = [
	// drop the vowels
	new RegExp(`[${vowels.join("")}]`,"gi"),
	// drop the empty sounds
	new RegExp(`[${emptyVoice.join("")}]`,"gi"),
	// drop the ones that comes with H
	new RegExp(`h?[${comesWithH.join("")}]h?`,"gi"),
	// drop common group 1
	/[tmnbp]/gi,
	// drop common group 2
	/[rdsakl]/gi,
	// drop the first 1 char
	/^./,
	// drop the first 2 chars
	/^../,
	// drop the first 3 chars
	/^.../,
	// drop the last 1 char
	/.$/,
	// drop the last 2 chars
	/..$/,
	// drop the last 3 chars
	/...$/,
	// drop repeated
	/(.)(?=.*\1)/g,
	// drop non words
	/\W/g,
]
.map(regex=>{
	return {
		regex:regex,
		replaceWith:"",
	};
})
.concat(replaceRules);

export default rules;