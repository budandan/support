const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
	author: String,
	body: String,
}, { timestamps: true });

const DeveloperSchema = new Schema(
	{
		id: String,
		name: String,
	},
	{ _id: false }
);

const StakeholderSchema = new Schema(
	{
		id: String,
		name: String,
		isPrimaryStakeholder: Boolean,
	},
	{ _id: false }
);

const ActionSchema = new Schema(
	{
		action: String,
		actorId: String,
		actorName: String,
	},
	{ _id: false, timestamps: true }
);

const TicketSchema = new Schema(
	{
		title: String,
        description: String,
		creatorId: String,
		creatorName: String,
		priority: String,
		notes: [NoteSchema],
		developers: [DeveloperSchema],
		stakeholders: [StakeholderSchema],
		actions: [ActionSchema],
		status: String,
	},
	{ timestamps: true }
);

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
