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
};

function start() {
  document.querySelector("#the_popup").classList.add("hidden");

  document.querySelector(".name").textContent = "Name: ";
  document.querySelector(".house").textContent = "House: ";
  document.querySelector(".blood").textContent = "Blood-Status: ";

  document.querySelector("#search").addEventListener("imput", searchImput);

  loadJSON();
  makeButtons();
}

function searchImput() {
  // showStudentList(
  //   allStudents.filter((student) => {
  //     return student.firstName
  //       .toUpperCase()
  //       .includes(student.target.value.toUpperCase());
  //   })
  // );

  //W3 school method

  let input, filter, tbody, tr, th, i, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  tbody = document.getElementById("show_list");
  tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
      th = tr[i].getElementsByTagName("th")[1];
      txtValue = th.textContent || th.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
      } else {
          tr[i].style.display = "none";
      }
  }
    
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

  // clone.querySelector(".expelled_box").addEventListener("click", () => {
  //   expelStudent();
  // });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);

  function popUp(student) {
    document.querySelector("#the_popup").classList.remove("hidden");

    document.querySelector(".name").textContent +=
      student.firstName +
      student.middleName +
      student.nickName +
      " " +
      student.lastName;
    document.querySelector(".house").textContent += student.popupHouse;
    document.querySelector(".blood").textContent += "lala";

    document.querySelector(".prefect").textContent = "Prefect";
    document.querySelector(".inquistorial").textContent = "Inquistorial";
    document.querySelector(".expelled").textContent = "Expelled";

    if (student.firstName === "Padma ") {
      student.img = "img/patil_padma.png";
    } else if (student.firstName === "Parvati ") {
      student.img = "img/patil_parvati.png";
    }

    document.querySelector("img").src = student.img;

    banner();
    function banner() {
      if (student.popupHouse === "Slytherin") {
        document.querySelector(
          "#house_stripe_container"
        ).style.backgroundColor = "rgb(0, 75, 35)";
        document.querySelector("#house_stripe_sprite").style.backgroundColor =
          "rgb(223, 224, 224)";
      } else if (student.popupHouse === "Ravenclaw") {
        document.querySelector(
          "#house_stripe_container"
        ).style.backgroundColor = "rgb(2, 21, 104)";
        document.querySelector("#house_stripe_sprite").style.backgroundColor =
          "rgb(223, 224, 224)";
      } else if (student.popupHouse === "Hufflepuff") {
        document.querySelector(
          "#house_stripe_container"
        ).style.backgroundColor = "rgb(221, 180, 0)";
        document.querySelector("#house_stripe_sprite").style.backgroundColor =
          "black";
      } else {
        document.querySelector(
          "#house_stripe_container"
        ).style.backgroundColor = "rgb(121, 0, 0)";
        document.querySelector("#house_stripe_sprite").style.backgroundColor =
          "rgb(221, 180, 0)";
      }
    }

    document.querySelector(".x").addEventListener("click", (event) => {
      document.querySelector("#the_popup").classList.add("hidden");

      document.querySelector(".name").textContent = "Name: ";
      document.querySelector(".house").textContent = "House: ";
      document.querySelector(".blood").textContent = "Blood-Status: ";

      document.querySelector(".expelled_box").textContent = "";
      displayList(allStudents);
    });

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
  }
}
