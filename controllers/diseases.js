var express = require('express');
var router = express.Router();
var db = require('../models');
var async = require('async');


router.get('/', function(req, res) {
    db.disease.findAll().then(function(diseases) {
        res.render("diseases/all", { diseases: diseases });
    }).catch(function(error) {
        console.log("error", error);
        res.send("error");
    });
});

router.post('/', function(req, res) {
    db.disease.create({
        name: req.body.name,
        description: req.body.description,
        severity: req.body.severity,
        transmission: req.body.transmission
    }).then(function(newDisease) {
        var symptoms = [];
        if (req.body.symptoms) {
            symptoms = req.body.symptoms.split(",");
            console.log(symptoms);
        }
        if (symptoms.length > 0) {
            async.forEachSeries(symptoms, function(symptom, callback) {
                db.symptom.findOrCreate({
                    where: { name: symptom.trim() }
                }).spread(function(symptom, wasCreated) {
                    newDisease.addSymptom(symptom);
                    callback();
                });
            }, function() {
                res.redirect('/diseases');
            });
        } else {
            res.redirect("/diseases");
        }
    });
});


router.get('/add', function(req, res) {
    res.render('diseases/add');
});

router.get('/:id', function(req, res) {
    var diseaseId = req.params.id;

    db.disease.findOne({
        where: { id: diseaseId },
        include: [db.symptom]
    }).then(function(disease) {
        res.render("diseases/show", { disease: disease });
    });

});









module.exports = router;
