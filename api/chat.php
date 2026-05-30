<?php

header("Content-Type: application/json; charset=utf-8");

$input = json_decode(file_get_contents("php://input"), true);
$message = trim($input["message"] ?? "");

if ($message === "") {
    echo json_encode(["error" => "Message vide"]);
    exit;
}

$system = "Tu es GOURMIA AI, une assistante IA spécialisée en cuisine.
Tu réponds toujours en français.
Tu proposes des recettes simples, claires, gourmandes et adaptées aux ingrédients de l'utilisateur.
Structure toujours ta réponse avec :
- Nom de la recette
- Temps
- Difficulté
- Ingrédients
- Étapes
- Astuce du chef
- Variante possible.";

$payload = [
    "model" => "hermes3:latest",
    "stream" => false,
    "messages" => [
        ["role" => "system", "content" => $system],
        ["role" => "user", "content" => $message]
    ]
];

$ch = curl_init("http://localhost:11434/api/chat");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(["error" => "Impossible de contacter Ollama"]);
    exit;
}

curl_close($ch);

$data = json_decode($response, true);
$answer = $data["message"]["content"] ?? "Réponse IA vide.";

echo json_encode([
    "reply" => $answer
]);