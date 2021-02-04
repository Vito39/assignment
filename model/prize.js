const mongoose = require('mongoose')


const Prize = new mongoose.Schema({
	   prize :{type: String, required :true},
	   DATE :{type: String, required:true}
},{collection: 'Prize'})

const model=mongoose.model('Prize',Prize)

module.exports=model