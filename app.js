document.getElementById("help-button").addEventListener("click", function() {
    const helpContent = document.getElementById("help-content");
    if (helpContent.style.display === "none" || helpContent.style.display === "") {
        helpContent.style.display = "block";
    } else {
        helpContent.style.display = "none";
    }
});
function toggleHelp() {
    const helpModal = document.getElementById("helpModal");
    helpModal.style.display = (helpModal.style.display === "none" || helpModal.style.display === "") ? "block" : "none";
}

function predictMastitis() {
    const temperature = document.getElementById("temperature").value;
    const hardness = document.getElementById("hardness").value;
    const pain = document.getElementById("pain").value;
    const milk_visibility = document.getElementById("milk_visibility").value;
    const milk_color = document.getElementById("milk_color").value;
    const resultElement = document.getElementById("result");

    // Input validation
    if (!temperature || isNaN(temperature)) {
        resultElement.textContent = "Temperature must be a valid number.";
        resultElement.className = "error";
        return;
    }

    if (hardness < 0 || hardness > 5 || isNaN(hardness)) {
        resultElement.textContent = "Hardness must be between 0 and 5.";
        resultElement.className = "error";
        return;
    }

    if (pain < 0 || pain > 5 || isNaN(pain)) {
        resultElement.textContent = "Pain must be between 0 and 5.";
        resultElement.className = "error";
        return;
    }

    if (milk_visibility !== "0" && milk_visibility !== "1") {
        resultElement.textContent = "Milk Visibility must be either 0 or 1.";
        resultElement.className = "error";
        return;
    }

    if (milk_color < 0 || milk_color > 5 || isNaN(milk_color)) {
        resultElement.textContent = "Milk Color must be between 0 and 5.";
        resultElement.className = "error";
        return;
    }

    // Make the API call
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            temperature: parseFloat(temperature),
            hardness: parseInt(hardness),
            pain: parseInt(pain),
            milk_visibility: parseInt(milk_visibility),
            milk_color: parseInt(milk_color)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            resultElement.textContent = `Error: ${data.error}`;
            resultElement.className = "error";
        } else {
            resultElement.textContent = data.prediction; // Display only the prediction
            resultElement.className = "success";
        }
    })
    .catch(err => {
        resultElement.textContent = "Error: Unable to connect to the server.";
        resultElement.className = "error";
    });
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.style.display = (chatbot.style.display === 'none' || chatbot.style.display === '') ? 'flex' : 'none';
}

function sendChatbotMessage() {
    const inputField = document.getElementById('chatbot-input');
    const message = inputField.value.trim().toLowerCase(); // Normalize input
    const messagesContainer = document.getElementById('chatbot-messages');

    if (!message) return;

    // Append user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chatbot-message user';
    userMessage.textContent = inputField.value; // Display user input as is
    messagesContainer.appendChild(userMessage);

    // Get and append chatbot response
    const response = getChatbotResponse(message);
    const botMessage = document.createElement('div');
    botMessage.className = 'chatbot-message bot';
    botMessage.textContent = response;
    messagesContainer.appendChild(botMessage);

    // Clear input
    inputField.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getChatbotResponse(message) {
    // Define responses
    const responses = [
        { keywords: ["mastitis"], response: "Mastitis is an inflammation of the udder, often caused by infection." },
        { keywords: ["symptoms", "mastitis"], response: "Common symptoms of mastitis include udder swelling, pain, redness, heat, fever, and abnormal milk such as clots or blood." },
        { keywords: ["early", "symptoms"], response: "Early symptoms of mastitis include slight swelling of the udder and changes in milk consistency or yield." },
        { keywords: ["prevent", "mastitis"], response: "To prevent mastitis, maintain hygiene, use clean milking equipment, ensure proper milking techniques, and regularly check the health of cows." },
        { keywords: ["hygiene", "prevent"], response: "Good hygiene practices like cleaning udders before milking and using disinfectant dips post-milking are essential to prevent mastitis." },
        { keywords: ["prevention", "methods"], response: "Prevention methods include cleaning milking equipment, minimizing stress in cows, ensuring proper nutrition, and separating infected cows." },
        { keywords: ["causes", "mastitis"], response: "Mastitis is caused by bacteria entering the udder through the teat canal, often due to poor hygiene or injuries." },
        { keywords: ["risk", "factors"], response: "Risk factors for mastitis include poor udder hygiene, improper milking techniques, teat injuries, and stress due to overcrowding." },
        { keywords: ["treatment", "mastitis"], response: "Treatment for mastitis includes consulting a veterinarian, administering antibiotics, and proper milking practices to relieve pressure." },
        { keywords: ["antibiotics"], response: "Antibiotics are often used to treat bacterial infections causing mastitis, but they should be prescribed by a veterinarian." },
        { keywords: ["natural", "treatment"], response: "Natural remedies like applying warm compresses to the udder and ensuring proper milking can help manage mild mastitis cases." },
        { keywords: ["types", "mastitis"], response: "There are two main types of mastitis: clinical mastitis, with visible symptoms like swelling, and subclinical mastitis, which shows no obvious signs but affects milk quality." },
        { keywords: ["clinical", "mastitis"], response: "Clinical mastitis shows symptoms like swelling, redness, heat in the udder, and changes in milk consistency or appearance." },
        { keywords: ["subclinical", "mastitis"], response: "Subclinical mastitis is harder to detect as it doesn't show obvious symptoms, but it can be identified through milk testing for somatic cell counts." },
        { keywords: ["diagnosis"], response: "Mastitis can be diagnosed by physical examination, observing milk changes, and lab tests like somatic cell count or bacterial culture." },
        { keywords: ["milk", "testing"], response: "Milk testing for somatic cell count or bacterial culture is commonly used to diagnose mastitis." },
        { keywords: ["complications"], response: "Untreated mastitis can lead to severe udder damage, reduced milk production, or systemic infections that can threaten the cow's life." },
        { keywords: ["milk", "quality"], response: "Mastitis reduces milk quality, leading to clots, discoloration, or a drop in production, making the milk unfit for consumption." },
        { keywords: ["milk", "safety"], response: "Milk from cows with mastitis is not safe for consumption and should be discarded during the treatment period." },
        { keywords: ["animal", "health"], response: "Maintaining overall health through good nutrition, clean living conditions, and regular veterinary check-ups helps prevent diseases like mastitis." },
        { keywords: ["follow-up", "care"], response: "After treating mastitis, ensure complete recovery by continuing good hygiene practices and monitoring the cow's milk and udder health." },
        { keywords: ["what", "mastitis"], response: "Mastitis is a condition where the udder becomes inflamed, usually due to bacterial infection." },
        { keywords: ["how", "treat"], response: "To treat mastitis, contact a veterinarian for appropriate antibiotics and ensure proper milking techniques to relieve udder pressure." },
        { keywords: ["how", "prevent"], response: "Prevent mastitis by maintaining hygiene, proper milking procedures, and regular health checks for cows." },
        { keywords: ["causes", "it"], response: "Mastitis is mainly caused by bacteria entering through the teat canal, poor hygiene, or injuries to the udder." },
        { keywords: [], response: "I'm sorry, I don't understand. Please ask another question." },
    ];

    // Find the best match
    for (let entry of responses) {
        if (entry.keywords.every(keyword => message.includes(keyword))) {
            return entry.response;
        }
    }

    // Default response
    return "I'm sorry, I don't understand. Please ask another question.";
}
