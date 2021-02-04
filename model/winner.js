const mongoose = require('mongoose')


const Winner = new mongoose.Schema({
	   winner :{type: String, required :true},
	   DATE :{type: String, required:true}
},{collection: 'Winner'})

const model=mongoose.model('Winner',Winner)

module.exports=model