import { readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

function reverseBytesInLine(indexOfFirstByteInNewLine, wholeFileInBuff) {
    let endOfLineIndex;
    for (
        let i = indexOfFirstByteInNewLine; 
        i < wholeFileInBuff.length && !endOfLineIndex; 
        i++
    ) { 
        const nextLineAssciNum = 10;
        if (wholeFileInBuff[i] === nextLineAssciNum) {
             endOfLineIndex = i;
        }
    }

    if (!endOfLineIndex) {
        endOfLineIndex = wholeFileInBuff.length - 1;
    }

    const reversedRowAsArr = [];
    for (let i = endOfLineIndex; i >= indexOfFirstByteInNewLine; i--) {
        reversedRowAsArr.push(wholeFileInBuff[i]);
    } 

    return new Buffer.from(reversedRowAsArr);
}

async function reverseFile() {
    try {
        const fileInBuff = await readFile('./trial.txt');
        const numOfBytesInInputFile = fileInBuff.length;

        if (numOfBytesInInputFile < 2) {
           console.log('Input file should contain at least 2 characters');
           return;
        }

        const res = Buffer.allocUnsafe(numOfBytesInInputFile);

        let indexOfFirstByteInNewLine = 0;
        while (indexOfFirstByteInNewLine < numOfBytesInInputFile) {
            const buff = reverseBytesInLine(indexOfFirstByteInNewLine, fileInBuff); 
            
            res.fill(buff, indexOfFirstByteInNewLine) 

            indexOfFirstByteInNewLine += buff.length;
        }

        await writeFile('res.txt', res); 
    } catch (err) {
        console.log(err)
    }
}

reverseFile()
