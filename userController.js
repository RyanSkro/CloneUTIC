// used to perform operations on users (create, edit, show)

const { test } = require('media-typer');
const User = requrie('./class');
const userDB = require('[./userDBfile]'); //[TODO] update userDBfile when database file is created

class userController{
    //retun list of all users
    async index(req, res) {
        let users = await userDB.allUsers();
        res.render('userList', { users: users });
    }
    
    async admin(req, res) {
        let users = await userDB.allFaculty();
        res.render('admin', { users: users });
    }

    async faculty(req, res) {
        let classes = await userDB.allClasses();
        res.render('faculty', { classes: classes });
    }

    async show(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);

        if (!user) {
            res.send("Couldn't find a user with ID of " + id);
        } else {
            res.render('showUser', { user: user  });
        }
    }

    newUser(req, res) {
        res.render('newUser', {user: new User()});
    }

    async create(req, res) {
        console.log("Creating new user");
        
        let newUser = await userDB.createUser(req.body.user);

        if (newUser.isValid()) {
            res.writeHead(302, { 'Location': `/users/${newUser.id}`});
            res.end();
        } else {
            res.render('newUser', { user: newUser });
        }
    }

    async edit(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);

        if (!user) {
            res.send("Couldn't find a user with id " + id);
        } else {
            res.render('userEdit', { user: user });
        }
    }

    async update(req, res) {
        //update variables for a user
        //[TODO] add variables to be changed when database is set

            console.log("Updating user");
            userDB.update(user);

            res.writeHead(302, { 'Location': `/users/${user.id}` });
            res.end();
        

    }

    async delete(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);
        

        if (!user) {
            res.send("Couldn't find a user with id " + id);
        } else {
            userDB.removeUser(user);
            let users = await userDB.allUsers();
            res.render('userIndex', { users: users });
        }
    }

    async rawIndex(req, res) {
        let users = await userDB.allUsers();
        res.send(users);
    }
}