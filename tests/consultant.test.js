const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config('../.env');
const { ConsultantModel } = require('../models/consultant.models')
const { getConsultantProfile } = require('../controllers/consultant.controllers');


async function test() {
    await mongoose.connect(process.env.MONGO_URI);

    // let sampleConsultant = new ConsultantModel(sampleConsultantData);
    // await sampleConsultant.save();
    
    console.log(await getConsultantProfile("00001"));
}

test();
//process.exit();



