//define score and validate inputs
class Score {


    constructor(description){
        if (description) {
            this.id = description.id;
            this.courseID = description.courseID;
            this.facultyID = description.facultyID;
            this.prepValue = description.prepValue;
            this.prefValue = description.prefValue;
            this.notes = description.notes; 
        }
        
        this.errors = [];
    }

    //[TODO] Add method to adjust upper and lower values
 
    isValid(){
        this.errors = [];
        //if value < upper && value > lower then it's ok, need to add upper and lower as variables
        

        return this.errors.length <= 0;
    }

}

module.exports = Score;