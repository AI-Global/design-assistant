const fs = require('fs');

let json_temp = fs.readFileSync("./survey-enfr.json", "utf-8");
let parsed_survey = JSON.parse(json_temp);

let industryChoices = parsed_survey.pages[1]["elements"][3]["choices"];
let industryChoicesList  = [];
var i = 0;
while(industryChoices[i]){
    industryChoicesList.push(industryChoices[i]);
    i++;
}

fs.writeFile("industryChoices.json", JSON.stringify(industryChoicesList), (error) =>
	{
		if(error) throw error;
		console.log("Created industryChoices.json");
    });
    


let countryChoices = parsed_survey.pages[1]["elements"][4]["choices"];
let countryChoicesList = [];
i = 0;
while(countryChoices[i]){
    countryChoicesList.push(countryChoices[i]);
    i++;
}

fs.writeFile("countryChoices.json", JSON.stringify(countryChoicesList), (error) =>
	{
		if(error) throw error;
		console.log("Created countryChoices.json");
    });
