const fs = require('fs');
const Question = require('../models/question.model');
const Dimension = require('../models/dimension.model');
const Domain = require('../models/domain.model');
const Region = require('../models/region.model');
const Role = require('../models/role.model');
const LifeCycle = require('../models/lifecycle.model');
const mongoose = require('mongoose');
require('dotenv').config();

async function populateDB() {
    try {
        console.log(process.env.DB_CONNECTION)
        mongoose.connect(process.env.DB_CONNECTION , {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, () => {
            console.log("Connected to DB")
        });

        let json_temp = fs.readFileSync(__dirname + "/./json/questionsJSON.json", "utf-8");
        let parsed_questions = JSON.parse(json_temp);
        for (let i = 0; i < parsed_questions.length; ++i) {
            let q_responses = [];
            
            if (parsed_questions[i].responses) {
                for (let j = 0; j < parsed_questions[i].responses.length; ++j) {
                    const q_response = {
                        responseNumber: j,
                        indicator: parsed_questions[i].responses[j].indicator || null,
                        score: parsed_questions[i].responses[j].score || null
                    };
                    q_responses.push(q_response);
                }
            }
            console.log(parsed_questions[i])

            let prompt = parsed_questions[i].prompt.toLowerCase();
            console.log(prompt)

            let trustIndexDimensionObj;
            let domainObj;
            let regionObj;
            let lifecycleObj;
            let roleObj;

            await Dimension.findOne({name: parsed_questions[i].trustIndexDimension}, function(err, obj) {
                trustIndexDimensionObj = obj; 
            });

            await Domain.findOne({name: parsed_questions[i].domainApplicability}, function(err, obj) {
                domainObj = obj;
            });

            await Region.findOne({name: parsed_questions[i].regionalApplicability}, function(err, obj) {
                regiobObj = obj;
            });
                
            await Role.findOne({name: parsed_questions[i].roles}, function(err, obj) {
                roleObj = obj;
            })

            if(!roleObj){
                await Role.findOne({name: "All"}, function(err, obj){
                    roleObj = obj;
                });
            }

            await LifeCycle.findOne({name: parsed_questions[i].lifecycle}, function(err, obj) {
                lifecycleObj = obj;
            });

            if(!lifecycleObj){
                await LifeCycle.findOne({name: "All"}, function(err, obj){
                    lifecycleObj = obj;
                });
            }

            let alt_text = null;
            if (parsed_questions[i].alt_text != "" && parsed_questions[i].alt_text != "\r") {
                alt_text = parsed_questions[i].alt_text;
            }


            await Question.findOneAndUpdate({questionNumber: i+1}, {
                trustIndexDimension: trustIndexDimensionObj ? trustIndexDimensionObj.dimensionID: null,
                domainApplicability: domainObj ? domainObj.domainID : null,
                regionalApplicability: regionObj ? regionObj.regionID : null,
                mandatory: parsed_questions[i].mandatory || true,
                questionType: ((parsed_questions[i].questionType) ? (parsed_questions[i].questionType.toLowerCase().trim()) : null),
                question: parsed_questions[i].question || "",
                alt_text: alt_text,
                prompt: (prompt === "select all that apply:" || prompt === "select all that have been completed:") ?  prompt : null,
                responses: q_responses,
                responseType: parsed_questions[i].responseType || null,
                pointsAvailable: parsed_questions[i].pointsAvailable || 0,
                weighting: parsed_questions[i].weighting || 0,
                reference: parsed_questions[i].reference || null,
                roles: roleObj.roleID,
                lifecycle: lifecycleObj.lifecycleID,
                parent: parsed_questions[i].parent ? parsed_questions[i].parent : null
            }, {upsert:true, runValidators: true}); 
        }
    } catch (err) {
        console.log(err);
    }
    
}
populateDB();