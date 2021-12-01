const mysql = require('mysql');
const config = require('../config.json')

const descriptionPool = mysql.createConnection({
    password: config['db-password'],
    user: config['db-username'],
    host: config['db-connection-string'],
    database: 'UG',
    port:'3306'
    
});

descriptionPool.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Connected to DB");
  });

let descriptionDB = function(User){
    this.email = User.email;
    this.description = User.description;
};

descriptionDB.createDescription = (newEmail, newDescription) => {
    return new Promise((resolve, reject)=>{
        const user = new descriptionDB({email: newEmail, 
            description: newDescription});
        descriptionPool.query(
            'INSERT INTO users SET ?',
        [user],
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            return resolve("added")
        });
    })
  };

descriptionDB.all = () => {
    return new Promise((resolve, reject)=>{
        descriptionPool.query('Select * from users',(err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
  }


descriptionDB.descriptionByEmail = (email) => {
    return new Promise((resolve, reject)=>{
        descriptionPool.query('Select * from users where email = ?', email, (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

descriptionDB.updateByEmail = (email, description) => {
    return new Promise((resolve, reject)=>{
        descriptionPool.query(
        "UPDATE users SET user = ? WHERE email = ?",
        [description, email],
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            if (res.affectedRows == 0) {
            // not found user with the email
            return "not found";
            }
            return resolve(res)
        });
    })
  };

  descriptionDB.deleteByEmail = (email) => {
    return new Promise((resolve, reject)=>{
        descriptionPool.query('DELETE from users WHERE email = ?', email, (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(null);
        });
    });
};

module.exports = descriptionDB;
