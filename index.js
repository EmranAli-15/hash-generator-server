"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/', (req, res) => {
    const { password, saltRound } = req.body;
    const lowerPass = password.toLowerCase();
    const passArray = lowerPass.split('');
    if (passArray.length < 3 || passArray.length > 10) {
        return res.status(404).json({
            message: 'Required password 3-10 digit'
        });
    }
    ;
    // Getting the desired salt round
    const round = `ROUND${saltRound}`;
    const selectedRound = process.env[`${round}`];
    // End
    // Mechanism for repeated digit
    const repeat = [];
    let count = 0;
    for (let i = 0; i <= passArray.length - 1; i++) {
        const char = passArray[i];
        for (let j = 0; j <= passArray.length - 1; j++) {
            if (char === passArray[j]) {
                count++;
            }
        }
        ;
        if (count === 1) {
            repeat.push(char);
        }
        else {
            if (!repeat.includes(`${count}${char}`)) {
                repeat.push(`${count}${char}`);
            }
        }
        count = 0;
    }
    ;
    // End
    // Selecting the substring
    const startWith = passArray[2];
    let isForeword = true;
    let getHashToken;
    const indexOfChar = selectedRound === null || selectedRound === void 0 ? void 0 : selectedRound.indexOf(startWith);
    if (indexOfChar > 36) {
        isForeword = false;
    }
    ;
    if (isForeword) {
        getHashToken = selectedRound === null || selectedRound === void 0 ? void 0 : selectedRound.substring(indexOfChar, indexOfChar + 20);
    }
    else {
        getHashToken = selectedRound === null || selectedRound === void 0 ? void 0 : selectedRound.substring(indexOfChar - 19, indexOfChar + 1);
    }
    // End
    // Making hash password
    const divideNum = Math.floor(20 / passArray.length) - 1;
    const hashTokenArr = getHashToken.split("");
    let initialIndex = divideNum;
    for (let i = 0; i <= passArray.length - 1; i++) {
        hashTokenArr[initialIndex] = repeat[i];
        initialIndex = initialIndex + divideNum;
    }
    ;
    const hashPassword = hashTokenArr.join("");
    // End
    return res.send({ name: hashPassword });
});
app.get('/', (req, res) => {
    return res.send("Welcome to hash generator");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
