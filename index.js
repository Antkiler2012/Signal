const commands = {
  help: "help - List available commands\nabout - Information about the mission\nclear - Clear the terminal\nscan - Generates a new batch of signals and display their id and pattern.\ndecode_binary - decodes binary to text usage: decode_binary [binary]\ndecode_ASCII - decodes ASCII payload to token usage: decode_ASCII [payload]\ntype - shows the type of a token usage: type [token]\nflags - shows flags of a token usage: flags [token]\nchecksum - shows checksum of a token usage: checksum [token]\npayload - shows payload of a token usage: payload [token]",
  about:
    "Your a cybersecurity agent getting a signals from a unknown source, your mission is to decipher the signals and handle them.",
  scan: "",
  decode_binary: "",
  decode_ASCII: "",
};

const binary = {
  id03: "id03 = 01010011 01010010 01000011 00110011 01111100 01010100 00110010 01111100\n 01001100 00110101 01111100 01000110 00110000 01111100 01010000 01001000\n 01000101 01001100 01001100 01001111 01111100 01000011 00110111 00110100\n",
  id07: "id07 = 01010011 01010010 01000011 00110111 01111100 01010100 00110001 01111100\n 01001100 00110000 01111100 01000110 00110000 01111100 01010000 01111100\n 01000011 00110000 00110000",
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

function decodeToken(token) {
  const parts = token.split('-');
  if (parts.length !== 2) return null;
  const key = parseInt(parts[0], 10);
  const hex = parts[1];
  let ascii = '';
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    ascii += String.fromCharCode(byte ^ key);
  }
  return ascii;
}


function scan(container, inputParent) {
  var i = Math.floor(Math.random() * 2) + 1;
  if (i == 1) {
    if (binary["id03"]) {
      container.insertBefore(outputline(binary["id03"]), inputParent);
    } else if (binary["id07"]) {
      container.insertBefore(outputline(binary["id07"]), inputParent);
    }
  } else if (i == 2) {
    if (binary["id07"]) {
      container.insertBefore(outputline(binary["id07"]), inputParent);
    } else if (binary["id03"]) {
      container.insertBefore(outputline(binary["id03"]), inputParent);
    }
  }
}

function binaryAgent(str) {
  var binString = "";
  str.split(" ").map(function (bin) {
    binString += String.fromCharCode(parseInt(bin, 2));
  });
  console.log(binString);
  return binString;
}

function asciiToToken(payload) {
  const sourceMatch = payload.match(/SRC(\d+)/);
  if (!sourceMatch) return "Invalid payload format";
  const key = parseInt(sourceMatch[1], 10);
  let tokenHex = "";
  for (let i = 0; i < payload.length; i++) {
    tokenHex += (payload.charCodeAt(i) ^ key).toString(16).padStart(2, "0");
  }
  return sourceMatch[1].padStart(2, "0") + "-" + tokenHex;
}

function getFields(token) {
  const ascii = decodeToken(token);
  if (!ascii) return null;
  const obj = {};
  ascii.split("|").forEach((f) => {
    if (f.startsWith("SRC")) obj.source = f.slice(3);
    else if (f.startsWith("T")) obj.type = f.slice(1);
    else if (f.startsWith("L")) obj.length = f.slice(1);
    else if (f.startsWith("F")) obj.flags = f.slice(1);
    else if (f.startsWith("P")) obj.payload = f.slice(1);
    else if (f.startsWith("C")) obj.checksum = f.slice(1);
  });
  return obj;
}

function signalType(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  const map = {
    1: "Ping",
    2: "Data",
    3: "Control",
    4: "Malicious",
    9: "Admin Beacon",
  };
  return `Type: ${f.type} (${map[f.type] || "Unknown"})`;
}

function flagsInfo(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  const desc = { 0: "No encryption", 1: "Encrypted", 2: "Tampered" };
  return `Flags: F${f.flags} (${desc[f.flags] || "Unknown"})`;
}

function checksumInfo(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  return `Checksum: ${f.checksum}`;
}

function payloadInfo(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  return `Payload: "${f.payload}"`;
}

function jam(id) {
  delete binary[id];
  return `Signal ID ${id} has been JAMMED successfully.`;
}

function handle(command, container, inputParent) {
  const parts = command.split(" ");
  const cmd = parts[0];
  const args = parts.slice(1).join(" ");

  if (cmd === "clear") {
    container.innerHTML = "";
    const newPrompt = promptline();
    container.appendChild(newPrompt);
    newPrompt.querySelector("input").focus();
  } else if (commands[cmd]) {
    container.insertBefore(outputline(commands[cmd]), inputParent);
  } else if (cmd === "scan") {
    scan(container, inputParent);
  } else if (cmd === "decode_binary") {
    if (args) {
      const decoded = binaryAgent(args);
      container.insertBefore(outputline(decoded), inputParent);
    } else {
      container.insertBefore(outputline("Usage: decode_binary [binary]"), inputParent);
    }
  } else if (cmd === "decode_ASCII") {
    if (args) {
      const token = asciiToToken(args);
      container.insertBefore(outputline("Token: " + token), inputParent);
    } else {
      container.insertBefore(outputline("Usage: decode_ASCII [ascii]"), inputParent);
    }
  } else if (cmd === "type") {
    if (args) {
      container.insertBefore(outputline(signalType(args)), inputParent);
    } else {
      container.insertBefore(outputline("Usage: type [token]"), inputParent);
    }
  } else if (cmd === "flags") {
    if (args) {
      container.insertBefore(outputline(flagsInfo(args)), inputParent);
    } else {
      container.insertBefore(outputline("Usage: flags [token]"), inputParent);
    }
  } else if (cmd === "checksum") {
    if (args) {
      container.insertBefore(outputline(checksumInfo(args)), inputParent);
    } else {
      container.insertBefore(outputline("Usage: checksum [token]"), inputParent);
    }
  } else if (cmd === "payload") {
    if (args) {
      container.insertBefore(outputline(payloadInfo(args)), inputParent);
    } else {
      container.insertBefore(outputline("Usage: payload [token]"), inputParent);
    }
  } else if (cmd === "jam") {
    if (args) {
      const id = jam(args);
      container.insertBefore(outputline(id), inputParent);
    } else {
      container.insertBefore(outputline("Usage: jam [id]"), inputParent);
    }
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
