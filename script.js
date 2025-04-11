const nameInput = document.getElementById('nameInput');
const addNameButton = document.getElementById('addNameButton');
const nameList = document.getElementById('nameList');
const pickRandomButton = document.getElementById('pickRandomButton');
const result = document.getElementById('result');

const names = [];

addNameButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        names.push(name);
        const listItem = document.createElement('li');
        listItem.textContent = name;
        nameList.appendChild(listItem);
        nameInput.value = '';
        listItem.style.animation = 'slideIn 0.5s ease-in-out';
    }
});

pickRandomButton.addEventListener('click', () => {
    if (names.length > 0) {
        const randomIndex = Math.floor(Math.random() * names.length);
        result.textContent = `الاسم العشوائي: ${names[randomIndex]}`;
        result.style.animation = 'bounce 1s ease-in-out';
    } else {
        result.textContent = 'لا توجد أسماء للاختيار منها!';
    }
});