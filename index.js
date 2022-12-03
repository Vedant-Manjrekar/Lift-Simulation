const inp_dialogue = document.getElementById("inp_dialogue");
const generate_btn = document.getElementById("generate_btn");
const floors_inp = document.getElementById("floors_inp");
const lift_inp = document.getElementById("lift_inp");
const main = document.getElementById("main");
const lift_box = document.getElementById("lift_boxs");
const lift_box2 = document.getElementById("lift_boxs");
const steel_wall = document.getElementById("steel_wall");
const floor_ = document.getElementById("floor_body");

// * Lift's state.
let state = {};

console.log(state);

function up(index_val) {
  console.log("up", index_val);

  // * size of the div with all the floors.
  const screen_size = main.offsetHeight;

  const new_array = [];

  // * iterating the state of lifts, subtracting the input from up() function and storing it into an array.
  Object.keys(state).forEach((i) => {
    new_array.push(Math.abs(state[i] - index_val));
  });

  console.log("Values after removing input", new_array);

  // * first found index value, of the smallest difference in the array
  const closest = new_array.indexOf(Math.min(...new_array));

  // * modifying the lift's state with the lift with smallest difference btween itself and floor.
  state[`lift_${closest}`] = index_val;

  console.log(state);

  // // * how much to move.
  const move = screen_size / Number(floors_inp.value);

  const how_much_move = `${move * (index_val - 1)}`;

  document.getElementById(`lift_${closest}`).style.top = `-${how_much_move}px`;
}

// ! passing number in function as args and based on the number move lift.

function down(index) {
  console.log("click");

  console.log("down", index);

  // * size of the div with all the floors.
  const screen_size = main.offsetHeight;

  const new_array = [];

  // * iterating the state of lifts, subtracting the input from up() function and storing it into an array.
  Object.keys(state).forEach((i) => {
    new_array.push(Math.abs(state[i] - index));
  });

  console.log("Values after removing input", new_array);

  // * first found index value, of the smallest difference in the array
  const closest = new_array.indexOf(Math.min(...new_array));

  // * modifying the lift's state with the lift with smallest difference btween itself and floor.
  state[`lift_${closest}`] = index;
  console.log(state);

  // * how much to move.
  const move = screen_size / Number(floors_inp.value);

  // * how much to move according to the lift button pressed.
  const how_much_move = `${move * (index - 1)}`;

  // * appying css to the lift which is closest to the floor user clicked for.
  document.getElementById(`lift_${closest}`).style.top = `-${how_much_move}px`;

  console.log(move);
}

// * Event listener for generate button
generate_btn.addEventListener("click", () => {
  // * Fetching no. of floors from user.
  const floor_value = floors_inp.value;
  const lift_value = lift_inp.value;

  // * Initialising all the lifts in lift state as 1.
  for (let index = 0; index < lift_value; index++) {
    state[`lift_${index}`] = 1;
  }

  console.log(state);

  console.log(lift_value);

  // * removing input dialogue box once user enters floor and lift values.
  if (floors_inp.value && lift_inp.value != "") {
    inp_dialogue.style.display = "none";
  } else {
    inp_dialogue.style.display = "grid";
  }

  let new_floors = "";
  let new_lifts = "";

  for (let index = floor_value; index > 0; index--) {
    // * code for floor.
    let floor = `

                <div class="floor_body" id="floor_body_${index}">

                  <div class="btns">

                  <button 
                  id="floor_btn_up_${index}" 
                  class="buttonUp" 
                  onclick="up(${index})">

                  </button>

                  <button 
                  id="floor_btn_down_${index}" 
                  class="buttonDown"
                  onclick="down(${index})">

                  </button>
                  </div>

                  <div class="floor floor-${index}" id="floor_${index}"> <p class="floor_number">Floor ${index}</p> </div>
                
                </div>

            `;
    new_floors = new_floors + floor;
  }

  for (let index = 0; index < lift_value; index++) {
    // * code for lift.
    let lift = `<div class="lift" id="lift_${index}"></div>`;

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

  console.log(main);
  console.log(lift_box);
  console.log(`${main.offsetHeight}px`);

  lift_box.style.width = `${main.offsetWidth}px`;

  lift_box.style.height = `${main.offsetHeight - 5}px`;

  const old_lift_box = document.getElementById("main").children[1];

  // * replaces old lift_box with the new one (lift box with updated styles), as the new one does not rendering in the DOM.
  main.replaceChild(lift_box, old_lift_box);

  steel_wall.width = floor_.offsetWidth;
});

console.log(lift_box.innerHTML != null);
