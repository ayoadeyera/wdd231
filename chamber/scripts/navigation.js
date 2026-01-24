const hamButton = document.querySelector('#menu-button');
const navigation = document.querySelector('#menu-list');

hamButton.addEventListener('click', () => {
    navigation.classList.toggle('open');
    hamButton.classList.toggle('open');
});