class Student {
    #fName;
    #lName;
    #studentID;
    #grade;
    #gender;
    #studentData;

    constructor(fname, lname, id, grade, gender) {
        this.#lName = lname;
        this.#fName = fname;
        this.#studentID = id;
        this.#grade = grade;
        this.#gender = gender;

        this.#studentData = {
            fname: this.#fName,
            lname: this.#lName,
            studentID: this.#studentID,
            grade: this.#grade,
            gender: this.#gender,
        }
    }
    getFullName()
    {
        return this.#fName + " " + this.#lName;
    }
    
    getStudentData() {
        return this.#studentData;
    }

    toString()
    {
        let stringOut = "ID: " + this.#studentID + " " + this.getFullName() + ", "+ this.#grade;
        return stringOut;
    }
}

class Period {
    #roster = [];
    #attendance = [];
    #pushAttendance = [];
    #generatedTable = false;
    #tBodyGen;
    #imported = false;
    #takenAttendance = false;
    
 
    add(classmate) {
       this.#roster.push(classmate)
    }

    getImportedRoster() {
        return this.#imported;
    }
    setImportedRoster(importedRoster) {
        this.#imported = importedRoster;
    }
    // getTakenAttendance() {
    //     return this.#takenAttendance;
    // }
    // setTakenAttendance(takenAttendance) {
    //     this.#takenAttendance = takenAttendance;
    // }

    getRoster() {
        return this.#roster;
    }
    getAttendance() {
        return this.#attendance;
    }
    getStudentByID(id) {
        for (let student of this.#roster) {
            if (!(student instanceof Student)) {return console.log("Attempt to get Student by ID Failed: Not an Instance of Student")}
           if (student.getStudentData().studentID == id) { return student; }
        }
        return console.log("Attempt to get Student By ID Failed: Student Could Not be Found");
    }

    takeAttendance() {
            for (let i = 0; i < this.#roster.length; i++) {
                if (this.#attendance.includes(this.#roster[i])) {continue;}
                const attendedInput = document.getElementById(`student-id-${this.#roster[i].getStudentData().studentID}`);
                if (attendedInput.checked === true) {
                        this.#attendance.push(this.#roster[i]);
                        this.#pushAttendance.push(this.#roster[i]);
            }
        }
        if (this.#generatedTable === true && this.#tBodyGen !== undefined) {
            console.log("Table is already generated");
            this.updateStudentTable(this.#tBodyGen, this.#pushAttendance);
        } else {
            this.#tBodyGen = this.generateStudentTable(studentTableAttendance, this.#pushAttendance, false);
        }
    }
    printAttendance() {
        for (let student of this.#attendance) {
            console.log(student.toString());
        }
    }

    attachTableDataToTableRow(tr, value) {
        const tableData = document.createElement("td");
        const tableDataTextNode = document.createTextNode(value);
        tableData.appendChild(tableDataTextNode);
        tr.appendChild(tableData);
    }

    generateStudentTableRow(student, checkAttendance) {
        const studentTableRow = document.createElement("tr");
        const studentData = student.getStudentData();
        
        this.attachTableDataToTableRow(studentTableRow, studentData.studentID);
        this.attachTableDataToTableRow(studentTableRow, student.getFullName());
        this.attachTableDataToTableRow(studentTableRow, studentData.grade);
    
        if(checkAttendance === true) {
        const studentDataTableAttended = document.createElement("input");
        const studentDataTableAttendedTD = document.createElement("td");
        studentDataTableAttended.setAttribute("type", "checkbox");
        studentDataTableAttended.setAttribute("name", "attended");
        studentDataTableAttended.classList.add("student-table-checkbox");
        studentDataTableAttended.setAttribute("id", `student-id-${studentData.studentID}`);
        studentDataTableAttendedTD.appendChild(studentDataTableAttended);
        studentTableRow.appendChild(studentDataTableAttendedTD);
        }
        studentTableRow.classList.add("base-text", "roster-table-row", "attendance-table-row");
        return studentTableRow;
    }
    generateStudentTable(table, students, checkBoxAttendance) {
        let studentTableTBody = document.createElement("tbody");
        
        for (let student of students) 
        {
            let tableStudent = this.generateStudentTableRow(student, checkBoxAttendance);
            studentTableTBody.appendChild(tableStudent);
        }
        table.appendChild(studentTableTBody);
        this.#generatedTable = true;
        this.#pushAttendance = [];
        return studentTableTBody;
    }

    updateStudentTable(tbody, studentDifference) {
        for (let studentDiff of studentDifference) {
            tbody.appendChild(this.generateStudentTableRow(studentDiff, false));
        }
        this.#pushAttendance = [];
    }

    setStudentAttendance(student, attended) {
        if (student instanceof Student) {
            const studentInputCheckBox = document.getElementById(`student-id-${student.getStudentData().studentID}`);
            studentInputCheckBox.checked = attended;
        }
    }
    importRoster(rosterImportList) {
        for (let studentRosterImport of rosterImportList) {
            classRoster.add(studentRosterImport);
        }
    }
    convertAttendanceToCSV() {
        if (this.#tBodyGen !== undefined) {
            let convertedStringArray2D = [];
            const tBodyTR = this.#tBodyGen.children;

            for (let i = 0; i < tBodyTR.length; i++) {
                convertedStringArray2D.push([]);

                for (let j = 0; j < tBodyTR[i].children.length; j++) {
                    const tBodyTD = tBodyTR[i].children[j];
                    tBodyTD.textContent += ",";
                    convertedStringArray2D[i].push(tBodyTD.textContent);
                    
                }
                convertedStringArray2D[i].push("\n");
            }
            console.log(convertedStringArray2D)
            
            /*const attendanceExportFile = new File(["foo","glue"], "foo.csv", {
               type: "text/csv",
              });
          return attendanceExportFile;*/
        }
    }
}

const importRosterBtn = document.getElementById("import-roster-btn");
const viewRosterBtn = document.getElementById("view-roster-btn");
const takeAttendanceBtn = document.getElementById("take-attendance-btn");
const rosterContainer = document.getElementById("roster-container");
const attendanceContainer = document.getElementById("attendance-container");
const studentTable = document.getElementById("student-table");
const studentTableAttendance = document.getElementById("student-table-attendance");
const enterButtonIDSearch = document.getElementById("enter-btn-id-search");
const idInputIDSearch = document.getElementById("id-input-id-search");
const exportAttendanceBtn = document.getElementById("export-attendance-btn");

let classRoster = new Period();
//example students, not real
let rosterToImport = [new Student("Reid","Christopher",10,9,"M"), 
    new Student("Chapman","Tim",11,10,"M"),
    new Student("Clarkson","Charles",12,11,"M"),
    new Student("Baker","Gabrielle",13,9,"F"),
    new Student("Rampling","Frank",14,10,"M"),
    new Student("Rampling","Maria",15,11,"F"),
    new Student("MacLeod","Bella",16,12,"F"),
    new Student("Henderson","Carol",17,12,"F"),
    new Student("Wallace","Alexander",18,11,"M"),
    new Student("Dyer","Blake",19,10,"M"),
    new Student("Fisher","Stephen",20,9,"M"),
    new Student("Hodges","Sam",21,9,"F"),
    new Student("Terry","Fiona",22,12,"F"),
    new Student("Harris","Kimberly",23,12,"F"),
    new Student("Springer","Boris",24,10,"M"),
    new Student("Terry","Fiona",25,12,"F")]
console.log(classRoster);

let toggle = false;

viewRosterBtn.addEventListener("click", (event) => {
    toggle = !toggle;
    if (toggle) {
        rosterContainer.classList.add("slide-toggle-on");
        rosterContainer.classList.remove("slide-toggle-off");
        
    } else {
        rosterContainer.classList.remove("slide-toggle-on");
        rosterContainer.classList.add("slide-toggle-off");
    }
    
})

importRosterBtn.addEventListener("click", (event) => {
    if(classRoster.getImportedRoster() != true) {
        classRoster.importRoster(rosterToImport);} else {return}
    classRoster.generateStudentTable(studentTable, classRoster.getRoster(), true);
    classRoster.setImportedRoster(true)
})

takeAttendanceBtn.addEventListener("click", (event) => {
    classRoster.takeAttendance();
    classRoster.printAttendance();
    attendanceContainer.classList.add("slide-right-toggle-on");
})

enterButtonIDSearch.addEventListener("click", (event) => {
    if (idInputIDSearch.value === "") {console.log("No ID Given")};
    const idTaken = Number(idInputIDSearch.value);
    const studentSelectedByUser = classRoster.getStudentByID(idTaken);
    idInputIDSearch.value = "";
    classRoster.setStudentAttendance(studentSelectedByUser, true)
    
})

exportAttendanceBtn.addEventListener("click", (event) => {
    classRoster.convertAttendanceToCSV();
})


idInputIDSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (idInputIDSearch.value === "") {console.log("No ID Given")};
        const idTaken = Number(idInputIDSearch.value);
        const studentSelectedByUser = classRoster.getStudentByID(idTaken);
        idInputIDSearch.value = "";
        classRoster.setStudentAttendance(studentSelectedByUser, true)
    }
})