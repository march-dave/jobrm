"use strict";

var express = require("express");
var router = express.Router();

var Application = require('../models/application');
var User = require('../models/user');

router.get('/all', (req, res) => {
    Application.getAll((err, allApplications) => {
        res.status(err ? 400: 200).send(err || allApplications);
    });
});

router.get('/:id', (req, res) => {
    Application.findById(req.params.id, (err, application) => {
        res.status(err ? 400: 200).send(err || application);
    });
});

router.post('/', (req, res) => {
    Application.createApp(req.body, (err1, application) => {
        res.status(err1? 400: 200).send(err1 || application);

        //  else {
        //      User.addApplication(req.user, application, (err2, addedApplication) => {
        //      if(err2) res.status(400).send(err2);
        //      })
        // }
        // res.send();
    });
});

router.put('/:id', (req, res) => {
    Application.updateApp(req.params.id, req.body, (err, updatedApplication) => {
        res.status(err ? 400: 200).send(err || updatedApplication);
    });
});

router.delete('/:id', (req, res) => {
    Application.deleteApp(req.params.id, (err, deletedApplication) => {
        res.status(err ? 400: 200).send(err || deletedApplication);
    });
});

module.exports = router;