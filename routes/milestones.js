"use strict";

const express = require("express");
const router = express.Router();

const Application = require('../models/application');
const Milestone = require('../models/milestone');

router.post('/', (req, res) => {
    let applicationId = req.body.applicationId;
    let milestoneObj = req.body.milestoneObj;
    Milestone.createMilestone(milestoneObj, applicationId, (err, savedApplication) => {
        res.status(err ? 400: 200).send(err || savedApplication);
    });
});

router.get('/:id', (req, res) => {
    Milestone.findById(req.params.id, (err, milestone) => {
        res.status(err ? 400: 200).send(err || milestone);
    });
});

router.put('/:id', (req, res) => {
    Milestone.update(req.params.id, req.body, (err, updatedMilestone) => {
        res.status(err ? 400: 200).send(err || updatedMilestone);
    });
});

router.delete('/:milestoneid/remove/:applicationId', (req, res) => {
    let milestoneid = req.params.milestoneid;
    let applicationId = req.params.applicationId;
    Milestone.deleteMilestone(milestoneId, applicationId, (err, updatedApplication) => {
        res.status(err ? 400: 200).send(err || updatedApplication);
    });
});

//add task to milestone
router.post('/:milestoneId', (req, res) => {
    Milestone.addTask(req.params.milestoneId, req.body, (err, updatedMilestone) => {
        res.status(err ? 400: 200).send(err || updatedMilestone);
    });
});

//remove task from a milestone



module.exports = router;
