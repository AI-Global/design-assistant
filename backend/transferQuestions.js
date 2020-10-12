const prompt = require('prompt-sync')();
const fs = require('fs');
const readline = require('readline');
const lineByLine = require('n-readlines');
const e = require('express');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

function main(){
	var fpath = prompt("Enter path to TSV: ");
	const csv = new lineByLine(fpath);
	
	csv.next();
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

	let counter = 0;
	while(line = csv.next()){
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
				//if(!qNums.includes(values[1])){
				questionNumber = values[1];
				trustIndexDimension = values[2];
				domainApplicability = values[3];
				regionalApplicability = values[4];
				mandatory = values[5];
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
				doc["responseType"] = (qPrompt !== "free text") ? "radiogroup" : "text";
				if(doc["responseType"] === "radiogroup"){
					multChoice = true;
				}
				doc["pointsAvailable"] = Number(pointsAvailable);

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
				}
				
				doc["reference"] = reference;
				doc["roles"] = roles;
				doc["lifecycle"] = lifecycle;
				if(!multChoice){
					collection.push(doc);
				}
			} else{
				// answer
				let response = {"responseNumber":count, "indicator":values[10], "score":values[12]};
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
main();
