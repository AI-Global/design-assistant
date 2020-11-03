const prompt = require('prompt-sync')();
const fs = require('fs');
const readline = require('readline');
const lineByLine = require('n-readlines');
const e = require('express');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

function main(){
	var fpath = prompt("Enter path to TSV: ");
	const tsv = new lineByLine(fpath);
	tsv.next(); // skip header lines


	let qNums = [];
	let collection = [];
	let line;
	let multChoice = false;
	let count = 0;
	let doc;
	let questionNumber;
	let trustIndexDimension;
	let domainApplicability;
	let regionalApplicability;
	let mandatory;
	let group;
	let questionType;
	let question;
	let qPrompt;
	let responses = {};
	let responseType;
	let pointsAvailable;
	let weighting;
	let reference;
	let roles;
	let lifecycle;
	let altText;

	let counter = 0;
	while(line = tsv.next()){
		counter += 1;
		console.log(counter);
		line = line.toString('ascii');
		let values = line.split('\t');
		if(!multChoice){
			count = 0;
		}
		
		if(values[0]){ //if uuid is not empty
			if(values[0].charAt(0) === "Q" && multChoice === true){
				doc["responses"] = responses;
				collection.push(doc);
				multChoice = false;
				count = SSL_OP_SSLEAY_080_CLIENT_DH_BUG;
			}
			if(!multChoice){
				questionNumber = values[1];
				trustIndexDimension = values[2];
				domainApplicability = values[3];
				regionalApplicability = values[4];
				mandatory = values[5];
				group = values[6];
				questionType = values[7];
				question = values[8];
				qPrompt = values[10];
				responses = [];
				responseType;
				pointsAvailable = values[13];
				weighting = values[14];
				reference = values[15];
				roles = "All";
				lifecycle = "All";
				altText = values[16];
				
				doc = {"questionNumber":Number(questionNumber)};

				if(trustIndexDimension && trustIndexDimension != 'N/A'){
					doc["trustIndexDimension"] = trustIndexDimension;
				}

				if(domainApplicability && domainApplicability != "N/A"){
					doc["domainApplicability"] = domainApplicability;
				}

				if(regionalApplicability && regionalApplicability != "N/A"){
					doc["regionalApplicability"] = regionalApplicability;
				}

				doc["mandatory"] = mandatory ? true : false;
				doc["questionType"] = questionType;
				doc["question"] = question;
				doc["prompt"] = qPrompt;


				// determine the type of response for the question
				// NOTE: comment type questions are indeteminable from text
				if(qPrompt === "free text"){
					// comment or text
						if(question === "Project Description") doc["responseType"] = "comment"; // special case
						else doc["responseType"] = "text";
				} else if (group  === 'Group'){
						doc["responseType"] = 'checkbox';
						multChoice = true;
				} else if (group === 'not group'){
						doc["responseType"] = 'radiogroup';
						multChoice = true;
				} else if (qPrompt.substring(0,2) === 'CV'){
						doc["responseType"] = "dropdown";
				} else {
                    doc["responseType"] = "checkbox";
                    multChoice = true;
                }
				doc["pointsAvailable"] = Number(pointsAvailable);

				// parse the weighting of the question
				switch(weighting){
					case("high"):
						doc["weighting"] = 3;
						break;
					case("medium"):
						doc["weighting"] = 2;
						break;
					case("low"):
						doc["weighting"] = 1;
						break;
					default:
						doc["weighting"] = 0;
				}

				reference = formatList(reference.replace(/'/g, "\\u0027").replace(/"/g, "\\u0022"));
				doc["reference"] = reference;
				doc["roles"] = roles;
				doc["lifecycle"] = lifecycle;
				
				if(altText){
					altText = formatList(altText.replace(/'/g, "\\u0027").replace(/"/g, "\\u0022"));
					doc["alt_text"] = altText;
				} 

				if(doc["responseType"] === "dropdown"){
					if(question === "Industry"){
						//
						doc["responses"] = getDropdownChoices("./industryChoices.json");
					} else if (question === "Country"){
						//
						doc["responses"] = getDropdownChoices("./countryChoices.json");
					}
				}
				
				if(!multChoice){
					collection.push(doc);
				}
			} else{
				// answer
				let response = {"responseNumber":count, "indicator":(values[10]) ? formatList(values[10].replace(/'/g, "\\u0027").replace(/"/g, "\\u0022")) : values[10], "score":values[12]};
				responses[count++] = response;
			}
		}
	}
	fs.writeFile("questionsJSON.json", JSON.stringify(collection), (error) =>
	{
		if(error) throw error;
		console.log("Created questionsJSON.json");
	})
}

function getDropdownChoices(jsonPath){
	let data = fs.readFileSync(jsonPath, "utf-8");
	let pData = JSON.parse(data);
	let choices = [];
	let i = 0;
	console.log("industry");
	while(pData[i]){
		let value = Number(pData[i]["value"]);
		let text = pData[i]["text"]["default"];
		choices.push({"responseNumber":value, "indicator":text});
		i++;
	}
	return choices;
}

function formatList(text){
	if(text.search(":")){
		text = text.replace(/ \- /g, "/n- ");
	}
	return text;
}

main();
