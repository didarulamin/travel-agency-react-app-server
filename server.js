const express = require("express");
const cors = require("cors");
var admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
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

// console.log(uuidv4());

const db = getFirestore();

// console.log(db);

const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;

app.use(cors());

app.use(express.json());

app.post("/api/addTourPackage/", async (req, res) => {
  const docRef = db.collection("Tour_Packages").doc();
  const data = req.body.data;
  const submitBy = req.body.submitBy;
  /* console.log(data);
  console.log(req.body.submitBy); */

  await docRef.set({
    id: uuidv4(),
    submitBy,
    ...data,
  });

  res.send("data added successfully");
});

app.post("/api/booking/", async (req, res) => {
  const docRef = db.collection("all_bookings").doc();
  const data = req.body.bookingData;
  console.log(data);
  // const submitBy = req.body.submitBy;
  /* console.log(data);
  console.log(req.body.submitBy); */

  await docRef.set({
    bookingId: uuidv4(),
    ...data,
  });

  res.send("data added successfully");
});

app.get("/api/allpackages", async (req, res) => {
  const allPackages = [];
  const citiesRef = db.collection("Tour_Packages");
  const snapshot = await citiesRef.get();
  snapshot.forEach((doc) => {
    const doc_id = doc.id;
    allPackages.push({ doc_id, ...doc.data() });
  });

  res.json(allPackages);
});

app.get("/api/package/:id", async (req, res) => {
  const Packages = [];
  const Ref = db.collection("Tour_Packages");
  const snapshot = await Ref.where("id", "==", req.params.id).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  snapshot.forEach((doc) => {
    Packages.push({ ...doc.data() });
  });

  res.json(Packages);
});

app.get("/api/allbookings", async (req, res) => {
  const allbookings = [];
  const citiesRef = db.collection("all_bookings");
  const snapshot = await citiesRef.get();
  snapshot.forEach((doc) => {
    const doc_id = doc.id;
    allbookings.push({ doc_id, ...doc.data() });
  });

  res.json(allbookings);
});
app.put("/api/booking/status/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.status);

  const Ref = db.collection("all_bookings").doc(req.params.id);
  const result = await Ref.update({ status: req.body.status });

  res.send(result);
});

app.put("/api/booking/delete/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.status);

  const Ref = db.collection("all_bookings").doc(req.params.id).delete();

  res.send(Ref);
});

app.listen(port, () => {
  console.log("listening on port", port);
});
