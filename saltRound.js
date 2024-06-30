"use strict";
const hexChars = '0123456789';
const letters = 'abcdefghijklmnopqrstuvwxyz';
const specialChars = '!@#$%^&*()+[]{}|;:<>?';
const allChars = hexChars + letters + specialChars;
let arr = allChars.split("");
let result = '';
let j = 1;
while (j <= 30) {
    for (let i = 57; i >= 1; i--) {
        const char = arr[Math.floor(Math.random() * i)];
        const index = arr.indexOf(char);
        arr.splice(index, 1);
        result += char;
    }
    ;
    console.log(`ROUND${j}='${result}'`);
    j++;
    result = '';
    arr = allChars.split("");
}
;
