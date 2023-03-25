import fetch from "node-fetch";
import mongoose from "mongoose";
import express from "express";

const app = express();
const port = 3000;

// Sets app to use the handlebars engine
app.set("view engine", "hbs");

// Connect to the MongoDB server
mongoose.connect("mongodb://127.0.0.1:27017/PMS");

// Create a schema for the database
const postSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const post_data = mongoose.model("post", postSchema);

let response = [];

async function getPosts() {
  // Fetch data from API and convert to JSON
  const myPosts = await fetch("https://jsonplaceholder.typicode.com/posts");
  response = await myPosts.json();

  // Save the response (API data) to the database
  for (let i = 0; i < response.length; i++) {
    const post = new post_data({
      user_id: response[i]["userId"],
      id: response[i]["id"],
      title: response[i]["title"],
      description: response[i]["body"],
    });
    post.save();
  }
}

await getPosts();

// Send data to frontend using express and handlebars
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("data", { response });
});

app.listen(port, () => console.log(`App listening to port ${port}`));
