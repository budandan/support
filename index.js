const express = require('express');

let app = express();

let path = require('path');

const port = 3000;

const Ticket = require('./models/ticket');
const mongoDbConnectionString = require('./environments.js')

const mongoose = require('mongoose');
mongoose
	.connect(mongoDbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log('[MONGO] Connection Successful!');
		app.listen(port, () => console.log('[SYSTEM] Avolta Support is online.'));
	})
	.catch((err) => console.err(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/tickets', async (req, res) => {
	const tickets = await Ticket.find();
	res.render('tickets', { tickets });
});

app.get('/create-ticket', async (req, res) => {
    res.render('createTicket');
})

app.get('/tickets/:id', async (req, res) => {
	const ticket = await Ticket.findOne({ _id: req.params.id });
	res.render('ticketDetails', { ticket });
});

app.post('/tickets', async (req, res) => {
	const ticketToCreate = new Ticket({
		title: req.body.title,
		description: req.body.description,
		creatorId: '', // id of user
		creatorName: req.body.creatorName,
		priority: req.body.priority,
		notes: [],
		developers: [],
		stakeholders: [
			{
				id: '', // id of user
				name: req.body.creatorName,
				isPrimaryStakeholder: true,
			},
		],
		actions: [
			{
				action: 'Ticket created.',
				actorId: '', // id of user
                actorName: req.body.creatorName
			},
		],
        status: 'Open'
	});
	const ticket = await ticketToCreate.save();
	res.redirect(`/tickets/${ticket.id}`);
});

app.post('/tickets/:id/notes', async (req, res) => {
	const noteToAdd = {
		author: req.body.creatorName,
		body: req.body.body,
	};
    console.log({ noteToAdd });
	const ticketToModify = await Ticket.findOne({ _id: req.params.id });
    console.log(ticketToModify)
    ticketToModify.notes.push(noteToAdd);
	await ticketToModify.save();
	res.redirect(`/tickets/${ticketToModify.id}`);
});