const groupId = new URLSearchParams(window.location.search).get('id');
const logo = document.getElementById("logo");
const home = document.getElementById("home");
const roulette = document.getElementById("roulette");
const topic = document.getElementById("topic");
const back = document.getElementById("back");

logo.href = `../group.html?id=${groupId}`;
home.href = `../group.html?id=${groupId}`;
roulette.href = `./roulette/roulette.html?id=${groupId}`;
topic.href = `./topic/topic.html?id=${groupId}`;
back.href = `../group.html?id=${groupId}`;