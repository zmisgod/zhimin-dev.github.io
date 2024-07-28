import { ChatGPTAPI } from 'chatgpt'

let question = process.argv[2];
let key = ""

// console.log("question: ", question);

// const api = new ChatGPTAPI({
//   apiKey: key
// })

// const res = await api.sendMessage(question)
// console.log(res.text)


async function example() {
  const api = new ChatGPTAPI({
    apiKey: key
  })

  const res = await api.sendMessage(question)
  console.log(res.text)
}
await example();