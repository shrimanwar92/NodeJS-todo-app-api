var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://dbuser1:dbuser1@ds159507.mlab.com:59507/db1', ['todos']);
db.on('error', function (err) {
    console.log('database error', err)
})

db.on('connect', function () {
    console.log('database connected')
})

//get all todos
router.get('/todos', function(req, res, next) {
	db.todos.find(function(err, todos) {
		if(err) {
			res.json(err);
		} else {
			res.json(todos);
		}
	})
});

//get todo by id
router.get('/todo/:id', function(req, res, next) {
	var id = mongojs.ObjectId(req.params.id);
	db.todos.findOne({_id: id}, function(err, todo) {
		if(err) {
			res.json(err);
		} else {
			res.json(todo);
		}
	})
});

// create a todo
router.post('/todo', function(req, res, next) {
	var todo = req.body;
	if(!todo.text || !(todo.isCompleted + '')) {
		res.status(400);
		res.json({"error": "Invalid Data"})
	} else {
		db.todos.save(todo, function(err, result) {
			if(err) {
				res.json(err);
			} else {
				res.json(result);
			}
		})
	}


});

//update a todo
router.put('/todo/:id', function(req, res, next) {
	var todo = req.body;
	var updateTodo = {};

	if(todo.isCompleted) {
		updateTodo.isCompleted = todo.isCompleted;
	}
	if(todo.text) {
		updateTodo.text = todo.text;
	}
	if(!updateTodo) {
		res.json({"error": "Invalid Data"});
	} else {
		var id = mongojs.ObjectId(req.params.id);
		db.todos.update({_id: id}, updateTodo, {}, function(err, todo) {
			if(err) {
				res.json(err);
			} else {
				res.json(todo);
			}
		})
	}
});

/* DELETE a Todo */
router.delete('/todo/:id', function(req, res) {
    db.todos.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, '', function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
 
});

module.exports = router;