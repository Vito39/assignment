const mongoose = require('mongoose')


const ParticipantSchema = new mongoose.Schema({
	   username :{type: String, required :true},
	   DATE :{type: String, required:true}
},{collection: 'Participant'})

const model=mongoose.model('ParticipantSchema',ParticipantSchema)

module.exports=model