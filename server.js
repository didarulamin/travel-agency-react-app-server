const express = require("express");
const cors = require("cors");
var admin = require("firebase-admin");
const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());

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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// console.log(uuidv4());

const db = getFirestore();

// console.log(db);

const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;

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

//mybooking query
app.get("/api/mybooking/:id", async (req, res) => {
  const mybooking = [];
  const Ref = db.collection("all_bookings");
  const snapshot = await Ref.where("bookedUser", "==", req.params.id).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  snapshot.forEach((doc) => {
    mybooking.push({ ...doc.data() });
  });

  res.json(mybooking);
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
  const Packages = [];
  const Ref = db.collection("all_bookings");
  const snapshot = await Ref.where("bookingId", "==", req.params.id).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  snapshot.forEach((doc) => {
    const id = doc.id;
    Packages.push({ id, ...doc.data() });
  });

  const del_id = Packages[0].id;
  console.log(del_id);

  const upRef = db.collection("all_bookings").doc(del_id);

  const result = await upRef.update({ status: req.body.status });

  res.json(Packages[0]);
});

//package update
app.put("/api/package/update/:id", async (req, res) => {
  // console.log(req.params.id);
  console.log(req.body.data);
  const {
    doc_id,
    not_included,
    price,
    departure,
    img_url,
    return_time,
    rating,
    title,
    submitBy,
    tour_duration,
    accommodation,
    description,
    destination,
    departure_time,
  } = req.body.data;
  // const Packages = [];
  /* const Ref = db.collection("Tour_Packages");
  const snapshot = await Ref.where("id", "==", req.params.id).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  snapshot.forEach((doc) => {
    const id = doc.id;
    Packages.push({ id, ...doc.data() });
  });

  const up_id = Packages[0].id;
  console.log(up_id);

  const upRef = db.collection("Tour_Packages").doc(up_id);

  const data = req.body.data;

  const result = await upRef.update({
    doc_id,
    not_included,
    price,
    departure,
    img_url,
    return_time,
    rating,
    title,
    submitBy,
    tour_duration,
    accommodation,
    description,
    destination,
    departure_time,
  }); */

  const cityRef = db.collection("Tour_Packages").doc(req.body.data.doc_id);
  const result = await cityRef.update({
    doc_id,
    not_included,
    price,
    departure,
    img_url,
    return_time,
    rating,
    title,
    submitBy,
    tour_duration,
    accommodation,
    description,
    destination,
    departure_time,
  });

  res.json("updatead");
});

app.put("/api/booking/delete/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.status);

  const Ref = db.collection("all_bookings").doc(req.params.id).delete();

  res.send(Ref);
});

app.get("/api/package/delete/:id", async (req, res) => {
  console.log(req.params.id);

  const allPackages = [];
  const Ref = db.collection("Tour_Packages").doc(req.params.id).delete();

  const citiesRef = db.collection("Tour_Packages");
  const snapshot = await citiesRef.get();
  snapshot.forEach((doc) => {
    const doc_id = doc.id;
    allPackages.push({ doc_id, ...doc.data() });
  });
  console.log(allPackages);
  res.json(allPackages);
});

app.post("/api/signup/admin", async (req, res) => {
  const docRef = db.collection("users").doc();
  const data = req.body.data;
  // console.log(data);
  // const submitBy = req.body.submitBy;
  /* console.log(data);
  console.log(req.body.submitBy); */

  await docRef.set({
    userId: uuidv4(),
    ...data,
  });
  res.send("Request has sent");
});

app.get("/api/signup/admin/check/:email", async (req, res) => {
  const Packages = [];
  const Ref = db.collection("users");
  const snapshot = await Ref.where("email", "==", req.params.email).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  snapshot.forEach((doc) => {
    const id = doc.id;
    Packages.push({ id, ...doc.data() });
  });

  res.json(Packages[0]);
});

app.get("/", async (req, res) => {
  res.send("server is listening");
});

app.listen(port, () => {
  console.log("listening on port", port);
});
