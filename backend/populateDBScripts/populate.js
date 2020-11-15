const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');
const Dimension = require('../models/dimension.model');
const Domain = require('../models/domain.model');
const LifeCycle = require('../models/lifecycle.model');
const Region = require('../models/region.model');
const Role = require('../models/role.model');
const fs = require('fs');

const mongoose = require('mongoose');
require('dotenv').config();

// // Connect to mongoDB
// mongoose.connect(process.env.DB_CONNECTION , {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, () => {
//     console.log("Connected to DB")
// });

// // need so that we don't use deprecated useFindAndModify method
// mongoose.set('useFindAndModify', false);


async function populate() {
    // Connect to mongoDB
    mongoose.connect(process.env.DB_CONNECTION , {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, () => {
        console.log("Connected to DB")
    });

    // need so that we don't use deprecated useFindAndModify method
    mongoose.set('useFindAndModify', false);

    try {
        let json_temp = fs.readFileSync(__dirname + "/roles.json", "utf-8");
        let parsed_roles = JSON.parse(json_temp);

        for (let i = 0; i < parsed_roles.length; ++i) {
            await Role.findOneAndUpdate({roleID: i+1}, {
                name: parsed_roles[i].name
            }, {upsert:true, runValidators: true});
        }
        res.json(parsed_roles);
    } catch(err) {
        console.log(err);
    }
    try {
        let json_temp = fs.readFileSync(__dirname + "/regions.json", "utf-8");
        let parsed_regions = JSON.parse(json_temp);

        for (let i = 0; i < parsed_regions.length; ++i) {
            await Region.findOneAndUpdate({regionID: i+1}, {
                name: parsed_regions[i].name
            }, {upsert:true, runValidators: true});
        }
        res.json(parsed_regions);
    } catch(err) {
        console.log(err);
    }

    try {
        let json_temp = fs.readFileSync(__dirname + "/lifecycles.json", "utf-8");
        let parsed_lifecycles = JSON.parse(json_temp);

        for (let i = 0; i < parsed_lifecycles.length; ++i) {
            await LifeCycle.findOneAndUpdate({lifecycleID: i+1}, {
                name: parsed_lifecycles[i].name
            }, {upsert:true, runValidators: true});
        }
        res.json(parsed_lifecycles);
    } catch(err) {
        console.log(err);
    }

    try {
        let json_temp = fs.readFileSync(__dirname + "/domains.json", "utf-8");
        let parsed_domains = JSON.parse(json_temp);

        for (let i = 0; i < parsed_domains.length; ++i) {
            await Domain.findOneAndUpdate({domainID: i+1}, {
                name: parsed_domains[i].name
            }, {upsert:true, runValidators: true});
        }
        res.json(parsed_domains);
    } catch(err) {
        console.log(err);
    }

    try {
        let json_temp = fs.readFileSync(__dirname + "/trustIndexDimensions.json", "utf-8");
        let parsed_dimensions = JSON.parse(json_temp);

        for (let i = 0; i < parsed_dimensions.length; ++i) {
            await Dimension.findOneAndUpdate({dimensionID: i+1}, {
                name: parsed_dimensions[i].name,
                label: parsed_dimensions[i].label
            }, {upsert:true, runValidators: true});
        }
        res.json(parsed_dimensions);
    } catch(err) {
        console.log(err);
    }

    try {
        let json_temp = fs.readFileSync(__dirname + "/questionsJSON.json", "utf-8");
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

            // let trustIndexDimensionString = parsed_questions[i].trustIndexDimension;
            // if trustIndexDimension

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


            // TODO: Add uuid

            // await Question.findOneAndUpdate({questionNumber: i}, {
            //     trustIndexDimension: ((typeof parsed_questions[i].trustIndexDimension === 'string') ? parsed_questions[i].trustIndexDimension.toLowerCase() : null),
            //     domainApplicability: parsed_questions[i].domainApplicability || null,
            //     regionalApplicability: parsed_questions[i].regionalApplicability || null,
            //     mandatory: parsed_questions[i].mandatory || true,
            //     questionType: ((parsed_questions[i].questionType) ? (parsed_questions[i].questionType.toLowerCase().trim()) : null),
            //     question: parsed_questions[i].question || "",
            //     alt_text: parsed_questions[i].alt_text || null,
            //     prompt: parsed_questions[i].prompt || null,
            //     responses: q_responses,
            //     responseType: parsed_questions[i].responseType || null,
            //     pointsAvailable: parsed_questions[i].pointsAvailable || 0,
            //     weighting: parsed_questions[i].weighting || 0,
            //     reference: parsed_questions[i].reference || null,
            //     roles: parsed_questions[i].roles || null,
            //     lifecycle: parsed_questions[i].lifecycle || null,
            //     parent: parsed_questions[i].parent || null
            // }, {upsert:true, runValidators: true});
        }

        res.json(parsed_questions);
    } catch (err) {
        console.log(err);
    }
}

populate()


// router.get('/roles', async (req, res) => {
//     try {
//         let json_temp = fs.readFileSync(__dirname + "/roles.json", "utf-8");
//         let parsed_roles = JSON.parse(json_temp);

//         for (let i = 0; i < parsed_roles.length; ++i) {
//             await Role.findOneAndUpdate({roleID: i+1}, {
//                 name: parsed_roles[i].name
//             }, {upsert:true, runValidators: true});
//         }
//         res.json(parsed_roles);
//     } catch(err) {
//         console.log(err);
//     }
// });

// router.get('/regions', async (req, res) => {
//     try {
//         let json_temp = fs.readFileSync(__dirname + "/regions.json", "utf-8");
//         let parsed_regions = JSON.parse(json_temp);

//         for (let i = 0; i < parsed_regions.length; ++i) {
//             await Region.findOneAndUpdate({regionID: i+1}, {
//                 name: parsed_regions[i].name
//             }, {upsert:true, runValidators: true});
//         }
//         res.json(parsed_regions);
//     } catch(err) {
//         console.log(err);
//     }
// });

// router.get('/lifecycles', async (req, res) => {
//     try {
//         let json_temp = fs.readFileSync(__dirname + "/lifecycles.json", "utf-8");
//         let parsed_lifecycles = JSON.parse(json_temp);

//         for (let i = 0; i < parsed_lifecycles.length; ++i) {
//             await LifeCycle.findOneAndUpdate({lifecycleID: i+1}, {
//                 name: parsed_lifecycles[i].name
//             }, {upsert:true, runValidators: true});
//         }
//         res.json(parsed_lifecycles);
//     } catch(err) {
//         console.log(err);
//     }
// });

// router.get('/domains', async (req, res) => {
//     try {
//         let json_temp = fs.readFileSync(__dirname + "/domains.json", "utf-8");
//         let parsed_domains = JSON.parse(json_temp);

//         for (let i = 0; i < parsed_domains.length; ++i) {
//             await Domain.findOneAndUpdate({domainID: i+1}, {
//                 name: parsed_domains[i].name
//             }, {upsert:true, runValidators: true});
//         }
//         res.json(parsed_domains);
//     } catch(err) {
//         console.log(err);
//     }
// });

// router.get('/dimensions', async (req, res) => {
//     try {
//         let json_temp = fs.readFileSync(__dirname + "/trustIndexDimensions.json", "utf-8");
//         let parsed_dimensions = JSON.parse(json_temp);

//         for (let i = 0; i < parsed_dimensions.length; ++i) {
//             await Dimension.findOneAndUpdate({dimensionID: i+1}, {
//                 name: parsed_dimensions[i].name,
//                 label: parsed_dimensions[i].label
//             }, {upsert:true, runValidators: true});
//         }
//         res.json(parsed_dimensions);
//     } catch(err) {
//         console.log(err);
//     }
// });

// // not going to be an endpoint in production
// router.get('/questions', async (req, res) => {
//     try {
//         let json_temp = fs.readFileSync(__dirname + "/questionsJSON.json", "utf-8");
//         let parsed_questions = JSON.parse(json_temp);
//         for (let i = 0; i < parsed_questions.length; ++i) {
//             let q_responses = [];
            
//             if (parsed_questions[i].responses) {
//                 for (let j = 0; j < parsed_questions[i].responses.length; ++j) {
//                     const q_response = {
//                         responseNumber: j,
//                         indicator: parsed_questions[i].responses[j].indicator || null,
//                         score: parsed_questions[i].responses[j].score || null
//                     };
//                     q_responses.push(q_response);
//                 }
//             }
//             console.log(parsed_questions[i])

//             let prompt = parsed_questions[i].prompt.toLowerCase();
//             console.log(prompt)

//             // let trustIndexDimensionString = parsed_questions[i].trustIndexDimension;
//             // if trustIndexDimension

//             let trustIndexDimensionObj;
//             let domainObj;
//             let regionObj;
//             let lifecycleObj;
//             let roleObj;

//             await Dimension.findOne({name: parsed_questions[i].trustIndexDimension}, function(err, obj) {
//                 trustIndexDimensionObj = obj; 
//             });

//             await Domain.findOne({name: parsed_questions[i].domainApplicability}, function(err, obj) {
//                 domainObj = obj;
//             });

//             await Region.findOne({name: parsed_questions[i].regionalApplicability}, function(err, obj) {
//                 regiobObj = obj;
//             });
                
//             await Role.findOne({name: parsed_questions[i].roles}, function(err, obj) {
//                 roleObj = obj;
//             })

//             if(!roleObj){
//                 await Role.findOne({name: "All"}, function(err, obj){
//                     roleObj = obj;
//                 });
//             }

//             await LifeCycle.findOne({name: parsed_questions[i].lifecycle}, function(err, obj) {
//                 lifecycleObj = obj;
//             });

//             if(!lifecycleObj){
//                 await LifeCycle.findOne({name: "All"}, function(err, obj){
//                     lifecycleObj = obj;
//                 });
//             }

//             let alt_text = null;
//             if (parsed_questions[i].alt_text != "" && parsed_questions[i].alt_text != "\r") {
//                 alt_text = parsed_questions[i].alt_text;
//             }


//             await Question.findOneAndUpdate({questionNumber: i+1}, {
//                 trustIndexDimension: trustIndexDimensionObj ? trustIndexDimensionObj.dimensionID: null,
//                 domainApplicability: domainObj ? domainObj.domainID : null,
//                 regionalApplicability: regionObj ? regionObj.regionID : null,
//                 mandatory: parsed_questions[i].mandatory || true,
//                 questionType: ((parsed_questions[i].questionType) ? (parsed_questions[i].questionType.toLowerCase().trim()) : null),
//                 question: parsed_questions[i].question || "",
//                 alt_text: alt_text,
//                 prompt: (prompt === "select all that apply:" || prompt === "select all that have been completed:") ?  prompt : null,
//                 responses: q_responses,
//                 responseType: parsed_questions[i].responseType || null,
//                 pointsAvailable: parsed_questions[i].pointsAvailable || 0,
//                 weighting: parsed_questions[i].weighting || 0,
//                 reference: parsed_questions[i].reference || null,
//                 roles: roleObj.roleID,
//                 lifecycle: lifecycleObj.lifecycleID,
//                 parent: parsed_questions[i].parent ? parsed_questions[i].parent : null
//             }, {upsert:true, runValidators: true}); 


//             // TODO: Add uuid

//             // await Question.findOneAndUpdate({questionNumber: i}, {
//             //     trustIndexDimension: ((typeof parsed_questions[i].trustIndexDimension === 'string') ? parsed_questions[i].trustIndexDimension.toLowerCase() : null),
//             //     domainApplicability: parsed_questions[i].domainApplicability || null,
//             //     regionalApplicability: parsed_questions[i].regionalApplicability || null,
//             //     mandatory: parsed_questions[i].mandatory || true,
//             //     questionType: ((parsed_questions[i].questionType) ? (parsed_questions[i].questionType.toLowerCase().trim()) : null),
//             //     question: parsed_questions[i].question || "",
//             //     alt_text: parsed_questions[i].alt_text || null,
//             //     prompt: parsed_questions[i].prompt || null,
//             //     responses: q_responses,
//             //     responseType: parsed_questions[i].responseType || null,
//             //     pointsAvailable: parsed_questions[i].pointsAvailable || 0,
//             //     weighting: parsed_questions[i].weighting || 0,
//             //     reference: parsed_questions[i].reference || null,
//             //     roles: parsed_questions[i].roles || null,
//             //     lifecycle: parsed_questions[i].lifecycle || null,
//             //     parent: parsed_questions[i].parent || null
//             // }, {upsert:true, runValidators: true});
//         }

//         res.json(parsed_questions);
//     } catch (err) {
//         console.log(err);
//     }
// });

// module.exports = router;