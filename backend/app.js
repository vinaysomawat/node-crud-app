import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { User } from "./user.js";
import { ServerApiVersion } from "mongodb";
import cors  from "cors";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const uri =
  "mongodb+srv://vinaysomawat40:<dbpassword>@cluster0.zwctkwo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  }
}
run().catch(console.dir);

app.get("/users", async (req, res) => {
  const users = await User.find();
  await res.send(users);
});

app.post("/createUser", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res
      .status(201)
      .send('User created successfully');
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

app.post("/updateUser", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res
        .status(200)
        .send(
          `User updated successfully: Name: ${user.firstName}, Email: ${user.userEmail}`
        );
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

app.post("/deleteUser", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(`User deleted successfully: ${user.firstName}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

app.listen(3000, () => {
  console.log("server running");
});
