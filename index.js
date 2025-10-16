const commands = {
  help: "Available commands: help, about, clear"
};

function test(e, el) {
  if (e.key === "Enter") {
    const command = el.value.trim();
    const output = document.getElementById("output");
    if (commands[command]) {
      output.innerHTML += `<p>${commands[command]}</p>`;
    } else {
      output.innerHTML += `<p>Unknown command: ${command}</p>`;
    }

    el.value = "";
  }
}