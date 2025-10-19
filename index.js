var score = 0;
var name_storage = localStorage.getItem("name");
var name = JSON.parse(name_storage).myContent;

const history = [];
// commands initialization/and uhm the help and about description
const commands = {
  help: "help - List available commands\nabout - Information about the mission\nclear - Clear the terminal\nscan - Generates a new batch of signals and display their id and pattern.\ndecode_binary - decodes binary to text usage: decode_binary [binary]\ndecode_ASCII - decodes ASCII payload to token usage: decode_ASCII [payload]\ntype - shows the type of a token usage: type [token]\nflags - shows flags of a token usage: flags [token]\nchecksum - shows checksum of a token usage: checksum [token]\npayload - shows payload of a token usage: payload [token]\nforward - forwards a signal usage: forward [token]\njam - jams signal usage: jam[id]\nverify - verifies checksum of a token usage: verify [token]",
  about:
    "Your a cybersecurity agent getting signals from an unknown source, your mission is to decipher and handle them.",
  scan: "",
  decode_binary: "",
  decode_ASCII: "",
  forward: "",
  verify: "",
};

// convert ascii to binary
function asciiToBinary(str) {
  return str
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

var time = 60;

var timer = setInterval(() => {
  time -= 1;
  document.getElementsByClassName("time")[0].textContent = "Time left: " + time;

  if (time <= 0) {
    console.log("done")
    localStorage.setItem("score", JSON.stringify({ myContent: score }));
    window.location.href = "done.html";
  }
}, 1000);

// signals, converted to binary with asciiToBinary function
const binary = {
  id03: "id03 = " + asciiToBinary("SRC3|T2|L5|F0|PHELLO|C74"),
  id07: "id07 = " + asciiToBinary("SRC7|T1|L0|F0|P|C00"),
  id12: "id12 = " + asciiToBinary("SRC12|T4|L3|F1|PXYZ|C9A"),
  id15: "id15 = " + asciiToBinary("SRC15|T4|L7|F2|PDANGER|C3E"),
  id21: "id21 = " + asciiToBinary("SRC21|T2|L6|F0|PSTATUS|C2B"),
  id25: "id25 = " + asciiToBinary("SRC25|T9|L1|F8|P1|CADM"),
  id30: "id30 = " + asciiToBinary("SRC30|T3|L2|F1|PALERT|C5D"),
  id34: "id34 = " + asciiToBinary("SRC34|T2|L4|F0|PUPDATE|C6F"),
  id38: "id38 = " + asciiToBinary("SRC38|T1|L5|F2|PLOGIN|C1A"),
  id42: "id42 = " + asciiToBinary("SRC42|T4|L3|F1|PERROR|C9C"),
  id47: "id47 = " + asciiToBinary("SRC47|T9|L0|F8|PADMIN|C2D"),
  id50: "id50 = " + asciiToBinary("SRC50|T1|L2|F0|PHELLO|C1A"),
  id51: "id51 = " + asciiToBinary("SRC51|T2|L4|F1|PUPDATE|C2B"),
  id52: "id52 = " + asciiToBinary("SRC52|T3|L3|F0|PALERT|C3C"),
  id53: "id53 = " + asciiToBinary("SRC53|T4|L5|F2|PDANGER|C4D"),
  id54: "id54 = " + asciiToBinary("SRC54|T2|L1|F0|PSTATUS|C5E"),
  id55: "id55 = " + asciiToBinary("SRC55|T9|L0|F8|PADMIN|C6F"),
  id56: "id56 = " + asciiToBinary("SRC56|T1|L3|F1|PLOGIN|C7A"),
  id57: "id57 = " + asciiToBinary("SRC57|T4|L2|F0|PERROR|C8B"),
  id58: "id58 = " + asciiToBinary("SRC58|T3|L4|F2|PALERT|C9C"),
  id59: "id59 = " + asciiToBinary("SRC59|T2|L5|F1|PUPDATE|CAD"),
  id60: "id60 = " + asciiToBinary("SRC60|T1|L0|F0|PHELLO|CBE"),
  id61: "id61 = " + asciiToBinary("SRC61|T4|L3|F2|PDANGER|CCF"),
  id62: "id62 = " + asciiToBinary("SRC62|T9|L1|F8|PADMIN|CDA"),
  id63: "id63 = " + asciiToBinary("SRC63|T2|L2|F0|PSTATUS|CEB"),
  id64: "id64 = " + asciiToBinary("SRC64|T3|L4|F1|PALERT|CFC"),
  id65: "id65 = " + asciiToBinary("SRC65|T1|L5|F0|PLOGIN|DAD"),
  id66: "id66 = " + asciiToBinary("SRC66|T4|L3|F2|PERROR|DBE"),
  id67: "id67 = " + asciiToBinary("SRC67|T2|L1|F0|PUPDATE|DCF"),
  id68: "id68 = " + asciiToBinary("SRC68|T9|L0|F8|PADMIN|DDA"),
};

// makes new prompt line
function promptline() {
  const prompt = document.createElement("div");
  prompt.className = "prompt_line";
  prompt.innerHTML = `<span class="prompt_text">[${name}@Antre]$</span> <input class="terminal_input" onkeydown="test(event, this)" autocomplete="off" />`;
  return prompt;
}
// makes new command line
function commandline(command) {
  const line = document.createElement("div");
  line.className = "prompt_line";
  line.innerHTML = `<span class="prompt_text">[${name}@Antre ~]$</span> <span>${command}</span>`;
  return line;
}

// makes new output line
function outputline(text, preserveNewlines = false) {
  const out = document.createElement("div");
  out.className = "output_line";
  out.textContent = text;

  if (preserveNewlines) {
    out.style.whiteSpace = "pre-wrap";
  } else {
    out.style.whiteSpace = "normal";
    out.style.wordWrap = "break-word";
    out.style.overflowWrap = "anywhere";
  }

  return out;
}

// checks if player made it to the end
function checkbinary() {
  const allEmpty = Object.values(binary).every((v) => !v);
  if (allEmpty) {
    console.log("done");
    console.log(score);
    localStorage.setItem("score", JSON.stringify({ myContent: score }));
    window.location.href = "done.html";
  }
}

// decodes token
function decodeToken(token) {
  const parts = token.split("-");
  if (parts.length !== 2) return null;
  const key = parseInt(parts[0], 10);
  const hex = parts[1];
  let ascii = "";
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    ascii += String.fromCharCode(byte ^ key);
  }
  return ascii;
}

// scans incomming signals
function scan(container, inputParent) {
  const ids = Object.keys(binary);
  const count = Math.min(3, ids.length);
  const availableIds = [...ids];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * availableIds.length);
    const id = availableIds.splice(index, 1)[0];
    container.insertBefore(outputline(binary[id]), inputParent);
  }
}

// convert binary to ascii command
function binaryAgent(str) {
  let binString = "";
  str
    .split(" ")
    .map((bin) => (binString += String.fromCharCode(parseInt(bin, 2))));
  return binString;
}

// convert ascii to token command
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

// take fields from token
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

// get signal type command
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

// get flags info command
function flagsInfo(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  const desc = {
    0: "No encryption",
    1: "Encrypted",
    2: "Tampered",
    8: "Admin/high-priority",
  };
  return `Flags: F${f.flags} (${desc[f.flags] || "Unknown"})`;
}

// get checksum info command
function checksumInfo(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  return `Checksum: ${f.checksum}`;
}

// get payload info command
function payloadInfo(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  return `Payload: "${f.payload}"`;
}

const gameState = { jammed: new Set(), forwarded: new Set() };

// resolve id from argument
function resolveId(arg) {
  if (!arg) return null;
  if (arg.startsWith("id")) return arg;
  const match = arg.match(/^(\d+)-/);
  return match ? "id" + match[1].padStart(2, "0") : null;
}
// jam signal command
function jam(id) {
  const bin = binary[id];
  if (!bin) return "Invalid ID";
  const tokenStr = bin.split(" = ")[1];
  const token = asciiToToken(binaryAgent(tokenStr));
  const f = getFields(token);
  if (!f) return "Invalid token";

  delete binary[id];

  let result = `JAM: ${id} | Type: ${f.type} | Action executed.`;
  if (f.type == 4) {
    result += " Good choice! Malicious signal neutralized.";
    score += 1;
  } else {
    result += " Bad choice! Non-malicious signal jammed.";
    score -= 1;
  }

  checkbinary();
  console.log(result);
  return result;
}
// forward signal command
function forward(id) {
  const bin = binary[id];
  if (!bin) return "Invalid ID";
  const tokenStr = bin.split(" = ")[1];
  const token = asciiToToken(binaryAgent(tokenStr));
  const f = getFields(token);
  if (!f) return "Invalid token";

  let result = `FORWARD: ${id} | Type: ${f.type} | Action executed.`;
  if (f.type == 1 || f.type == 2 || f.type == 3 || f.type == 9) {
    result += " Good choice! Signal forwarded.";
    score += 1;
  } else {
    result += " Bad choice! Forwarding malicious signal!";
    score -= 1;
  }
  delete binary[id];
  checkbinary();
  console.log(result);
  return result;
}
// verify checksum command
function verify(token) {
  const f = getFields(token);
  if (!f || !f.payload) return "Invalid token or missing payload";
  let sum = 0;
  for (let i = 0; i < f.payload.length; i++) sum += f.payload.charCodeAt(i);
  const hex = (sum % 256).toString(16).toUpperCase().padStart(2, "0");
  return hex === f.checksum ? "Checksum valid" : "Checksum invalid";
}

// main stuff that handels command input
function handle(command, container, inputParent) {
  const parts = command.split(" ");
  const cmd = parts[0];
  const args = parts.slice(1).join(" ");
  if (command === "clear") {
    container.innerHTML = "";
    const newPrompt = promptline();
    container.appendChild(newPrompt);
    newPrompt.querySelector("input").focus();
  } else if (commands[cmd]) {
    container.insertBefore(outputline(commands[cmd], true), inputParent);
  } else if (command === "scan") scan(container, inputParent);
  else if (cmd === "decode_binary") {
    if (args)
      container.insertBefore(outputline(binaryAgent(args)), inputParent);
    else
      container.insertBefore(
        outputline("Usage: decode_binary [binary]"),
        inputParent
      );
  } else if (cmd === "decode_ASCII") {
    if (args)
      container.insertBefore(
        outputline("Token: " + asciiToToken(args)),
        inputParent
      );
    else
      container.insertBefore(
        outputline("Usage: decode_ASCII [ascii]"),
        inputParent
      );
  } else if (cmd === "type") {
    if (args) container.insertBefore(outputline(signalType(args)), inputParent);
    else container.insertBefore(outputline("Usage: type [token]"), inputParent);
  } else if (cmd === "flags") {
    if (args) container.insertBefore(outputline(flagsInfo(args)), inputParent);
    else
      container.insertBefore(outputline("Usage: flags [token]"), inputParent);
  } else if (cmd === "checksum") {
    if (args)
      container.insertBefore(outputline(checksumInfo(args)), inputParent);
    else
      container.insertBefore(
        outputline("Usage: checksum [token]"),
        inputParent
      );
  } else if (cmd === "payload") {
    if (args)
      container.insertBefore(outputline(payloadInfo(args)), inputParent);
    else
      container.insertBefore(outputline("Usage: payload [token]"), inputParent);
  } else if (cmd === "jam") {
    if (args) container.insertBefore(outputline(jam(args)), inputParent);
    else container.insertBefore(outputline("Usage: jam [id]"), inputParent);
  } else if (cmd === "forward") {
    if (args) container.insertBefore(outputline(forward(args)), inputParent);
    else
      container.insertBefore(outputline("Usage: forward [token]"), inputParent);
  } else if (cmd === "verify") {
    if (args) container.insertBefore(outputline(verify(args)), inputParent);
    else
      container.insertBefore(outputline("Usage: verify [token]"), inputParent);
  } else if (command === "whoami") {
    container.insertBefore(outputline(name), inputParent);
  } else if (command === "date") {
    const date = new Date();
    container.insertBefore(outputline(date), inputParent);
  } else if (command === "history") {
    container.insertBefore(outputline(history.join(""), true), inputParent);
  } else if (command !== "")
    container.insertBefore(
      outputline(`Unknown command: ${command}`),
      inputParent
    );
}
// basicly just checks if the enter key is pressed if it is it runs the handle function
function test(e, el) {
  if (e.key === "Enter") {
    const command = el.value.trim();
    const container = document.getElementById("terminal_container");
    container.insertBefore(commandline(command), el.parentElement);
    history.push(command + "\n");
    handle(command, container, el.parentElement);
    if (command !== "clear") {
      const newprompt = promptline();
      container.replaceChild(newprompt, el.parentElement);
      newprompt.querySelector("input").focus();
    }
  }
}

// setup
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("terminal_container");
  container.innerHTML = "";
  const initialPrompt = promptline();
  container.appendChild(initialPrompt);
  initialPrompt.querySelector("input").focus();
});
