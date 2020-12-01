const express = require("express");
const app = express();
const soap = require("soap");
const cors = require("cors");
const path = require("path");
const { insertintotable, selectuser } = require("./test");

let service = {
  sis: {
    sisport: {
      registration: async (inputs) => {
        let user = {
          username: inputs.username,
          address: inputs.address,
          age: inputs.age,
          phonenumber: inputs.phonenumber,
          entrypoints: inputs.entrypoints,
          email: inputs.email,
          studentid: inputs.studentid,
        };

        let status = await insertintotable(user).catch((err) => {
          return "0";
        });

        return { status: status };
      },
      search: async (inputs) => {
        let user = await selectuser(inputs.studentid);
        if (user[0]) {
          return {
            username: user[0].username,
            age: user[0].age,
            phonenumber: user[0].phonenumber,
            address: user[0].address,
            entrypoints: user[0].entrypoints,
            email: user[0].email,
            studentid: user[0].studentid,
          };
        } else {
          return {
            username: "",
            age: 0,
            phonenumber: "",
            address: "",
            entrypoints: "",
            email: "",
            studentid: 0,
          };
        }
      },
    },
  },
};

let xml = require("fs").readFileSync("studentregistration.wsdl", "utf-8");

app.get("/", (req, response) => {
  response.sendFile(path.join(__dirname, "build", "index.html"));
});

let server = app.listen(8001);
app.use(cors({ origin: "*", credentials: true }));
app.options("/*", cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});



soap.listen(server, "/studentregistration", service, xml);
