//WARNING: PUTTING THE FIREBASE/MIXPANEL CONFIG CLIENT-SIDE POSES SERIOUS SECURITY ISSUES.
//IT IS ONLY IMPLEMENTED HERE FOR THE PURPOSE OF TESTING THE ERROR-CHECKING AND RENDERING CAPABILITIES OF THE APP.

//---------------- Manage User Signup Form UI ----------------//
//Assumes Firebase DB & Mixpanel config is intialized.
  
  const db = firebase.firestore();
  const dummiesRef = db.collection("dummies");
  
  //mixpanel.init(STUB);
  mixpanel.track("Sign up viewed");
  console.log(mixpanel.distinct_id);

//---------------- Add user to Firebase Authenticate & add user info to Firestore ----------------//  
  
  signUp = () => {
      const tutor = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('fname').value,
        lastName: document.getElementById('lname').value,
        phone: document.getElementById('phone').value,
        school: document.getElementById('school').value,
        year: document.getElementById('year').value,
        major: document.getElementById('major').value,
        housing: document.getElementById('housing').value,
        orgs: document.getElementById('orgs').value,
        favPlace: document.getElementById('favPlace').value,
        bestSocial: document.getElementById('bestSocial').value,
        followers: document.getElementById('followers').value,
        linkHandle: document.getElementById('linkHandle').value,
        references: document.getElementById('references').value,
        howHear: document.getElementById('howHear').value             		
      }
  		const tutorPswd = document.getElementById('password').value;
      firebase.auth().createUserWithEmailAndPassword(tutor.email, tutorPswd)
      .then(() => {
      		firebase.auth().onAuthStateChanged((user) => {
          	dummiesRef.doc(user.uid).set(tutor);
            mp_signup(tutor);
          })
          
					alert("User created successfully!");
      })
      .catch((err) => {
          if(err.code == 'auth/email-already-in-use') {
              alert('That email is already in use.');
          }
          else {
              alert('Uh oh, something went wrong');
              console.log(err);
          }
      })
  }
 
//---------------- Add user to Mixpanel ----------------//
  
  mp_signup = (user) => {
    mixpanel.alias(user.email);
    mixpanel.people.set({
    	"School": user.school,
      "$first_name": user.firstName,
      "$last_name": user.lastName,
      "$name": `${user.firstName} ${user.lastName}`,
      "$phone": user.phone,
      "$email": user.email,
      "Year": user.year,
      "Major": user.major,
      "Organizations": user.orgs,
      "How Heard": user.howHear
    });
  }
  

//---------------- Switches between form sections ----------------//
//User can only continue to successive section if current section is completely filled out.
  
  const sections = [
  	document.getElementById('signup_basic'),
    document.getElementById('signup_about'),
    document.getElementById('signup_social'),
    document.getElementById('signup_almost')
  ];
  
  const switchSection = (curr, to) => {
  	let emptyToggle = false;
  	let inputs = sections[curr].getElementsByClassName('input');
    for (let i=0; i<inputs.length; i++) {
    	if (inputs[i].value.length == 0) { emptyToggle = true }
    }
  	if (to > curr && emptyToggle) {
    	sections[curr].getElementsByClassName('error')[0].style.display = 'block';
    }
    else {
    	if (curr == 3 && to > curr) {
      	signUp();
      }
      else {
       	sections[curr].getElementsByClassName('error')[0].style.display = 'none';
     	 	sections[curr].style.display = 'none';
    		sections[to].style.display = 'block';
      }
    }
  }
  
  let basic_next = document.getElementById('basic_next');
  basic_next.addEventListener("click",() => { switchSection(0,1) });
  let about_prev = document.getElementById('about_prev');
  about_prev.addEventListener("click",() => { switchSection(1,0) });
  let about_next = document.getElementById('about_next');
  about_next.addEventListener("click",() => { switchSection(1,2) });
  let social_prev = document.getElementById('social_prev');
  social_prev.addEventListener("click",() => { switchSection(2,1) });
  let social_next = document.getElementById('social_next');
  social_next.addEventListener("click",() => { switchSection(2,3) });
  let almost_prev = document.getElementById('almost_prev');
  almost_prev.addEventListener("click",() => { switchSection(3,2) });
  let submit = document.getElementById('submit');
  submit.addEventListener("click",() => { switchSection(3,4) });
