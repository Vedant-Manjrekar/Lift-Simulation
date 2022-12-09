const inp_dialogue = document.getElementById("inp_dialogue");
const generate_btn = document.getElementById("generate_btn");
const floors_inp = document.getElementById("floors_inp");
const lift_inp = document.getElementById("lift_inp");
const main = document.getElementById("main");
const lift_box = document.getElementById("lift_boxs");
const lift_box2 = document.getElementById("lift_boxs");
const steel_wall = document.getElementById("steel_wall");
const floor_ = document.getElementById("floor_body");
const door = document.getElementById("door");

// // Lift's state.
let state = {};

// // state for floors.
let floor_state = {};

// // number which will forever be larger than the relative distances between lifts and floors.
let biggest_diff;

console.log(state);

// // array which contains the difference between each lifts and floors.
let relative_diff_array = [];

// // array which has the difference of lifts and floor which are vacant.
let vacant_lift_array = [];

// // function to manage lifts state (which lift to call, if there are vacant lifts available.)
function manage_lifts(state_of_lifts, floor_to_go) {
  biggest_diff = Math.max(...relative_diff_array) + 1000;

  // * iterating the state of lifts, subtracting the input from up() function and storing it into an array.
  Object.keys(state_of_lifts).forEach((i, index) => {
    // * if the state of closest lift to the floor is available true (meaning lift is free)
    if (state_of_lifts[i].available === true) {
      // * replace the value in the "relative_diff_array" array which matches index of current lift state's index, with the difference between floor and lift.
      // ? reason being it must be having value of '0' or "100" depending whether its called first time or already called.
      relative_diff_array.splice(
        index,
        1,
        Math.abs(state_of_lifts[i].value - floor_to_go)
      );
    } else {
      // * replace the value in the "relative_diff_array" array which matches index of current lift state's index, with 100.
      // ? reason being, we call the lift based on who is nearest (smallest number difference) and if this lift becomes nearest while its doors are still opening and closing we dont want it to be called, hence a 100 for sake of a larger number.
      relative_diff_array.splice(index, 1, biggest_diff);
    }
  });
}

// // function to check if there are vacant lifts available.
function is_vacant() {
  // * Figuring out whether all lifts are booked or not, by seeing if the "relative_diff_array" has all "biggest_diff" in it or not.
  vacant_lift_array = relative_diff_array.filter(
    (elem) => elem != biggest_diff
  );

  // * if "vacant_lift_array" has all "biggest_diff" in it, return 1.
  if (vacant_lift_array.length === 0) {
    return 1;
  }
}

// // UP Function.
function up(index_val) {
  // * button glows when clicked
  document.getElementById(`floor_btn_up_${index_val}`).style.filter =
    "invert(12%) sepia(98%) saturate(5264%) hue-rotate(5deg) brightness(114%) contrast(125%)";

  // * making "needed" false, since up() is called means lift is on its way and the need is going to be satisfied.
  floor_state[`floor_${index_val}`].needed = false;
  floor_state[`floor_${index_val}`].direction = "";

  // * size of the div with all the floors.
  const screen_size = main.offsetHeight;

  // * function to mange lift's state.
  manage_lifts(state, index_val);

  // * calls the "isVacant" function, aswell as checks for the condition.
  if (is_vacant() === 1) {
    floor_state[`floor_${index_val}`] = {
      needed: true,
      value: index_val,
      direction: "up",
    };

    return;
  }

  // * smallest relative distance of lifts from floor
  const smallest_difference = Math.min(...relative_diff_array);

  // * first found index value, of the smallest difference in the array
  const closest = relative_diff_array.indexOf(smallest_difference);

  // * how long should the moving time of lift be so that, it will take 2s to reach each floor.
  const timeout = smallest_difference * 2;

  // * modifying the lift's state with the lift with smallest difference btween itself and floor.
  state[`lift_${closest}`].value = index_val;

  // * setting lift's state to be unavailable (temporarily).
  state[`lift_${closest}`].available = false;

  // // * how much to move.
  const move = screen_size / Number(floors_inp.value);

  // * how much to move according to the lift button pressed.
  const how_much_move = `${move * (index_val - 1)}`;

  // * function determining after how long should the lift doors open.
  setTimeout(() => {
    document.getElementById(`lift_${closest}`).children[0].style.width = "35%";
    document.getElementById(`lift_${closest}`).children[1].style.width = "35%";

    // * removing the glow-up from the button.
    document
      .getElementById(`floor_btn_up_${index_val}`)
      .style.removeProperty("filter");
  }, timeout * 1000);

  // * function determining after how long should the lift doors close.
  setTimeout(() => {
    // * closing doors.
    document.getElementById(`lift_${closest}`).children[1].style.width = "0%";
    document.getElementById(`lift_${closest}`).children[0].style.width = "0%";

    // * changing the state of the lift to available as the doors are succesfully closed
    state[`lift_${closest}`].available = true;

    // * checking if a lifts is called on any floor.
    Object.keys(floor_state).forEach((i) => {
      if (floor_state[i].needed == true && floor_state[i].direction == "up") {
        up(floor_state[i].value);
      } else if (
        floor_state[i].needed == true &&
        floor_state[i].direction == "down"
      ) {
        down(floor_state[i].value);
      }
      return;
    });
  }, timeout * 1000 + 3500);

  // * code responsible for moving the nearest lift.
  document.getElementById(`lift_${closest}`).style.top = `-${how_much_move}px`;

  // * code which sets the speed of lift.
  document.getElementById(
    `lift_${closest}`
  ).style.transition = `all ${timeout}s linear`;
}

// // DOWN Function.
function down(index_val) {
  document.getElementById(`floor_btn_down_${index_val}`).style.filter =
    "invert(12%) sepia(98%) saturate(5264%) hue-rotate(5deg) brightness(114%) contrast(125%)";

  floor_state[`floor_${index_val}`].needed = false;
  floor_state[`floor_${index_val}`].direction = "";

  // * size of the div with all the floors.
  const screen_size = main.offsetHeight;

  manage_lifts(state, index_val);

  // console.log("Values after removing input", relative_diff_array);

  if (is_vacant() === 1) {
    floor_state[`floor_${index_val}`] = {
      needed: true,
      value: index_val,
      direction: "down",
    };

    return;
  }

  // * smallest relative distance of lifts from floor
  const smallest_difference = Math.min(...relative_diff_array);

  // * first found index value, of the smallest difference in the array
  const closest = relative_diff_array.indexOf(smallest_difference);

  // * modifying the lift's state with the lift with smallest difference btween itself and floor.
  state[`lift_${closest}`].value = index_val;

  // * how much to move.
  const move = screen_size / Number(floors_inp.value);

  // * how much to move according to the lift button pressed.
  const how_much_move = `${move * (index_val - 1)}`;

  const timeout = smallest_difference * 2;
  console.log(timeout);

  // * modifying the lift's state with the lift with smallest difference btween itself and floor.
  state[`lift_${closest}`].value = index_val;

  state[`lift_${closest}`].available = false;

  // * function determining after how long should the lift doors open.
  setTimeout(() => {
    document.getElementById(`lift_${closest}`).children[0].style.width = "35%";
    document.getElementById(`lift_${closest}`).children[1].style.width = "35%";

    document
      .getElementById(`floor_btn_down_${index_val}`)
      .style.removeProperty("filter");
  }, timeout * 1000);

  // * function determining after how long should the lift doors close.
  setTimeout(() => {
    document.getElementById(`lift_${closest}`).children[0].style.width = "0%";
    document.getElementById(`lift_${closest}`).children[1].style.width = "0%";

    state[`lift_${closest}`].available = true;
    // console.log("Values after removing input", relative_diff_array);

    Object.keys(floor_state).forEach((i) => {
      if (floor_state[i].needed == true && floor_state[i].direction == "down") {
        down(floor_state[i].value);
      } else if (
        floor_state[i].needed == true &&
        floor_state[i].direction == "up"
      ) {
        up(floor_state[i].value);
      }
      return;
    });
  }, timeout * 1000 + 3500);

  // * code which sets the speed of lift.
  document.getElementById(
    `lift_${closest}`
  ).style.transition = `${timeout}s linear`;

  // * code responsible for moving the nearest lift.
  document.getElementById(`lift_${closest}`).style.top = `-${how_much_move}px`;
}

// * creating observer instance to track change of height of main.
const resizeObserver = new ResizeObserver((entry) => {
  // // * setting height of div which contains all the lifts.
  lift_box.style.height = `${Math.round(entry[0].contentRect.height)}px`;

  // // * setting width of div which contains all the lifts.
  lift_box.style.width = `${entry[0].contentRect.width}px`;
});

resizeObserver.observe(main);

// // Event listener for "Generate" button
generate_btn.addEventListener("click", generate);

function generate() {
  // * Fetching no. of floors from user.
  const floor_value = floors_inp.value;
  const lift_value = lift_inp.value;

  // * Initialising all the lifts in lift state as 1.
  for (let index = 0; index < lift_value; index++) {
    state[`lift_${index}`] = { value: 1, available: true };
    relative_diff_array.push(0);
  }

  // * removing input dialogue box once user enters floor and lift values.
  if (floors_inp.value && lift_inp.value != "") {
    inp_dialogue.style.display = "none";
  } else {
    inp_dialogue.style.display = "grid";
  }

  let new_floors = "";
  let new_lifts = "";

  // * generating floor's state.
  for (let index = 1; index <= floor_value; index++) {
    floor_state[`floor_${index}`] = {
      needed: false,
      value: Number(index),
      direction: "",
    };
  }

  // * dynamically generating floors based on user input
  for (let index = floor_value; index > 0; index--) {
    // * code for floor.
    let floor = `
    
    <div class="floor_body" id="floor_body_${index}">
    
    <div class="btns">
    
    <button 
    id="floor_btn_down_${index}" 
    class="buttonDown"
    onclick="down(${index})">
    </button>
    
    <button 
    id="floor_btn_up_${index}" 
    class="buttonUp" 
    onclick="up(${index})">
    </button>
    
    </div>
    
    <div class="floor floor-${index}" id="floor_${index}"> <p class="floor_number">Floor ${index}</p> </div>
    
    </div>
    
    `;
    new_floors = new_floors + floor;
  }

  // * dynamically generating lifts based on user input
  for (let index = 0; index < lift_value; index++) {
    // * code for lift.
    let lift = `<div class="lift" id="lift_${index}">
      <div id="door" class="door door1"></div>
      <div id="door" class="door door2"></div>
    </div>`;

    new_lifts = new_lifts + lift;
  }

  // * adding all the lifts to lift div.
  lift_box.innerHTML = new_lifts;

  // * adds floors to the display.
  main.innerHTML += new_floors;

  // * grabbing first floor's down btn by its id.
  const last_floor_up_btn = document.getElementById(
    `floor_btn_up_${floor_value}`
  );

  // * grabbing last floor's up btn by its id.
  const first_floor_down_btn = document.getElementById("floor_btn_down_1");

  // * removing down button for first floor.
  first_floor_down_btn.style.display = "none";

  // * removing up button for last floor.
  last_floor_up_btn.style.display = "none";

  // * targeting "main" div which rendered initially.
  const old_lift_box = document.getElementById("main").children[1];

  // * replaces old lift_box with the new one (lift box with updated styles), as the new one does not rendering in the DOM.
  main.replaceChild(lift_box, old_lift_box);
}
