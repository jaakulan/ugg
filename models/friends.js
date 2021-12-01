const mysql = require('mysql');
const config = require('../config.json');

const friendsPool = mysql.createPool({
    password: config['db-password'],
    user: config['db-username'],
    database: 'UG',
    host: config['db-connection-string'],
    port: '3306'
});

let friendsDB = function(User){
    this.friendOneEmail = User.friendOneEmail; // email of first friend
    this.friendTwoEmail = User.friendTwoEmail; // email of second friend
};

friendsDB.createFriends = (newFriendOne, newFriendTwo) => {
    return new Promise((resolve, reject)=>{
        friendsPool.query("SELECT * FROM friends WHERE friendOneEmail = ? AND friendTwoEmail = ?", 
        [newFriendOne, newFriendTwo], // check that the denoted ordering does not exist in DB
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            else if (res.length > 0) { // exists in db
                return reject("users are already friends");
            }
        });
        friendsPool.query("SELECT * FROM friends WHERE friendTwoEmail = ? AND friendOneEmail = ?", 
        [newFriendOne, newFriendTwo], // check that the denoted ordering does not exist in DB
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            else if (res.length > 0) { // exists in db
                return reject("users are already friends");
            }
            else { // survived all checks
                const user = new friendsDB({friendOneEmail: newFriendOne, friendTwoEmail: newFriendTwo});
                friendsPool.query("INSERT INTO friends SET ?", [user],
                (err, res) => {
                    if (err) {
                    console.log("error: ", err);
                    return reject(err);
                    }
                    else {
                        return resolve(res);
                    }
                });
            }
        });        
    })
  };

/* Get all friend pairs.
*/
friendsDB.all = () => {
    return new Promise((resolve, reject)=>{
        friendsPool.query('SELECT * from friends',(err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/* Get all friends according to a user's email.
*/
friendsDB.friendsByUser = (friendOneEmail) => {
    return new Promise((resolve, reject)=>{ // this will not double count because it is impossible to have two friend pairs with different orderings in DB (see create method)
        friendsPool.query('SELECT friendTwoEmail from friends WHERE friendOneEmail = ? UNION SELECT friendOneEmail from friends WHERE friendTwoEmail = ?', 
        [friendOneEmail, friendOneEmail], 
        (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/* Update by user's email.
Note: Checks if user is user 1 or user 2
*/
friendsDB.updateByFriendPair = (friendOneEmail, friendTwoEmail) => { // DO NOT USE
    return new Promise((resolve, reject)=>{
        friendsPool.query(
        "UPDATE friends SET friendTwoEmail = ? WHERE friendOneEmail = ?",
        [friendOneEmail, friendTwoEmail],
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            if (res.affectedRows == 0) { // it is not user 1, might be user 2
                friendsPool.query(
                    "UPDATE friends SET friendTwoEmail = ? WHERE friendOneEmail = ?",
                    [friendTwoEmail, friendOneEmail],
                    (err2, res2) => {
                        if (err2) {
                        console.log("error: ", err2);
                        return reject(err2);
                        }
                        if (res2.affectedRows == 0) {  
                            // did not find user with specified email
                            return "not found";
                        }
                        return resolve(res2)
                    });
            }
            return resolve(res)
        });
    })
  };


/* Delete by friend pair.
*/
friendsDB.deleteByFriendPair = (friendOneEmail, friendTwoEmail) => {
    return new Promise((resolve, reject)=>{
        friendsPool.query('DELETE from friends WHERE friendOneEmail = ? AND friendTwoEmail = ?', 
        [friendOneEmail, friendTwoEmail], (err, res)=>{
            if(err){
                return reject(err);
            }
            if (res.affectedRows == 0) { // it is the reverse order
                friendsPool.query(
                    'DELETE from friends WHERE friendOneEmail = ? AND friendTwoEmail = ?',
                    [friendTwoEmail, friendOneEmail],
                    (err2, res2) => {
                        if (err2) {
                        console.log("error: ", err2);
                        return reject(err2);
                        }
                        console.log(res2.affectedRows);
                        if (res2.affectedRows == 0) {
                            console.log("HERE");
                            // the friend pair was not found
                            return reject("Friend pair does not exist");
                        }
                        return resolve(res2)
                    });
            }
            else { 
            console.log(res.affectedRows);
            console.log("deleted successfully");
            return resolve(res); // deleted friend pair successfully
            }
        });
    });
};

module.exports = friendsDB;