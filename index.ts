import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());


type TBody = {
    password: string;
    saltRound: number;
}


app.post('/', (req, res) => {

    const { password, saltRound }: TBody = req.body;
    const lowerPass = password.toLowerCase();
    const passArray = lowerPass.split('');

    if (passArray.length < 3 || passArray.length > 10) {
        return res.status(404).json({
            message: 'Required password 3-10 digit'
        });
    };



    // Getting the desired salt round
    const round = `ROUND${saltRound}`
    const selectedRound = process.env[`${round}`];
    // End



    // Mechanism for repeated digit
    const repeat: string[] = [];
    let count = 0;
    for (let i = 0; i <= passArray.length - 1; i++) {
        const char = passArray[i];
        for (let j = 0; j <= passArray.length - 1; j++) {
            if (char === passArray[j]) {
                count++;
            }
        };

        if (count === 1) {
            repeat.push(char);
        } else {
            if (!repeat.includes(`${count}${char}`)) {
                repeat.push(`${count}${char}`);
            }
        }

        count = 0;
    };
    // End



    // Selecting the substring
    const startWith = passArray[2];
    let isForeword = true;

    let getHashToken;

    const indexOfChar = selectedRound?.indexOf(startWith);
    if (indexOfChar as number > 36) {
        isForeword = false;
    };

    if (isForeword) {
        getHashToken = selectedRound?.substring(indexOfChar!, indexOfChar! + 20);
    } else {
        getHashToken = selectedRound?.substring(indexOfChar! - 19, indexOfChar! + 1);
    }
    // End




    // Making hash password
    const divideNum = Math.floor(20 / repeat.length);
    const hashTokenArr = getHashToken!.split("");
    let initialIndex = divideNum;

    // console.log(divideNum)

    for (let i = repeat.length - 1; i >= 0; i--) {
        hashTokenArr[initialIndex - 1] = repeat[i];
        initialIndex = initialIndex + divideNum;
    };

    const hashPassword = hashTokenArr.join("");
    // End

    return res.send({ password: hashPassword });
})

app.get('/', (req, res) => {
    return res.send("Welcome to hash generator");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})