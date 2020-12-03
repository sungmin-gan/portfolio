/** This program creates a schedule, Monday through Sunday, 0000 - 2400, 
for tutors to indicate their available time slots. Each unique combination 
of time slots, per day, is represented by a 48-bit binary number (24 hours/day, 
each bit represents a 30-minute time slot), which is converted into an integer 
for state storage. When rendering the state from the database, the integer is 
converted back into binary and the "available" time slots are appropriately
stylized to indicate their state. **/

//Initialize DB, temp references & data stores, event listeners
//Assumes configs are loaded
const db = firebase.firestore();
const userRef = db.collection("dummy_users").doc('O06194XMC4v50mFdOXQK');

const time_slots = [
"12:00 am", "12:30 am", "1:00 am", "1:30 am", "2:00 am", "2:30 am", 
"3:00 am", "3:30 am", "4:00 am", "4:30 am", "5:00 am", "5:30 am",
"6:00 am", "6:30 am", "7:00 am", "7:30 am", "8:00 am", "8:30 am",
"9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am",
"12:00 pm", "12:30 pm", "1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm",
"3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm",
"6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm", "8:00 pm", "8:30 pm",
"9:00 pm", "9:30 pm", "10:00 pm", "10:30 pm", "11:00 pm", "11:30 pm",
]

let changes = {
	sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0,
}

document.getElementById('update_button').addEventListener('click', () => {update_db()});

//Function Declarations
const getOneIndices = (num) => {
	let binary = num.toString(2);
  let indices = [];
  for (let i=binary.length-1; i>-1; i--) {
  	if (binary[i] == '1') {
    	indices.push(binary.length-1-i);
    }
  }
  return indices;
}

const toggleSlot = (slot, day) => {
	if (slot.classList.contains('slot_on')) {
  	slot.classList.remove('slot_on');
    changes[day] -= 2**parseInt(slot.id);
    console.log(changes);
  }
  else {
  	slot.classList.add('slot_on')
    changes[day] += 2**parseInt(slot.id);
    console.log(changes);
    }
}

const update_db = () => {
	for (let i=0; i<7; i++) {
  	let day = Object.keys(changes)[i];
    userRef.get().then((user) => {
      let current_val = user.get(`availability.${day}`);
      let new_val = current_val + changes[day];
      let field = `availability.${day}`;
      userRef.update({
        [field] : new_val
      })
      .then(() => {
      	changes[day] = 0;
        console.log('Update successful!');
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      })
    });
  }
}

//Render the page
let day_blocks = document.getElementsByClassName('day_block');
for (let i=0; i<7; i++) {
	//Render: add title to column
	let title = document.createElement('P');
  title.innerHTML = day_blocks[i].id;
  title.innerHTML[0] = title.innerHTML[0].toUpperCase();
	day_blocks[i].appendChild(title);
  //Render: populate column with time slots
  for (let j=0; j<48; j++) {
  	let slot = document.createElement('P');
    slot.innerHTML = time_slots[j];
    slot.id = j;
    slot.classList.add('time_button');
    slot.addEventListener('click', () => toggleSlot(slot, day_blocks[i].id));
    day_blocks[i].appendChild(slot);
  }
  //Render: change styles for slots that are ON
  userRef.get().then((user) => {
    let slots_on = getOneIndices(user.get(`availability.${day_blocks[i].id}`));
    for (let k=0; k<slots_on.length; k++){
    	let slot = day_blocks[i].children[slots_on[k]+1];
      slot.classList.add('slot_on');
    }
	})
}
