var express = require('express');
var router = express.Router();
var db = require("../models");


router.get('/', function(req, res) {
    db.symptom.findAll().then(function(symptoms) {
        res.render("symptoms/all", { symptoms: symptoms });
    }).catch(function(error) {
        console.log("error", error);
        res.send("error");
    });

});

router.post('/', function(req, res) {
    db.symptom.create(req.body).then(function(symptom) {
        res.redirect("/symptoms");
    }).catch(function(error) {
        console.log("error", error);
        res.send("error!");
    });
});


router.get('/add', function(req, res) {
    res.render('symptoms/add');
});

router.get('/:id', function(req, res) {
    var symptomId = req.params.id
})


module.exports = router;
