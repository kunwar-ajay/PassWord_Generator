const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = " !@$%^&*()_?><~`{}[]|";

let password = "";
let passwordLength = 10;
let checkCount = 0;

// set strength circle color to grey
handleSlider();
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // homework for shadow
}

function getRndInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9).toString();

}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol()
{
    const randNum = getRndInteger(0, symbols.length - 1);
    return symbols.charAt(randNum);
}

function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    
    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true; // yaha kuch toh dikhhat ho sakhti hai 

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch(e){
        copyMsg.innerText = "Failed!";
    }

    // copy wala span text will visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
   
}

function shufflePassword(array){
    // fisher yates method
    for(let i = array.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach( (el) => (str += el));
    return str;

}

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount ++;
    })

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

copybtn.addEventListener('click',()=> {
    if(passwordDisplay.value)
        copyContent();
})

generatebtn.addEventListener('click',()=> {
    // none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey for generating new password

    // remove old password
    password = "";

    // let's put the stuff mentioned in checkboxes

    // if(uppercaseCheck.Checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.Checked){
    //     password += generateLowercase();
    // }
    // if(numbersCheck.Checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.Checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercase.checked)
        funcArr.push(generateUppercase);
    
    if(lowercase.checked)
        funcArr.push(generateLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    //  compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length-1);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate Strength
    calcStrength();
})



