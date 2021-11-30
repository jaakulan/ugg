const mysql = require('mysql');

const friendsPool = mysql.createPool({
    connectionLimit: 10,
    password: '1234',
    user: 'root',
    database: 'friends',
    host: 'localhost',
    port: '3306'
});

let friendsDB = function(User){
    this.friendOne = User.friendOne; // email of first friend
    this.friendTwo = User.friendTwo; // email of second friend
};

friendsDB.createFriends = (newFriendOne, newFriendTwo) => {
    return new Promise((resolve, reject)=>{
        if (friendsPool.query('EXISTS SELECT * FROM friends WHERE friendOne = ? AND friendTwo = ?'), 
        [newFriendOne, newFriendTwo], // check that the denoted ordering does not exist in DB
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            return resolve("users are already friends")
        });
        else if (friendsPool.query('EXISTS SELECT * FROM friends WHERE friendTwo = ? AND friendOne = ?'), 
        [newFriendOne, newFriendTwo], // check that the reverse ordering does not exist in DB
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            return resolve("users are already friends")
        });

        const user = new friendsDB({friendOne: newFriendOne, friendTwo: newFriendTwo});
        friendsPool.query('INSERT INTO friends SET ?', [user],
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            return resolve("added")
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
friendsDB.friendsByUser = (friendOne) => {
    return new Promise((resolve, reject)=>{ // this will not double count because it is impossible to have two friend pairs with different orderings in DB (see create method)
        friendsPool.query('SELECT friendTwo from friends WHERE friendOne = ? UNION SELECT friendOne from friends WHERE friendTwo = ?', 
        [friendOne, friendOne], 
        (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

/* Update by user's email.
Note: Checks if user is user 1 or user 2
*/
friendsDB.updateByFriendPair = (friendOne, friendTwo) => { // might not need this
    return new Promise((resolve, reject)=>{
        friendsPool.query(
        "UPDATE friends SET friendTwo = ? WHERE friendOne = ?",
        [friendOne, friendTwo],
        (err, res) => {
            if (err) {
            console.log("error: ", err);
            return reject(err);
            }
            if (res.affectedRows == 0) { // it is not user 1, might be user 2
                friendsPool.query(
                    "UPDATE friends SET friendTwo = ? WHERE friendOne = ?",
                    [friendTwo, friendOne],
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
friendsDB.deleteByFriendPair = (friendOne, friendTwo) => {
    return new Promise((resolve, reject)=>{
        friendsPool.query('DELETE from friends WHERE friendOne = ? AND friendTwo = ?', 
        [friendOne, friendTwo], (err, res)=>{
            if(err){
                return reject(err);
            }
            if (res.affectedRows == 0) { // it is the reverse order
                friendsPool.query(
                    'DELETE from friends WHERE friendOne = ? AND friendTwo = ?',
                    [friendTwo, friendOne],
                    (err2, res2) => {
                        if (err2) {
                        console.log("error: ", err2);
                        return reject(err2);
                        }
                        if (res2.affectedRows == 0) {  
                            // the friend pair was not found
                            return "not found";
                        }
                        return resolve(res2)
                    });
            }
            return resolve("friend pair successfully deleted");
        });
    });
};

module.exports = friendsDB;