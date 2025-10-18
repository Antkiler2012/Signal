const commands = {
  help: "help - List available commands\nabout - Information about the mission\nclear - Clear the terminal\nscan - Generates a new batch of signals and display their id and pattern.\ndecode_binary - decodes binary to text usage: decode_binary [binary]\ndecode_ASCII - decodes ASCII payload to token usage: decode_ASCII [payload]\ntype - shows the type of a token usage: type [token]\nflags - shows flags of a token usage: flags [token]\nchecksum - shows checksum of a token usage: checksum [token]\npayload - shows payload of a token usage: payload [token]\nforward - forwards a signal usage: forward [token]\nverify - verifies checksum of a token usage: verify [token]",
  about: "Your a cybersecurity agent getting signals from an unknown source, your mission is to decipher and handle them.",
  scan: "",
  decode_binary: "",
  decode_ASCII: "",
  forward: "",
  verify: ""
};

function asciiToBinary(str) {
  return str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ');
}

const binary = {
  id03: "id03 = " + asciiToBinary("SRC3|T2|L5|F0|PHELLO|C74"),
  id07: "id07 = " + asciiToBinary("SRC7|T1|L0|F0|P|C00"),
  id12: "id12 = " + asciiToBinary("SRC12|T4|L3|F1|PXYZ|C9A"),
  id15: "id15 = " + asciiToBinary("SRC15|T4|L7|F2|PDANGER|C3E"),
  id21: "id21 = " + asciiToBinary("SRC21|T2|L6|F0|PSTATUS|C2B"),
  id25: "id25 = " + asciiToBinary("SRC25|T9|L1|F8|P1|CADM")
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
  const ids = Object.keys(binary);
  const count = Math.min(3, ids.length);
  for (let i = 0; i < count; i++) {
    const id = ids[Math.floor(Math.random() * ids.length)];
    container.insertBefore(outputline(binary[id]), inputParent);
  }
}

function binaryAgent(str) {
  let binString = "";
  str.split(" ").map(bin => binString += String.fromCharCode(parseInt(bin, 2)));
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
  return sourceMatch[1].padStart(2,"0") + "-" + tokenHex;
}

function getFields(token) {
  const ascii = decodeToken(token);
  if (!ascii) return null;
  const obj = {};
  ascii.split("|").forEach(f => {
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
  const map = {1:"Ping",2:"Data",3:"Control",4:"Malicious",9:"Admin Beacon"};
  return `Type: ${f.type} (${map[f.type] || "Unknown"})`;
}

function flagsInfo(token) {
  const f = getFields(token);
  if (!f) return "Invalid token";
  const desc = {0:"No encryption",1:"Encrypted",2:"Tampered",8:"Admin/high-priority"};
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

const gameState = { jammed: new Set(), forwarded: new Set() };

function resolveId(arg) {
  if (!arg) return null;
  if (arg.startsWith("id")) return arg;
  const match = arg.match(/^(\d+)-/);
  return match ? "id" + match[1].padStart(2, "0") : null;
}

function jam(id) {
  const bin = binary[id];
  if (!bin) return "Invalid ID";
  const tokenStr = bin.split(" = ")[1];
  const token = asciiToToken(binaryAgent(tokenStr));
  const f = getFields(token);
  if (!f) return "Invalid token";

  delete binary[id];

  let result = `JAM: ${id} | Type: ${f.type} | Action executed.`;
  if (f.type == 4) result += " Good choice! Malicious signal neutralized.";
  else result += " Bad choice! Non-malicious signal jammed.";

  console.log(result);
  return result;
}

function forward(id) {
  const bin = binary[id];
  if (!bin) return "Invalid ID";
  const tokenStr = bin.split(" = ")[1];
  const token = asciiToToken(binaryAgent(tokenStr));
  const f = getFields(token);
  if (!f) return "Invalid token";

  let result = `FORWARD: ${id} | Type: ${f.type} | Action executed.`;
  if (f.type == 1 || f.type == 2 || f.type == 3 || f.type == 9)
    result += " Good choice! Signal forwarded.";
  else result += " Bad choice! Forwarding malicious signal!";
  delete binary[id];
  console.log(result);
  return result;
}

function verify(token) {
  const f = getFields(token);
  if (!f || !f.payload) return "Invalid token or missing payload";
  let sum = 0;
  for (let i = 0; i < f.payload.length; i++) sum += f.payload.charCodeAt(i);
  const hex = (sum % 256).toString(16).toUpperCase().padStart(2,"0");
  return hex === f.checksum ? "Checksum valid" : "Checksum invalid";
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
  } else if (cmd === "scan") scan(container,inputParent);
  else if (cmd === "decode_binary") {
    if(args) container.insertBefore(outputline(binaryAgent(args)),inputParent);
    else container.insertBefore(outputline("Usage: decode_binary [binary]"),inputParent);
  } else if (cmd === "decode_ASCII") {
    if(args) container.insertBefore(outputline("Token: "+asciiToToken(args)),inputParent);
    else container.insertBefore(outputline("Usage: decode_ASCII [ascii]"),inputParent);
  } else if (cmd === "type") {
    if(args) container.insertBefore(outputline(signalType(args)),inputParent);
    else container.insertBefore(outputline("Usage: type [token]"),inputParent);
  } else if (cmd === "flags") {
    if(args) container.insertBefore(outputline(flagsInfo(args)),inputParent);
    else container.insertBefore(outputline("Usage: flags [token]"),inputParent);
  } else if (cmd === "checksum") {
    if(args) container.insertBefore(outputline(checksumInfo(args)),inputParent);
    else container.insertBefore(outputline("Usage: checksum [token]"),inputParent);
  } else if (cmd === "payload") {
    if(args) container.insertBefore(outputline(payloadInfo(args)),inputParent);
    else container.insertBefore(outputline("Usage: payload [token]"),inputParent);
  } else if (cmd === "jam") {
    if(args) container.insertBefore(outputline(jam(args)),inputParent);
    else container.insertBefore(outputline("Usage: jam [id]"),inputParent);
  } else if (cmd === "forward") {
    if(args) container.insertBefore(outputline(forward(args)),inputParent);
    else container.insertBefore(outputline("Usage: forward [token]"),inputParent);
  } else if (cmd === "verify") {
    if(args) container.insertBefore(outputline(verify(args)),inputParent);
    else container.insertBefore(outputline("Usage: verify [token]"),inputParent);
  } else if(command!=="") container.insertBefore(outputline(`Unknown command: ${command}`),inputParent);
}

function test(e,el) {
  if(e.key==="Enter") {
    const command = el.value.trim();
    const container = document.getElementById("terminal_container");
    container.insertBefore(commandline(command),el.parentElement);
    handle(command,container,el.parentElement);
    if(command!=="clear") {
      const newprompt = promptline();
      container.replaceChild(newprompt,el.parentElement);
      newprompt.querySelector("input").focus();
    }
  }
}

window.addEventListener("DOMContentLoaded",()=>{
  const container = document.getElementById("terminal_container");
  container.innerHTML = "";
  const initialPrompt = promptline();
  container.appendChild(initialPrompt);
  initialPrompt.querySelector("input").focus();
});
