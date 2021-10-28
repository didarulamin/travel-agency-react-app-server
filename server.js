const express = require("express");
const cors = require("cors");
var admin = require("firebase-admin");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
var serviceAccount = require("./tourism-or-delivery-webs-71b76-firebase-adminsdk-tnhuu-0d05c2a67b.json");
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

// console.log(db);

const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;

app.use(cors());

app.use(express.json());

app.post("/api/add/", async (req, res) => {
  const docRef = db.collection("users").doc("heroku");

  await docRef.set({
    first: "Ada",
    last: "Lovelace",
    born: 1815,
  });

  res.send("data added successfully");
});

app.get("/", async (req, res) => {
  const docRef = db.collection("users").doc("tes5");

  await docRef.set({
    first: "Ada",
    last: "Lovelace",
    born: 1815,
  });
  res.send("Server is listening");
});

app.listen(port, () => {
  console.log("listening on port", port);
});
