const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
    //Enter Firebase Config Here
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

//Following DB refs are for example purposes. Replace with your own as needed.
const usersRef = db.collection("users");
const sessionsRef = db.collection("globalSessions");
const userTestRef = db.collection("userTest");
const schoolsRef = db.collection("schools");
const sungRef = userTestRef.doc("Uc8RTNER37dOdpBzJ2Cl2KzI5263"); //Refers to a specific user: me.


//---------------- Get metadata for each tutoring session booked on DB ----------------// 

getPeopleData = async (studentID, tutorID, schoolCode) => {
    let studentName = undefined;
    let tutorName = undefined;
    let school = undefined;
    await userTestRef.doc(studentID).get().then((doc) => {
        studentName = doc.get('name');
    });
    await userTestRef.doc(tutorID).get().then((doc) => {
        tutorName = doc.get('name');
    })
    if (studentName == undefined) {
        await usersRef.doc(studentID).get().then((doc) => {
            studentName = doc.get('name');
        });
    }
    if (tutorName == undefined) {
        await usersRef.doc(tutorID).get().then((doc) => {
            tutorName = doc.get('name');
        });
    }
    await schoolsRef.doc(schoolCode).get().then((doc) => {
        school = doc.get('title');
    })
    return new Promise((res, rej) => {
        res({student: studentName, tutor: tutorName, school: school})
    });
}

formatDate = (d) => {
    let localDate = new Date(0);
    localDate.setUTCSeconds(d);
    let day = localDate.toLocaleDateString("en-US", {weekday: "short"}); 
    let month = localDate.toLocaleDateString("en-US", {month: "long"});
    let dayInt = localDate.toLocaleDateString("en-US", {day: "numeric"});
    let year = localDate.toLocaleDateString("en-US", {year: "numeric"});
    let suffix = 'th';
    let hour = localDate.getUTCHours();
    let ampm = 'am';
    if (hour > 11) {
        ampm = 'pm';
    }
    if (hour == 0 ) {
        hour = 12;
    }
    else if (hour > 12) {
        hour -= 12;
    }
    else {
        null;
    }
    let minutes = localDate.getUTCMinutes("en-us", {minutes: "long"});
    if (minutes == 0) {
        minutes = '00';
    }
    else if (minutes < 10) {
        minutes = `0${minutes}`
    }
    else {
        null;
    }
    switch(dayInt%10) {
        case 1: if(dayInt != 11) {suffix = 'st'}; break;
        case 2: if(dayInt != 12) {suffix = 'nd'}; break;
        case 3: if(dayInt != 13) {suffix = 'rd'}; break;
        default: suffix = 'th'; break;
    }
    let date = {
        day: day,
        month: month,
        dayInt: dayInt,
        year: year,
        suffix: suffix,
        hour: hour,
        minutes: minutes,
        ampm: ampm
    }
    return date;
}

getSessions = () => {
    sessionsRef.get().then((doc) => {
        doc.forEach((session) => {
            let dateStart = formatDate(session.get('start'));
            let dateEnd = formatDate(session.get('end'));
            getPeopleData(session.get('student'), session.get('tutor'), session.get('school')).then((people) => {
                let sesh = {
                    date: `${dateStart.day}, ${dateStart.month} ${dateStart.dayInt}, ${dateStart.year}`,
                    time: `${dateStart.hour}:${dateStart.minutes} ${dateStart.ampm} - ${dateEnd.hour}:${dateEnd.minutes} ${dateEnd.ampm}`,
                    status: `${session.get('status')}`,
                    school: `${people.school}`,
                    course: `${session.get('course')}`,
                    student: `${people.student}`,
                    tutor: `${people.tutor}`
                }
                console.log(`
                    Session ID: ${session.id}
                    Date: ${sesh.date}
                    Time: ${sesh.time}
                    Status: ${sesh.status}
                    School: ${sesh.school}
                    Course: ${sesh.course}
                    Student: ${sesh.student}
                    Tutor: ${sesh.tutor}
                `);
            })
        })
    })
    .catch((err) => {
        console.log(`Error while pulling sessions: \n${err}`)
    })
}

//---------------- Delete a user ----------------//

userTestRef.doc("drgjfTJwKQ47S3kWZ2NO").delete().then(() => {
    console.log("User deleted!")
})
.catch((err) => {
    console.log(`Error deleting user:\n${err}`)
})

//---------------- Update a user's field(s) ----------------//

sungRef.update({
    isAdmin: true,
    isTutor: true
})
.then(() => {
    console.log("User successfully updated!");
})
.catch((err) => {
    console.error(`Error updating user:\n${err}`);
})

//---------------- Add a new user ----------------//

const sungmin = {
    agreedTOS: true,
    availability: {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0
    },
    bio: "Hello I'm Sung!",
    currentBalance: 0,
    email: "sgan4@horizon.csueastbay.edu",
    isAdmin: true,
    isDarkModeOn: true,
    isEmailOn: false,
    isPushOn: false,
    isSMSOn: false,
    isTutor: true,
    major: "Computer Science",
    maxHPW: 20,
    name: "Sungmin",
    phoneNumber: 4158198709,
    pricePHH: 25,
    profileImage: null,
    pushToken: null,
    school: "csueb"
}

userTestRef.add(sungmin)
.then((userRef) => {
    console.log(`User added with ID ${userRef.id}`);
})
.catch((err) => {
    console.log(`Something went wrong while adding user.\n${err}`)
})

//---------------- Search for users by keywords in reponse field ----------------//

let fiscalWordBank = {'money': 0, 'cash': 0, 'income': 0, 'finance': 0, 'finances': 0, 'earn': 0}; 
let eduWordBank = {'learn': 0, 'learning': 0, 'teach': 0, 'teaching': 0, 'help': 0, 'helping': 0, 'education': 0, 'understand': 0, 'understanding': 0, 'student': 0, 'students': 0};


searchResponse = (response, wordBank) => {
    let trigger = false;
    if (response) {
        response = response.toLowerCase();
        for (word in wordBank) {
            if (response.search(word) > 0){
                wordBank[word]++;
                trigger = true;
            }
        }
    }
    return trigger;
}

searchInCollection = async (collection, field, wordBank) => {
    foundUsers = [];
    await collection.get().then((doc) => {
        let uniqueUsers = 0;
        doc.forEach((user) => {
            let response = user.get(field);
            if(searchResponse(response, wordBank)) {
                uniqueUsers++;
                foundUsers.push({id: user.id, name: `${user.get('firstName')} ${user.get('lastName')}`, response: `${response}`})
            };
        })
        for (word in wordBank) {
            console.log(`${word}: ${wordBank[word]}`);
        }
        console.log(`unique users: ${uniqueUsers}`);
    })
    return new Promise((resolve) => {
        resolve(foundUsers);
    })
}

searchInCollection(usersRef, 'application.assessment.whyTutor', fiscalWordBank).then((result) => {
    console.log(result);
});

//---------------- Display All User ID's and Names ----------------//

usersRef.get().then(function(doc) {
    doc.forEach(function(user) {
        console.log(user.id, user.get("firstName"));
    });
}); 

//----- Find all associated users by time created, format time -----//

getUserByTimeCreated = (timeCreated) => {
    let query = usersRef.where("timeCreated", "==", timeCreated);
  query.get().then((user) => {
      user.forEach((doc) => {
          console.log(doc.id);
      })
      let localDate = new Date(0);
      localDate.setUTCSeconds(timeCreated);
      console.log(makeDatePretty(localDate));
  })
}
