const { Router } = require("express");
const router = Router();


var posts = [
    {
        title: "JSON Generator: Create Random",
        users: "Divyeh",
        body:
            "Random Data Generator REST API produces fictional - yet realistic - personal data on demand. Returned data is always random within its class. The API supports a variety of services: locations, names, dates, numbers, social security numbers, credit card numbers. The API can be used as a personal data generator in application development. Please consult the Roadmap page for planned release dates of new services.",
    },
    {
        title: "How Things Work: Artificial Neural Networks",
        users: "ABC",
        body:
            "Neural networks are, in a nutshell, a subfield of machine learning algorithms that are inspired by neurons in the human brain",
    },
];

router.get("/posts", (req, res) => {
    console.log(req.query);
    const { title } = req.query;
    if (title) {
        const post = posts.find((post) => post.title === title);
        if (post) res.status(200).send(post);
        else res.status(404).send("not found");
    }
    res.status(404).send("not found");
});

router.post("/posts", (req, res) => {
    const post = req.body;
    posts.push(post);
    res.status(201).send(post);
});

router.get("/protected", (req, res) => {
    res.status(200).json({ msg: "You are authorized" });
});

module.exports = router;
