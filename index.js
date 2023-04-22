//index.js verifies authentication and handles web requests to redirect users to the different pages
//Sam Quist, Up In The Cloud Computing

const express = require('express');
const session = require('express-session');
const favicon = require('express-favicon');

const UserController = require('./userController');
const userController = new UserController();
const CourseController = require('./courseController');
const courseController = new CourseController();
const ScoreController = require('./scoreController');
const scoreController = new ScoreController();

const LoginController = require('./loginController');
const loginController = new LoginController();

const bodyParser = require('body-parser');
const { response } = require('express');

//start server
const app = express();
const port = process.env.PORT || 5000

//session info
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'TsloscsOcTcH4PJdjse8I6293OlhYDs5'
}));

//create public folder for css and image files
app.use(express.static(__dirname + '/public'));

//favicon handling
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//check if users have logged in when requesting login-required pages
function isAuthenticated(req, res, next) {

    console.log('Authenticating user')
    console.log(req.session)
    if (req.session.user) {
        console.log("User already logged in")
        next()
    } else {
        console.log("User is not logged in")
        res.redirect('/login')
    }
}

function isAdmin(req, res, next) {
    console.log('Authenticating admin')
    console.log(req.session)
    if (req.session.user.userID == "UITCAdmin2023") {
        console.log("User is an admin")
        next()
    } else {
        console.log("User is not an admin or not logged in")
        res.redirect('/login')
    }
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//redirect to login page when root directory is requested
app.get('/', (req, res) =>{
    //[TODO] redirect users to respective pages if they're already logged in
    loginController.loginPage(req, res);
})

//////////////////////////////////////////
//login redirects
/////////////////////////////////////////

app.get('/login', (req, res) => {
    loginController.loginPage(req, res);
})

app.post('/login', (req, res) => {
    loginController.requestLogin(req, res);
})

app.get('/logout', (req, res) => {
    loginController.logout(req, res); // this doesnt work yet :)
})

//////////////////////////////////////////
//admin redirects
//////////////////////////////////////////

app.get('/courseSearch', (req, res) => { //[TODO] add isAuthenticated later
    scoreController.searchByCourse(req, res);
})

app.get('/courseSearch/:id', (req, res) => {
    scoreController.searchByCourse(req, res);
})

app.get('/facultySearch/', (req, res) => {
    scoreController.searchByUser(req, res);
})

app.get('/facultySearch/:id', (req, res) => {
    scoreController.searchByUser(req, res);
})

//download function for getting scores database
app.get('/download', (req, res) => {
    res.download('scores.sqlite');
})

app.get('/addFunc', (req, res) => {
    scoreController.additionalFunctions(req, res);
})

app.get('/rankkey', (req, res) => {
    scoreController.rankingKeyForm(req, res);
})

app.post('/rankkey', (req, res) => {
    scoreController.updateRankingKey(req, res);
})

app.get('/deskey', (req, res) => {
    scoreController.desireKeyForm(req, res);
})

app.post('/deskey', (req, res) => {
    scoreController.updateDesireKey(req, res);
})

/////////////////////////////////////////
//faculty/users redirects
/////////////////////////////////////////
app.get('/faculty/:id', (req, res) => { //add isAuthenticated later
    //when a faculty user logs in, use the userController to send them to the faculty view, which should match the user's responses with their ID using mongoDB
    scoreController.faculty(req, res,);
})

//get list of users
app.get('/users', (req, res) => {
    userController.index(req, res);
})

//create a new user
app.post('/users', (req, res) => {
    userController.create(req, res);
})

app.get('/users/new', (req, res) =>{
    //display form for creating a new user 
    userController.newUser(req, res);
})

//update an existing user
app.post('/users/:id', (req, res) => {
    userController.update(req, res);
})

app.get('/users/:id', (req, res) => {
    userController.index(req, res);
})

app.get('/users/:id/edit', (req, res) => {
    userController.edit(req, res);
})

//delete a user
app.get('/users/:id/delete', (req, res) => {
    userController.delete(req, res);
})

//////////////////////////////////////////
//courses redirects
//////////////////////////////////////////

//get list of courses
app.get('/courses', (req, res) => {
    courseController.index(req, res);
})

app.post('/courses', (req, res) => {
    //create new course on post request for /courses
    courseController.create(req, res);
})

app.get('/courses/new', (req, res) =>{ 
    //display form for creating a new course 
    courseController.newCourse(req, res);
})

app.get('/courses/:id', (req, res) => {
    courseController.index(req, res);
})

app.post('/courses/:id', (req, res) => {
    courseController.update(req, res);
})

app.get('/courses/:id/edit', (req, res) => {
    //display form for updating a course 
    courseController.edit(req, res);
})

app.get('/courses/:id/delete', (req, res) => {
    //display form for updating a course 
    courseController.delete(req, res);
})

//////////////////////////////////////////
//scores redirects
//////////////////////////////////////////

app.post('/scores', (req, res) =>{ 
    //display form for creating a new score 
    scoreController.create(req, res);
})

app.post('/scores/:id', (req, res) => {
    //display a form with current info for updating a scores
    scoreController.update(req, res);
})

//////////////////////////////////////////
//error redirects
//////////////////////////////////////////

app.get('/404', (req, res) => {
    userController.error404(req, res);
});

app.get('/401', (req, res) => {
    userController.error401(req, res);
});

// error handling redirects
app.use((req, res, next) => {
    res.status(404).render('404error', {
      pageTitle: 'Page Not Found'
    });
});

app.use((req, res, next) => {
    res.status(401).render('401error', {
      pageTitle: 'Page Not Found'
    });
});

/////////////////////
//launch the server//
/////////////////////
app.listen(port, () => console.log(`Example listening on port ${port}`));
