"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
const expelledStudents = [];

const Student = {
  house: "",
  firstName: "",
  middleName: "",
  nickName: "",
  img: "",
  popupHouse: "",
  blood: "",
  expelled: "",
  id: "",
  prefect: false,
};

function start() {
  document.querySelector("#the_popup").classList.add("hidden");

  document.querySelector(".name").textContent = "Name: ";
  document.querySelector(".house").textContent = "House: ";
  document.querySelector(".blood").textContent = "Blood-Status: ";

  document.querySelector("#search").addEventListener("input", searchImput);

  loadJSON();
  makeButtons();
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
}

function popUp(student) {
  //show pop up
  document.querySelector("#the_popup").classList.remove("hidden");

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
  document.querySelector(".blood").textContent += "lala";

  // insert check box tekst
  document.querySelector(".prefect").textContent = "Prefect";
  document.querySelector(".inquistorial").textContent = "Inquistorial";
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
  document.querySelector(".x").addEventListener("click", (event) => {
    document.querySelector("#the_popup").classList.add("hidden");

    document.querySelector(".name").textContent = "Name: ";
    document.querySelector(".house").textContent = "House: ";
    document.querySelector(".blood").textContent = "Blood-Status: ";

    document.querySelector(".expelled_box").textContent = "";
    document.querySelector(".prefect_box").textContent = "";

    displayList(allStudents);
  });

  //expelStudent
  document
    .querySelector(".expelled_box")
    .addEventListener("click", expelStudent);

  function expelStudent() {
    document
      .querySelector(".expelled_box")
      .removeEventListener("click", expelStudent);

    expelledStudents.push(
      allStudents.splice(
        allStudents.findIndex((someStudent) => {
          return someStudent.id === student.id;
        }),
        1
      )[0]
    );
    this.textContent = "X";
  }

  // make student prefeckt

  //Prefeckt filter
  // if (student.prefeckts === false) {
  //   document.querySelector("[data-field=P]").dataset.prefect = true;
  // } else {
  //   document.querySelector("[data-field=P]").dataset.prefect = false;
  // }

  document
    .querySelector(".prefect_box")
    .addEventListener("click", clickPrefeckt);

  function clickPrefeckt() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeStudentPrefeckt(student);
    }
  }
}

function tryToMakeStudentPrefeckt(selectedStudent) {
  //mkae variables
  const prefeckts = allStudents.filter((student) => student.prefect);
  const numberOfPrefeckts = prefeckts.length;
  const other = prefeckts.filter(
    (student) => student.house === selectedStudent.house
  );

  //if there is allready 2 prefeckts in the same house
  if (other.length >= 2) {
    removeAorB(prefeckts[0], prefeckts[1]);
  } else {
    makePrefeckt(selectedStudent);
  }

  function removeAorB(prefecktsA, prefecktsB) {
    console.log("lålå");
    //ask the user to ignore or remove A or B
    document.querySelector("#remove_warning").classList.remove("hidden");
    document
      .querySelector("#remove_warning")
      .addEventListener("click", closeDialog);
    document.querySelector("#remove_A").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_B").addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector(
      "#remove_warning [data-field=prefecktA]"
    ).textContent = prefecktsA.name;
    document.querySelector(
      "#remove_warning [data-field=prefecktB]"
    ).textContent = prefecktsB.name;

    //if user ignor - do nothing
    function closeDialog() {
      document.querySelector("remove_warning").classList.add("hidden");
      document
        .querySelector("remove_warning")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("remove_A")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("remove_B")
        .removeEventListener("click", clickRemoveB);
    }

    //if remove A
    function clickRemoveA() {
      removePrefeckt(prefecktsA);
      makePrefeckt(selectedStudent);
      closeDialog();
    }

    //if remove B
    function clickRemoveB() {
      removePrefeckt(prefecktsB);
      makePrefeckt(selectedStudent);
      closeDialog();
    }
  }

  function removePrefeckt(prefeckt) {
    prefeckt.prefect = false;
  }

  function makePrefeckt(student) {
    student.prefect = true;
    document.querySelector(".prefect_box").textContent = "X";
    console.log(student);
  }
}
