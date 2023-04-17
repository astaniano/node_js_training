import fs from 'node:fs'

for (let i = 0; i < 1000000; i++) {
    fs.appendFileSync('./trial.txt', "most likely it'll work. Or not? Interesting. Let's wait and see how this goes. I'm still not sore\n", (err) => {
        console.log(err)
    })
}



