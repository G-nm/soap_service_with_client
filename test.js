const mysql = require("mysql2");

let connectiondetails = {
  host: "localhost",
  user: "e1f",
  password: "P4m6BUJRFN6LK5y",
};

try {
} catch (error) {}

let connection = mysql.createConnection(connectiondetails);

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected successfully");
  }
});

//checks if database is present
function database_verification() {
  let name = '"student_information_database"';
  let sql = `SHOW DATABASES like ${name}`;
  connection.query(sql, (error, result) => {
    if (error) {
      throw error;
    }
    // removing quotes from databse name
    let nameString = name.replace(/['"]+/g, "");
    // if there is a databse
    if (result[0]) {
      connection.query(`USE ${nameString}`, (error, result) => {
        if (error) {
          //   console.log(error);
          throw error;
        } else {
          console.log(`Database found using (${nameString}) database`);
        }
      });
    } else {
      console.log(`creating database ${nameString}`);
      createdatabse(nameString);
    }
  });
}

// create databse if none
function createdatabse(nameString) {
  let sql = "CREATE DATABASE " + nameString;
  connection.execute(sql, (error, result) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });

  connection.query(`USE ${nameString}`, (error, result) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });
  console.log("Creating table students");
  createtable();
}

function createtable() {
  let createtablesql =
    "CREATE TABLE students (username varchar(5000),age int(100),phonenumber varchar(1000),address varchar(1000), entrypoints varchar(1000), email varchar(1000),studentid int(255) UNIQUE, id int(255) NOT NULL AUTO_INCREMENT, PRIMARY KEY (id))";
  connection.execute(createtablesql, (error, response) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Table students created");
    }
  });
}

function insertintotable(user) {
  let insertsql =
    "INSERT INTO students(username,age,phonenumber,address,entrypoints,email,studentid) VALUES (?,?,?,?,?,?,?)";
  connection.query("USE student_information_database", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      //   console.log(result);
    }
  });

  let status = new Promise((resolve, reject) => {
    connection.execute(
      insertsql,
      [
        user.username,
        user.age,
        user.phonenumber,
        user.address,
        user.entrypoints,
        user.email,
        user.studentid,
      ],
      (err, result) => {
        if (err) {
            console.log(`Insert Failed Error:${err.message}`);
          reject(err.message);
        } else {
          console.log("Inserted Successfully");
          resolve(result.affectedRows);
        }
      }
    );
  });
  return status;
}

function selectuser(searchterm) {
  connection.query("USE student_information_database", (err, result) => {
    if (err) {
      console.log(err);
    }
  });

  let sql = `SELECT * FROM students WHERE studentid LIKE '%${searchterm}%'`;

  let myresult = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err.message);
      }
      resolve(result);
    });
  });

  return myresult;
}

let user = {
  username: "Paul Mwaniki",
  age: 23,
  phonenumber: "323131",
  address: "Awa",
  entrypoints: "70",
  email: "george@mail",
  studentid: 1,
};

// let test = async () => {
//   let result = await insertintotable(user).catch((err) => {
//     console.log(err);
//   });
// };
// test();
database_verification();

module.exports = { insertintotable, selectuser };
