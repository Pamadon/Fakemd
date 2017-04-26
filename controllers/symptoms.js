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
    db.symptom.create({
        name: req.body.name,
        description: req.body.description,
        affectedSystems: req.body.affectedSystems,
        severity: req.body.severity
    }).then(function(symptom) {
        var diseases = [];
        if (req.body.diseases) {
            diseases = req.body.diseases.split(',');
        }

        if (diseases.length > 0) {
            async.forEachSeries(diseases, function(disease, d) {
                db.disease.findOrCreate({
                    where: { name: disease.trim() }
                }).spread(function(disease, wasCreated) {
                    symptom.addDisease(disease);
                    d();
                });
            }, function() {
                res.redirect('/symptoms');
            });
        } else {
            res.redirect('/symptoms');
        }
    }).catch(function(error) {
        console.log('error', error);
    });
});


router.get('/add', function(req, res) {
    res.render('symptoms/add');
});

router.get('/:id', function(req, res) {
    var symptomId = req.params.id;

    db.symptom.findOne({
        where: { id: symptomId },
        include: [db.disease]
    }).then(function(symptom) {
        res.render('symptoms/show', { symptom: symptom });
    }).catch(function(error) {
        console.log('error', error);
    });
});

module.exports = router;
