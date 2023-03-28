const express = require('express')
const path = require('path')
const fs = require('fs')
var bodyParser = require('body-parser')
const app = express();
const port = 3001;
let notesArray = require('./db/notes')


app.use(express.static(__dirname + '/public'));
var jsonParser = bodyParser.json()


app.get('/',(req,res)=>{
	res.sendFile(path.join(__dirname,'./public/index.html'))
})

app.get('/notes',(req,res)=>{
	res.sendFile(path.join(__dirname,'./public/notes.html'))
})

app.get('/getnotes',(req,res)=>{
	res.json(notesArray);
})

function createnewnote(body,notesArray)
{
	const newnote = body;
	notesArray.push(newnote);
	fs.writeFileSync(
		path.join(__dirname,'./db/notes.json'),
		JSON.stringify(notesArray))
	return newnote
}

app.post('/postnotes',jsonParser,(req,res)=>{
	console.log("Request",req.body)
	console.log("Request",req.body.title)
	//var body = {title: "sddf", text: "dfdgfd"}
	if (notesArray)
	{
		req.body.id = notesArray.length.toString();
	}
	else
	{
		req.body.id = 0
	}
	res.json(createnewnote(req.body,notesArray))

})
function deleteNote(id,notesArray){
	let note = notesArray.filter(x=>{
		if (x.id == id){
			return false
		}
		else{
			return true
		}
	})

	let index =0
	note.forEach(note=>{
		note.id = index.toString();
		index +=1
	})
	fs.writeFileSync(
		path.join(__dirname,'./db/notes.json'),
		JSON.stringify(note))
	return note
}

app.delete('/api/notes/:id',async(req,res)=>{
	const {id} = req.params
	console.log(id)
	notesArray = await deleteNote(id,notesArray);
	res.json(notesArray)

})

app.listen(port,()=>{
	console.log(`Backend Server started at port ${port}`)
})