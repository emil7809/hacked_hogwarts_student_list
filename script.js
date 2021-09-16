"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const Student = {
    house: "",
    firstName: "",
    middleName: "",
    //nickName: "",
}

function start(){
    console.log("Start");
    loadJSON();
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

    //add the objekt to the global array
    allStudents.push(student);

    });

    displayList();
}

function displayList() {
    console.log("display list")
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    allStudents.forEach(displayStudents);
}

function displayStudents(student) {
    console.log("display studets");
    
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    //set clone data
    clone.querySelector("[data-field=house]").textContent = "⚫";
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    //clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    //clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}