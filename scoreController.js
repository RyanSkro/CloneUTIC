
const scoresDB = require('./scoresDB');
const courseDB = require('./courseDB');
const userDB = require('./userDB');

class ScoreController {
    //search list of scores by user
    async searchByUser(req, res) {
        let id = req.params.id;

        if (!id){ 
            id = 1;
        }

        let scores = await scoresDB.searchByUser(id);
        let users = await userDB.allUsers();

        if (!scores) {
            res.send("Couldn't find a user with ID of " + id);
            //[TODO] redirect to adminFaculty with error message
        } else {
            res.render('admin/adminFaculty', { scores: scores, users: users, facultyID: id });
        }
    }

    async searchByCourse(req, res) {
        let id = req.params.id;
        
        if (!id){ 
            id = "CIS101";
        }

        let scores = await scoresDB.searchByCourse(id);
        let courses = await courseDB.allCourses();

        if (!scores) {
            res.send("Couldn't find a course with ID of " + id);
            //[TODO] redirect to adminCourse with error message
        } else {
            res.render('admin/adminCourse', { scores: scores, courses: courses, courseID: id });
        }
    }

    async faculty(req, res) {
        //let id = req.params.id;

        let courses = await courseDB.allCourses();
        //let user = await userDB.findUser(id);
        //let scores = await scoresDB.scoresForUser(id);
        //if (!user) {
        //    res.send("Couldn't find a user with ID of " + id);
              //[TODO] 404 redirect
        //} else {
            res.render('faculty/faculty', { courses: courses }); //, user: user, scores: scores 
        //}
    }

    newScore(req, res) {
        res.render('score/scoreForm', { score: new Score() });
    }

    async create(req, res) {
        console.log("Creating new score");
        
        let newScore = await scoreDB.create(req.body.score);

        if (newScore.isValid()) {
            res.writeHead(302, { 'Location': `/scores/${ newScore.id }`});
            res.end();
        } else {
            res.render('score/scoreForm', { score: newScore });
        }
    }

    async edit(req, res) {
        let id = req.params.id;
        let score = await scoreDB.findScore(id);

        if (!score) {
            console.log("no score with ID of " + id);
            //[TODO] redirect to scoreForm with error message
        } else {
            res.render('score/scoreForm', { score: score });
        }
    }

    async update(req, res) {
        //update variables for a score
        let id = req.params.id;
        let score = await scoreDB.findScore(id);

        let testScore = new Score(req.body.score);
        if (!testScore.isValid()) {
            testScore.id = score.id;
            res.render('score/scoreForm', { score: testScore });
            return;
        }

        if (!score) {
            res.send("Could not find score with id of " + id);
            //[TODO] redirect to scoreForm with error message
        } else {
            //[TODO] update to be scores variables
            score.scoreID = req.body.score.scoreID;
            score.name = req.body.score.name;

            console.log("Updating score");
            scoreDB.update(score);

            res.writeHead(302, { 'Location': `/scores` });
            res.end();
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let score = await scoreDB.findScore(id);
        

        if (!score) {
            res.send("Couldn't find a score with id " + id);
            //[TODO] redirect to scoreList with error message
        } else {
            scoreDB.remove(score);
            let scores = await scoreDB.allScores();
            res.render('score/scoreList', { scores: scores });
        }
    }

}

module.exports = ScoreController;