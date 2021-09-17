"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const Student = {
    house: "",
    firstName: "",
    middleName: "",
    nickName: "",
    img: "",
    popupHouse: "",
    blood: ""
}

function start(){
    
    document.querySelector("#the_popup").classList.add("hidden");

    document.querySelector(".img").textContent = "";
    document.querySelector(".name").textContent = "Name: ";
    document.querySelector(".house").textContent = "House: ";
    document.querySelector(".blood").textContent = "Blood-Status: ";

    loadJSON();
    makeButtons();
}

function makeButtons(){
    document.querySelectorAll("[data-action='filter']")
    .forEach(button => button.addEventListener("click", selectFilter));

    document.querySelectorAll("[data-action='sort']")
    .forEach(button => button.addEventListener("click", selectSort));
}

function loadJSON() {
    fetch("students.json")
    .then (response => response.json())
    .then (jsonData => {
        prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
    jsonData.forEach(jsonObject => {
    
    //crate new opject
    const student = Object.create(Student);

    //exstrackt data from json objekt
    const fullname = jsonObject.fullname.trim().replace("-", " ");
    
    //house
    const getHouse = jsonObject.house.trim();
    const house = getHouse[0].toUpperCase();
    student.house = house;
    const popupHouse = getHouse[0].toUpperCase()+getHouse.slice(1).toLocaleLowerCase();
    student.popupHouse = popupHouse;
    
    //first name
    const firstSpace = fullname.indexOf(" ");
    const firstName = fullname[0].toUpperCase()+fullname.slice(1).toLowerCase().substring(0, firstSpace);
    if (fullname.indexOf(" ") >= 0) {
        student.firstName = firstName;
    };

    //middle and nick name
    const getMiddleName = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
    if (getMiddleName.includes('"')) {
        student.nickName = fullname.substring(fullname.indexOf(" ")+1,fullname.lastIndexOf(" "));
    } else {
        //student.middleName = getMiddleName[0].toUpperCase()+getMiddleName.slice(1).toLowerCase();
        student.middleName = getMiddleName;
    }

    //last name 
    const lastSpace = fullname.lastIndexOf(" ");
    const getlastName = fullname.substring(lastSpace +1);
    const lastName = getlastName[0].toUpperCase()+getlastName.slice(1).toLocaleLowerCase();
    student.lastName = lastName;

    //img
    const img = lastName.toLocaleLowerCase().replace(" ", "")+"_"+firstName[0].toLowerCase()+".png";
    student.img = img;

    //add the objekt to the global array
    allStudents.push(student);

    });

    displayList();
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    filterList(filter);
}

function filterList(filterBy) {
   
    
    let filteredList = allStudents;
    console.log("filteredList", filteredList);
    if (filterBy === "G") {
        filteredList = allStudents.filter(isG);
    }

    displayList(filterList);
}

function isG(student) {
    return student.house === "G";
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
        direction = -1;
    }

    sortedList = sortedList.sort(sortByChoice);

    function sortByChoice (studentA, studentB) {
        if (studentA[sortBy] < studentB[sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }

    displayList(sortedList);
}

function displayList() {
   
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    allStudents.forEach(displayStudents);
}

function displayStudents(student) {
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    //set clone data
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    clone.querySelector("[data-field=lastName]").addEventListener("click", () => {
        clickIt(student);
    })
    clone.querySelector("[data-field=firstName]").addEventListener("click", () => {
        clickIt(student);
    })
    clone.querySelector("[data-field=house]").addEventListener("click", () => {
        clickIt(student);
    })
    

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

function image(){
    
}

function clickIt(student){
    document.querySelector("#the_popup").classList.remove("hidden");

    //document.querySelector("img").src = medieurl + ;
    document.querySelector(".img").textContent += student.img;
    document.querySelector(".name").textContent += student.firstName+student.middleName+student.nickName+" "+student.lastName;
    document.querySelector(".house").textContent += student.popupHouse;
    document.querySelector(".blood").textContent += "lala";

    document.querySelector(".prefect").textContent = "Prefect";
    document.querySelector(".inquistorial").textContent = "Inquistorial";
    document.querySelector(".expelled").textContent = "Expelled";


    document.querySelector("#the_popup").addEventListener("click", start);

    banner();
}

 function banner() {
    if (student.popupHouse === "Gryffindor") {
        document.querySelector("#house_stripe_container").style.backgroundColor = 'green';
    }
 }
