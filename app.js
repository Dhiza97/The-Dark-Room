import express from "express"
import bodyParser from "body-parser"
import ejs from "ejs"
import _ from "lodash"
import { check, validationResult } from "express-validator"

const app = express()
const port = 8080

const homeStartingContent = "Welcome to The DarkRoom!📓 Dive into a realm where your thoughts find a clandestine haven. Embrace the freedom to pen your untold stories, dreams, and confessions. May your journey be one of self-discovery and the joy of hidden expressions. Happy journaling!";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


let posts = []

app.get("/", (req, res) => {
    res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
    })
})

app.get("/compose", (req, res) => {
    res.render("compose")
})

app.post("/compose", (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody,
    }

    posts.push(post);

    res.redirect("/")
})

app.get("/posts/:postName", (req, res) => {
    const reqTitle = _.lowerCase(req.params.postName)
    
    posts.forEach((post) => {
        const storedTitle = _.lowerCase(post.title)

        if(storedTitle === reqTitle) {

            res.render("post", {
                title: post.title,
                content: post.content
            })
        }
    })
})

app.get("/edit/:postName", (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postName)
    
    posts.forEach((post) => {
        const storeTitle = _.lowerCase(post.title)

        if(storeTitle === requestedTitle) {

            res.render("edit", {
                title: post.title,
                content: post.content
            })
        }
    })
    console.log(posts);
})

app.post("/edit/:postName", (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postName)
    const { title, content } = req.body;

    const postIndex = posts.findIndex(post => _.lowerCase(post.title) === requestedTitle);

    if (postIndex !== -1) {
        posts[postIndex] = { title, content };
        console.log("Updated posts:", posts);
        res.redirect(`/posts/${encodeURIComponent(_.lowerCase(title))}`);
    } else {
        console.log("Post not found for editing.")
        res.status(404).send("Post not found");
    }
})

app.post("/delete/:postName", (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postName)

    // Find the index of the post to delete
    const postIndex = posts.findIndex(post => _.lowerCase(post.title) === requestedTitle);

    if (postIndex !== -1) {
        // Remove the post from the array
        posts.splice(postIndex, 1);
        res.redirect("/");
    } else {
        // Handle the case where the post is not found.
        res.status(404).send("Post not found");
    }
})

app.get("/about", (req, res) => {
    res.render("about.ejs")
})

app.get("/login", (req, res) => {
    res.render("login")
    const { username, password } = req.body

    if(username && password){
        res.redirect("/")
    } else {
       console.log('Fill in empty field')
    }

})

app.get("/register", (req, res) => {
    res.render("register")
})


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log("Running on port 8080")
})