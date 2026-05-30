const input = document.querySelector(".input-zone input");
const sendBtn = document.querySelector(".input-zone button");
const chat = document.querySelector(".chat");

function addMessage(author, text, type = "user") {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerHTML = `
    <strong>${author}</strong>
    <p>${text.replace(/\n/g, "<br>")}</p>
  `;
  chat.appendChild(div);
  chat.scrollIntoView({ behavior: "smooth", block: "end" });
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("Vous", text, "user");
  input.value = "";

  addMessage("GOURMIA AI", "Je réfléchis à une recette adaptée...", "ai");

  try {
    const response = await fetch("api/chat.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    const lastAiMessage = chat.querySelector(".message.ai:last-child p");

    if (data.reply) {
      lastAiMessage.innerHTML = data.reply.replace(/\n/g, "<br>");
    } else {
      lastAiMessage.innerHTML = data.error || "Erreur inconnue.";
    }

  } catch (error) {
    const lastAiMessage = chat.querySelector(".message.ai:last-child p");
    lastAiMessage.innerHTML = "Erreur de connexion avec l’IA locale.";
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});