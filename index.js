const inp_dialogue = document.getElementById("inp_dialogue");
const generate_btn = document.getElementById("generate_btn");
const floors_inp = document.getElementById("floors_inp");
const lift_inp = document.getElementById("lift_inp");
const main = document.getElementById("main");
const lift_box = document.getElementById("lift_boxs");
const lift_box2 = document.getElementById("lift_boxs");

let state = {
  // no_of_lifts: 0,
};

console.log(state);

function up(index_val) {
  console.log("up", index_val);

  const screen_size = main.offsetHeight;

  state[`lift_0`] = index_val;

  const closest = Object.keys(state).reduce((prev, current) => {
    return Math.abs(state[current] - index_val) <
      Math.abs(state[prev] - index_val)
      ? current
      : prev;
  }, 0);

  console.log(closest);

  // Object.keys(state).forEach((i) => console.log(`${i}: ${state[i]}`));

  // console.log(state);

  // // * how much to move.
  const move = screen_size / Number(floors_inp.value);

  const how_much_move = `${move * (index_val - 1)}`;

  document.getElementById(closest).style.top = `-${how_much_move}px`;
}

// ! passing number in function as args and based on the number move lift.

function down(index) {
  console.log("click");

  console.log("down", index);

  const screen_size = main.offsetHeight;

  // * how much to move.
  const move = screen_size / Number(floors_inp.value);

  const how_much_move = `${move * (index - 1)}`;

  document.getElementById(
    `lift_${Math.ceil(Math.random() * index)}`
  ).style.top = `-${how_much_move}px`;

  console.log(move);
}

// * Event listener for generate button
generate_btn.addEventListener("click", () => {
  // * Fetching no. of floors from user.
  const floor_value = floors_inp.value;
  const lift_value = lift_inp.value;

  for (let index = 0; index < lift_value; index++) {
    state[`lift_${index}`] = 0;
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
    let minus = index - 1;
    let floor = `
                <div class="floor_body" id="floor_body_${index}">

                  <div class="btns">

                  <button id="floor_btn_up_${index}" class="floor" 
                  onclick="up(${index})">Up</button>

                  <button id="floor_btn_down_${index}" 
                  onclick="down(${index})">Down</button>
                  </div>

                  <div class="floor floor-${index}" id="floor_${index}"> <p class="floor_number">Floor ${index}</p> </div>
                
                </div>
            `;
    new_floors = new_floors + floor;
  }

  for (let index = 0; index < lift_value; index++) {
    let lift = `<div class="lift" id="lift_${index}">lift</div>`;

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
});

console.log(lift_box.innerHTML != null);
