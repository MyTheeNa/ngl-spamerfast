const fetch = require('node-fetch');

async function getUserInputFromAPI() {
    try {
        const response = await fetch('https://pr-apimile.online//nglspam');
        if (!response.ok) {
            throw new Error(`Failed to get user input from API! HTTP error ${response.status}`);
        }
        const userInput = await response.json();
        return userInput;
    } catch (error) {
        console.error("Error getting user input from API:", error);
        throw error;
    }
}

async function sendSpamMessages(username, text, coust, proxy = null) {
    let headers = {
    };

    if (proxy) {
        headers["Proxy-Authorization"] = "Basic " + Buffer.from(proxy).toString('base64');
    }

    const endpoint = "https://ngl.link/api/submit";
    const bodyData = `username=${username}&question=${text}&counts=${coust}&deviceId=3ae2ba54-3502-457b-b2f6-38c4095a10df&gameSlug=&referrer=`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: bodyData
        });

        if (!response.ok) {
            if (response.status === 429 || response.status === 402) {
                console.log("Received 429 or 402 status. Changing proxy and retrying...");
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log("Message sent:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function main() {
    try {
        const userInput = await getUserInputFromAPI();

        const { username, text, coust } = userInput;

        console.log("Starting spam messages...");
        await sendSpamMessages(username, text, coust);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
