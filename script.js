"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
const expelledStudents = [];

let halfbloodFamilies = [];
let purebloodFamilies = [];

let systemHacked = false;

const Student = {
  house: "",
  firstName: "",
  middleName: "",
  nickName: "",
  img: "",
  popupHouse: "",
  bloodstatus: "",
  expelled: false,
  id: "",
  prefect: false,
  inquisitorialSquad: false,
};

function start() {
  document.querySelector("#the_popup").classList.add("hidden");

  document.querySelector(".name").textContent = "Name: ";
  document.querySelector(".house").textContent = "House: ";
  document.querySelector(".blood").textContent = "Blood-Status: ";

  document.querySelector("#search").addEventListener("input", searchImput);
  document.querySelector("#hack").addEventListener("click", hackIt);

  getFamilies();
  loadJSON();
  makeButtons();
}

function hackIt() {
  console.log("Welcome");
  systemHacked = true;

  const me = Object.create(Student);

  me.firstName = "Emily";
  me.nickName = " Cutiepie";
  me.lastName = "Hoolahan";
  me.house = "H";
  me.popupHouse = "Hufflepuff";

  me.id = allStudents.length;
  allStudents.push(me);

  displayList(allStudents);
}

function searchImput(evt) {
  displayList(
    allStudents.filter((student) => {
      return (
        student.firstName
          .toUpperCase()
          .includes(evt.target.value.toUpperCase()) ||
        student.lastName.toUpperCase().includes(evt.target.value.toUpperCase())
      );
    })
  );
}

function makeButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}

function loadJSON() {
  fetch("students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function getFamilies() {
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((data) => prepareFamilies(data));
}

function prepareFamilies(familyData) {
  halfbloodFamilies = familyData.half;
  halfbloodFamilies.forEach((elm) => {
    const indexOfFamily = familyData.pure.indexOf(elm);
    familyData.pure.splice(indexOfFamily, 1);
  });
  purebloodFamilies = familyData.pure;
}

function prepareObjects(jsonData) {
  let idIterator = 0;
  jsonData.forEach((jsonObject) => {
    //crate new opject
    const student = Object.create(Student);

    //exstrackt data from json objekt
    const fullname = jsonObject.fullname.trim().replace("-", " ");

    //house
    const getHouse = jsonObject.house.trim();
    const house = getHouse[0].toUpperCase();
    student.house = house;
    const popupHouse =
      getHouse[0].toUpperCase() + getHouse.slice(1).toLocaleLowerCase();
    student.popupHouse = popupHouse;

    student.id = idIterator;
    idIterator++;

    //first name

    const firstSpace = fullname.indexOf(" ");

    const firstName =
      fullname[0].toUpperCase() +
      fullname.slice(1).toLowerCase().substring(0, firstSpace);
    if (fullname.indexOf(" ") >= 0) {
      student.firstName = firstName;
    }

    //middle and nick name
    const middleName = fullname.substring(
      fullname.indexOf(" ") + 1,
      fullname.lastIndexOf(" ")
    );
    if (middleName.includes('"')) {
      student.nickName = fullname.substring(
        fullname.indexOf(" ") + 1,
        fullname.lastIndexOf(" ")
      );
    } else if (middleName.length > 0) {
      student.middleName =
        middleName[0].toUpperCase() + middleName.slice(1).toLowerCase();
      //student.middleName = getmiddleName;
    }

    //last name
    const lastSpace = fullname.lastIndexOf(" ");
    const getlastName = fullname.substring(lastSpace + 1);
    const lastName =
      getlastName[0].toUpperCase() + getlastName.slice(1).toLocaleLowerCase();
    student.lastName = lastName;

    //img
    const img =
      "img/" +
      lastName.toLocaleLowerCase().replace(" ", "") +
      "_" +
      firstName[0].toLowerCase() +
      ".png";

    student.img = img;

    //add the objekt to the global array
    allStudents.push(student);
  });

  displayList(allStudents);
}

function selectFilter(event) {
  const filter = event.target.dataset.field;
  filterList(filter);
}

function filterList(filterBy) {
  let filteredList = allStudents;

  if (filterBy === "G") {
    filteredList = allStudents.filter(isG);
  } else if (filterBy === "H") {
    filteredList = allStudents.filter(isH);
  } else if (filterBy === "R") {
    filteredList = allStudents.filter(isR);
  } else if (filterBy === "S") {
    filteredList = allStudents.filter(isS);
  } else if (filterBy === "P") {
    filteredList = allStudents.filter(isP);
  }  else if (filterBy === "I") {
    filteredList = allStudents.filter(isI);
  } else if (filterBy === "E") {
    filteredList = expelledStudents.filter(isE);
  }

  displayList(filteredList);
}

function isG(student) {
  return student.house === "G";
}

function isH(student) {
  return student.house === "H";
}

function isR(student) {
  return student.house === "R";
}

function isS(student) {
  return student.house === "S";
}

function isP(student) {
  return student.prefect === true;
}

function isI(student) {
  return student.inquisitorialSquad === true;
}

function isE(student) {
  return student.expelled === true;
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //toggle direction

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  sortList(sortBy, sortDir);
}

function sortList(sortBy, sortDir) {
  let sortedList = allStudents;
  let direction = 1;

  if (sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByChoice);

  function sortByChoice(studentA, studentB) {
    if (studentA[sortBy] < studentB[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  displayList(sortedList);
}

function displayList(studenstToDisplay) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  studenstToDisplay.forEach(displayStudents);

  console.log(expelledStudents);
}

function displayStudents(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  //set clone data
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=lastName]").addEventListener("click", () => {
    popUp(student);
  });
  clone
    .querySelector("[data-field=firstName]")
    .addEventListener("click", () => {
      popUp(student);
    });
  clone.querySelector("[data-field=house]").addEventListener("click", () => {
    popUp(student);
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);

  showNumberOfStudents();
}

function popUp(student) {
  //show pop up
  document.querySelector("#the_popup").classList.remove("hidden");

  //X marks the spot -expelled 
  if (student.expelled === true) {
    document.querySelector(".expelled_box").textContent = "X";
  } else {
    document.querySelector(".expelled_box").textContent = "";
  }
  
  //X marks the spot - prefects 
  if (student.prefect === true) {
    document.querySelector(".prefect_box").textContent = "X";
  } else {
    document.querySelector(".prefect_box").textContent = "";
  }

   //X marks the spot - prefects 
   if (student.inquisitorialSquad === true) {
    document.querySelector(".inquistorial_box").textContent = "X";
  } else {
    document.querySelector(".inquistorial_box").textContent = "";
  }

  // create deatils - full name
  document.querySelector(".name").textContent +=
    student.firstName +
    student.middleName +
    student.nickName +
    " " +
    student.lastName;

  // create deatils - house
  document.querySelector(".house").textContent += student.popupHouse;

  // create deatils - blood
  if (purebloodFamilies.includes(student.lastName)) {
    student.bloodstatus = "Pureblood";
  } else if (halfbloodFamilies.includes(student.lastName)) {
    student.bloodstatus = "Halfblood";
  } else {
    student.bloodstatus = "Muggle";
  }

  //HACK
  if (systemHacked === true) {
    student.bloodstatus = hackedBlood();
  }

  //display blood status
  document.querySelector(".blood").textContent += student.bloodstatus;

  // insert check box tekst
  document.querySelector(".prefect").textContent = "Prefect";
  document.querySelector(".inquistorial").textContent = "Inquisitorial Squad";
  document.querySelector(".expelled").textContent = "Expelled";

  // create deatils - image
  if (student.firstName === "Padma ") {
    student.img = "img/patil_padma.png";
  } else if (student.firstName === "Parvati ") {
    student.img = "img/patil_parvati.png";
  } else if (student.lastName === "Leanne") {
    student.img = "img/jones_m.png";
  }

  document.querySelector("img").src = student.img;

  //Theme by house
  banner();
  function banner() {
    if (student.popupHouse === "Slytherin") {
      document.querySelector("#house_stripe_container").style.backgroundColor =
        "rgb(0, 75, 35)";
      document.querySelector("#house_stripe_sprite").style.backgroundColor =
        "rgb(223, 224, 224)";
    } else if (student.popupHouse === "Ravenclaw") {
      document.querySelector("#house_stripe_container").style.backgroundColor =
        "rgb(2, 21, 104)";
      document.querySelector("#house_stripe_sprite").style.backgroundColor =
        "rgb(223, 224, 224)";
    } else if (student.popupHouse === "Hufflepuff") {
      document.querySelector("#house_stripe_container").style.backgroundColor =
        "rgb(221, 180, 0)";
      document.querySelector("#house_stripe_sprite").style.backgroundColor =
        "black";
    } else {
      document.querySelector("#house_stripe_container").style.backgroundColor =
        "rgb(121, 0, 0)";
      document.querySelector("#house_stripe_sprite").style.backgroundColor =
        "rgb(221, 180, 0)";
    }
  }

  // close popup
  document.querySelector(".x").addEventListener("click", closeX);
  
  function closeX() {
    document.querySelector(".x").removeEventListener("click", closeX);

    document.querySelector("#the_popup").classList.add("hidden");

    document.querySelector(".name").textContent = "Name: ";
    document.querySelector(".house").textContent = "House: ";
    document.querySelector(".blood").textContent = "Blood-Status: ";

    document.querySelector(".expelled_box").textContent = "";
    document.querySelector(".prefect_box").textContent = "";
    document.querySelector(".inquistorial_box").textContent = "";

    document.querySelector(".prefect_box").removeEventListener("click", clickPrefeckt);
    document.querySelector(".inquistorial_box").removeEventListener("click", clickInquistorialBox);

    displayList(allStudents);
  };

  //expelStudent - hack it

  if (student.firstName === "Emily") {
    console.log("lol nope");
  } else {
    document
      .querySelector(".expelled_box")
      .addEventListener("click", expelStudent);
  }

  function expelStudent() {
    document.querySelector(".expelled_box").removeEventListener("click", expelStudent);

    expelledStudents.push(
      allStudents.splice(
        allStudents.findIndex((someStudent) => {
          return someStudent.id === student.id;
        }),
        1
      )[0]
    );
    student.expelled = true;
    this.textContent = "X";
  }

  // make student prefeckt
  document
    .querySelector(".prefect_box")
    .addEventListener("click", clickPrefeckt);

  function clickPrefeckt() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeStudentPrefeckt(student);
    }

    displayList(allStudents);
  }

  //Make student inquistorial
  document
    .querySelector(".inquistorial_box")
    .addEventListener("click", clickInquistorialBox);

  function clickInquistorialBox() {
    if (systemHacked === true) {
      hackedI();
    } else if (student.house === "S" || student.bloodstatus === "Pureblood") {
      makeinquisitorialSquad(student);
    } else if (student.inquisitorialSquad === true) {
      student.inquisitorialSquad = false;
    } else {
      sorry();
    }
  }
}

function tryToMakeStudentPrefeckt(selectedStudent) {
  //mkae variables

  const prefeckts = allStudents.filter((student) => student.prefect);
  //const numberOfPrefeckts = prefeckts.length;
  const other = prefeckts.filter(
    (student) => student.house === selectedStudent.house
  );

  //if there is allready 2 prefeckts in the same house
  if (other.length >= 2) {
    console.log("there can be only two pr. house");
    removeAorB(prefeckts[0], prefeckts[1]);
  } else {
    makePrefeckt(selectedStudent);
  }

  function removeAorB(prefecktsA, prefecktsB) {
    //ask the user to ignore or remove A or B
    document.querySelector("#warning_container").classList.remove("hidden");
    document
      .querySelector("#warning_container")
      .addEventListener("click", closeDialog);
    document.querySelector("#remove_A").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_B").addEventListener("click", clickRemoveB);

    console.log(prefecktsA.firstName);
    console.log(prefecktsB.firstName);
    //show names on buttons
    document.querySelector("#warning_container #remove_A span").textContent =
      prefecktsA.firstName + prefecktsB.lastName;
    document.querySelector("#warning_container #remove_B span").textContent =
      prefecktsB.firstName + prefecktsB.lastName;

    //if user ignor - do nothing
    function closeDialog() {
      document.querySelector("#warning_container").classList.add("hidden");
      document
        .querySelector("#warning_container")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_A")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_B")
        .removeEventListener("click", clickRemoveB);
    }

    //if remove A
    function clickRemoveA() {
      removePrefeckt(prefecktsA);
      makePrefeckt(prefecktsA);
      closeDialog();
    }

    //if remove B
    function clickRemoveB() {
      removePrefeckt(prefecktsB);
      makePrefeckt(prefecktsB);
      closeDialog();
    }
  }

  function removePrefeckt(prefeckt) {
    prefeckt.prefeckt = false;
  }

  function makePrefeckt(student) {
    student.prefect = true;
    document.querySelector(".prefect_box").textContent = "X";
  }
}

function makeinquisitorialSquad(student) {
  console.log("You are good enough");
  student.inquisitorialSquad = true;
  document.querySelector(".inquistorial_box").textContent = "X";
}

function sorry() {
  console.log("You are not good enought!!");
  document.querySelector(".inquistorial_box").textContent = "";
}

function hackedBlood() {
  let randBlood = Math.round(Math.random() * 2);

  if (randBlood === 0) {
    return "Pureblood";
  } else if (randBlood === 1) {
    return "Muggle";
  } else {
    return "Halfblood";
  }
}

function hackedI() {
  student.inquisitorialSquad = true;
  document.querySelector(".inquistorial_box").textContent = "X";
  setTimeout(sorry, 5000);
}

function showNumberOfStudents() {
  const Gstutents = allStudents.filter(
    (student) => student.house === "G"
  ).length;

  document.querySelector("#Gs").textContent = Gstutents;

  const Hstutents = allStudents.filter(
    (student) => student.house === "H"
  ).length;

  document.querySelector("#Hs").textContent = Hstutents;

  const Rstutents = allStudents.filter(
    (student) => student.house === "R"
  ).length;

  document.querySelector("#Rs").textContent = Rstutents;

  const Sstutents = allStudents.filter(
    (student) => student.house === "S"
  ).length;

  document.querySelector("#Ss").textContent = Sstutents;

  document.querySelector("#allS").textContent = allStudents.length;
}
