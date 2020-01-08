const express = require("express");
const mongoose = require("mongoose");

// router here
const router = express.Router();

// for validating the user here
const { check, validationResult } = require("express-validator");

// importing the model here
const Artlices = require("../Models/article");

// getting the add article
router.get("/add", (req, res) => {
    res.render("addArticle", {
        name: "Saif"
    });
});

// adding the article
router.post(
    "/add", [
        // username must be an 4 character long
        check("title").isEmpty(),
        check("author").isEmpty(),
        check("body").isEmpty()
    ],
    (req, res) => {
        // / Finds the validation errors in this request and wraps them in an object with handy functions
        var errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     res.render("addArticle", {
        //         errors: errors.array()
        //     });
        //     console.log(">", errors.array().message);
        // }

        let article = new Artlices({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            author: req.body.author,
            body: req.body.body
        });

        article
            .save()
            .then(result => {
                res.redirect("/");
                req.flash("success", "Article Added");
            })
            .catch(err => {
                req.flash("danger", "Unable to Add");
                console.log(err);
            });
    }
);

// getting the single artilce
router.get("/:id", (req, res) => {
    Artlices.findById(req.params.id)
        .then(data => {
            res.render("singleArticle", {
                data
            });
        })
        .catch(err => console.log(err));
});

// get edit artilce
router.get("/edit/:id", (req, res) => {
    Artlices.findById(req.params.id)
        .then(data => {
            res.render("editArticle", {
                data
            });
        })
        .catch(err => {
            console.log(err);
        });
});

// POSt get articles
router.post("/edit/:id", (req, res) => {
    let articles = {
        title: req.body.title,
        author: req.body.author,
        body: req.body.body
    };
    Artlices.updateOne({ _id: req.params.id }, articles)
        .then(data => {
            res.redirect("/");
            req.flash("success", "Updated");
        })
        .catch(err => {
            req.flash("danger", "Unable to update");
            console.log(err);
        });
});

// deleting the article here
router.delete("/:id", (req, res) => {
    Artlices.deleteOne({ _id: req.params.id })
        .then(data => {
            req.flash("success", "Deleted");
            res.redirect("/");
        })
        .catch(err => {
            req.flash("danger", "Unable to delete");
            console.log(err);
        });
});

// exporting the routes here
module.exports = router;