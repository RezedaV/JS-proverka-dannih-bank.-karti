//  переменные
let regNotCardNum = /[A-Za-zА-Яа-яЁё|,./№():"]/;
let regCardNum = /[0-9]/;
const errorText = document.querySelector('.error_text');
const rightText = document.querySelector('.right_text');
const errorCardText = document.querySelector('.error_card_text');
const errorCvvText = document.querySelector('.error_CVV_text');
const errorDateText = document.querySelector('.error_date_text');
let formFioInput = document.querySelector('.form_fio_input');
let formAddressInput = document.querySelector('.form_address_input');
let cardNum = document.querySelector('.form_card_input');
const elCCValidation = document.querySelector('.ccValidator');


const hideEl = (el) => el.style.display = 'none';
const showEl = (el) => el.style.display = 'flex';
const errorBorderStyle = (el) => el.style.border = '1px solid #DC0533';
const correctBorderStyle = (el) => el.style.border = '1px solid #CED4DA';



// вывод Dadata
$(document).ready(function () {
    const token = "f66d140390abb65ed48d00370d217de5d695ef9a";

    $(".form_address_input").suggestions({
        token: token,
        type: "ADDRESS",
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function(suggestion) {}
    });
    $(".form_fio_input").suggestions({
        token: token,
        type: "NAME",
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function(suggestion) {}
    });
});



//проверяю по шагу 1(ФИО и адрес)
function testStep1(){
    let fio = $('.form_fio_input').val();
    let address = $('.form_address_input').val();


    if (fio.length === 0){
        showEl(errorText);
        errorBorderStyle(formFioInput);
    }
    if (address.length === 0){
        showEl(errorText);
        errorBorderStyle(formAddressInput);
    }
    if (fio.length >= 1 && address.length >= 1){
        console.log('работает, поля заполнены');
        hideEl(errorText);
        showEl(rightText);
        correctBorderStyle(formFioInput);
        correctBorderStyle(formAddressInput);
        document.location.assign('step2.html');
    }
}

//--------------------------------------------------------------------------------------------------------

// проверяю по шагу 2, по клику на кнопку далее(данные карты)
function testStep2(){
    let cardNum = $('.form_card_input').val();
    let cardCvv = $('.form_card_CVV_input').val();
    let inputMonth = $('.month_input').val();
    let inputYear = $('.year_input').val();

    checkDate();
    if (cardNum.length < 16){
        showEl(errorText);
        hideEl(errorCardText);
        alert('Заполните поле номер карты');
    }
    if (cardCvv.length < 3){
        showEl(errorText);
        hideEl(errorCvvText)
        alert('Заполните поле код CVV');
    }
    if (regNotCardNum.test(cardNum.value)){
        showEl(errorCardText);
    }
    if (regNotCardNum.test(cardCvv.value)){
        showEl(errorCvvText);
    }
    if ((cardNum.length === 16 && cardCvv.length === 3 && inputMonth.length >= 1 && inputYear.length >= 1)  ){
        checkCC();
        console.log('Проверка выполнена');
        hideEl(errorText);
        hideEl(errorCardText);
        hideEl(errorCvvText);
    }
}


// функция для проверки срока действия карты
function checkDate(){
    let inputMonth = $('.month_input').val();
    let inputYear = $('.year_input').val();

    let today = new Date();
    let selDate = new Date();

    if(!regCardNum.test(inputMonth.value) || !regCardNum.test(inputYear.value)){
        showEl(errorDateText);
    }
    if(inputMonth > 13){
        alert('такого месяца не существует,просьба проверить дату');
    }
    if(inputYear < 1950){
        console.log("просьба ввести год в формате \"гггг\"");
    }
    if (inputMonth <= 1 || inputYear <= 1){
        alert('Заполните поле срок действия')
        return false
    }
    if (inputMonth < 13){
        if (today.getTime() > selDate.setFullYear(inputYear, inputMonth)){
            alert ("ВНИМАНИЕ! Срок действия карты истек");
            hideEl(errorDateText);
        } else {
            console.log('срок действия карты годен');
            hideEl(errorDateText);
        }
    }
}



// АЛГОРИТМ ЛУНА ПО НОМЕРУ КАРТЫ
const checkCC = () => {
    let message = "";

    if( luhnAlgorithm(cardNum.value) )
        message = "Номер карты Валиден";
    else
        message = "К сожалению,номер карты не валиден";

    elCCValidation.textContent = message;
    cardNum.value = null;
};

const luhnAlgorithm = (ccNumber) => {
    const length = ccNumber.length;
    let count = 0;

    for(let i = 0; i < length; i++) {
        let currentDigit = parseInt(ccNumber[i]);

        if ( (i+2) % 2 === 0)
            if((currentDigit *= 2) > 9)
                currentDigit -= 9;

        count += currentDigit;
    }
    return (count % 10) === 0;
}
