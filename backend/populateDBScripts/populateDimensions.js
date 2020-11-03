const fs = require('fs');
const { parse } = require('path');
const Dimension = require('../models/dimension.model');

async function populateDimensions() {
    let json_temp = fs.readFileSync("json/trustIndexDimensions.json", "utf-8");
    let parsed_dimensions = JSON.parse(json_temp);

    for (let i = 0; i < parsed_dimensions.length; ++i) {
        // const dimension = new Dimension({dimensionID: i, name: parsed_dimensions[i].name, label: parsed_dimensions[i].label});
        // console.log(dimension);

        await Dimension.findOneAndUpdate({dimensionID: i}, {
            name: parsed_dimensions[i].name,
            label: parsed_dimensions[i].label
        }, {upsert:true, runValidators: true});



        // dimension.markModified('Dimension');
        // dimension.save(function (err) {
        //     if (err) {
        //         console.log(err);
        //         return handleError(err);
        //     }
        //     console.log("saved!");
        //     // if (err) console.log(err);
        //     // saved!
        // });
    }
}

populateDimensions();