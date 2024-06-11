import openai from "./config/open-ai.js";
import readlineSync from "readline-sync";
import colors from "colors";
import ora from "ora";

const main = async () => {
  console.log(colors.bold.green("Welcome to the ChatBot program"));
  console.log(colors.bold.green("You can start chatting with the bot!"));

  const chatHistory = []; //store conversation history...

  while (true) {
    const userInput = readlineSync.question(colors.yellow("You: "));

    try {
      // Construct messages by iterating over the history.
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));
      // Add latest user input
      messages.push({
        role: "user",
        content: userInput,
      });
      const spinner = ora("Generating response...").start();

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      spinner.stop();

      const assistantResponse = completion.choices[0].message.content;
      console.log(`${colors.bold.red("System:")} ${assistantResponse}`);
      // Update history with user input and assistant response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", assistantResponse]);

      if (userInput.toLowerCase() === "exit") {
        console.log(colors.red("exiting..."));
        break;
      }
    } catch (error) {
      console.error(colors.red(error));
    }
  }
};

main();
