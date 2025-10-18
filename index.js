const commands = {
  help: "help - List available commands\nabout - Information about the mission\nclear - Clear the terminal",
  about: "Your a cybersecurity agent getting a signals from a unknown source, your mission is to decipher the signals and handle them.",
};

function promptline() {
  const prompt = document.createElement("div");
  prompt.className = "prompt_line";
  prompt.innerHTML = `<span class="prompt_text">[Antre@antre ~]$</span> <input class="terminal_input" onkeydown="test(event, this)" autocomplete="off" />`;
  return prompt;
}

function commandline(command) {
  const line = document.createElement("div");
  line.className = "prompt_line";
  line.innerHTML = `<span class="prompt_text">[Antre@antre ~]$</span> <span>${command}</span>`;
  return line;
}

function outputline(text) {
  const out = document.createElement("div");
  out.className = "output_line";
  out.textContent = text;
  return out;
}

function handle(command, container, inputParent) {
  if (command === "clear") {
    container.innerHTML = "";
    const newPrompt = promptline();
    container.appendChild(newPrompt);
    newPrompt.querySelector("input").focus();
  } else if (commands[command]) {
    container.insertBefore(outputline(commands[command]), inputParent);
  } else if (command !== "") {
    container.insertBefore(outputline(`Unknown command: ${command}`), inputParent);
  }
}

function test(e, el) {
  if (e.key === "Enter") {
    const command = el.value.trim();
    const container = document.getElementById("terminal_container");

    container.insertBefore(commandline(command), el.parentElement);
    handle(command, container, el.parentElement);

    if (command !== "clear") {
      const newprompt = promptline();
      container.replaceChild(newprompt, el.parentElement);
      newprompt.querySelector("input").focus();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("terminal_container");
  container.innerHTML = "";
  const initialPrompt = promptline();
  container.appendChild(initialPrompt);
  initialPrompt.querySelector("input").focus();
});
