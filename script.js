//used to fetch elements by className, idName, customAttribute
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+={[}]|;:"<>,.?/';

let password = '';
let passwordLength = 10;
let checkCount = 1;
handleSlider();
//pass strength circle to grey
SetIndicator("#ccc")

//set PasswordLength
function handleSlider() { // password length ko UI me reflect krwata hai
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;


    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

    uppercaseCheck.checked = true;
}

function SetIndicator(colour) {
    indicator.style.backgroundColor = colour;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${colour}`
}    

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasNum = false;
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;

    if(numbersCheck.checked) hasNum = true;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8) {
        SetIndicator("#0f0");
    } else if(
        (hasUpper || hasLower) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ) {
        SetIndicator("#ff0");
    } else{
        SetIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch(e){
        copyMsg.innerText = 'Failed';
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox)=> {
        if(checkbox.checked) checkCount++;
    })

    //special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array) {
    //fisher Yates method
    for(let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i+1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value) copyContent();
})

generateBtn.addEventListener('click', () => {
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //console.log('Starting the journey');
    //lets start the journey to find new password

    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked) password += generateUpperCase();
    // if(lowercaseCheck.checked) password += generateLowerCase();
    // if(numbersCheck.checked) password += generateRandomNumber();
    // if(symbolCheck.checked) password += generateSymbol();

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    //COMPULSARY CHEJE
    for(let i = 0; i < funcArr.length; i++) {
        //console.log(funcArr[i]());
        password += funcArr[i]();
    }

    //console.log('compulsary addition done');

    //remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //console.log('remainig addition done');

    //shuffle the password
    password = shufflePassword(Array.from(password));
    //console.log("Shuffling done");

    //show in UI
    passwordDisplay.value = password;
    //console.log("UI adddition done");

    //calculate strength
    calcStrength();
});