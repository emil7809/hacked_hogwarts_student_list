"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const Student = {
    house: "",
    firstName: "",
    middleName: "",
    nickName: "",
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
    
    const firstSpace = fullname.indexOf(" ");
    const firstName = fullname[0].toUpperCase()+fullname.slice(1).toLowerCase().substring(0, firstSpace);
    student.firstName = firstName;

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
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}