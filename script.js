const sentences = [
    "The early bird catches the worm, but the second mouse gets the cheese.",
    "A rolling stone gathers no moss, but it gains a certain polish.",
    "A stitch in time saves nine, but a procrastinator's work is never done.",
    "An ounce of prevention is worth a pound of cure, but hindsight is always 20/20.",
    "Beauty is in the eye of the beholder, but ugliness is universal.",
    "Better to remain silent and be thought a fool than to speak and remove all doubt.",
    "Discretion is the better part of valor, but fortune favors the bold.",
    "Fools rush in where angels fear to tread, but he who hesitates is lost.",
    "He who laughs last laughs best, but laughter is the best medicine.",
    "If you can't stand the heat, get out of the kitchen, but if you can't take the heat, stay out of the fire.",
    "The road to hell is paved with good intentions, but the path to heaven is paved with good deeds."
];

let startTime; // Variable to store the start time of the typing test
let timerInterval; // Variable to store the interval for the timer
let currentSentence; // Variable to store the current sentence to be typed
let leaderboard = []; // Array to store the results of all participants
let mode = 'individual'; // Variable to store the current mode (individual or competition)
let participants = []; // Array to store the input elements for participants
let currentParticipantIndex = 0; // Variable to store the index of the current participant

// DOM elements
const sentenceElement = document.getElementById('sentence');
const inputElement = document.getElementById('input');
const resultsElement = document.getElementById('results');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const leaderboardElement = document.getElementById('leaderboard');
const userForm = document.getElementById('userForm');
const participantsContainer = document.getElementById('participants');
const numParticipantsGroup = document.getElementById('numParticipantsGroup');
const numParticipantsSelect = document.getElementById('numParticipants');
const individualModeButton = document.getElementById('individualMode');
const competitionModeButton = document.getElementById('competitionMode');
const currentParticipantDiv = document.getElementById('currentParticipant');
const currentParticipantName = document.getElementById('currentParticipantName');
const startTypingButton = document.getElementById('startTypingButton');
const displayResultsButton = document.getElementById('displayResultsButton');
const fireworksContainer = document.getElementById('fireworks');
const nextParticipantMessage = document.getElementById('nextParticipantMessage');
const nextParticipantName = document.getElementById('nextParticipantName');

// Function to display a random sentence
function displayRandomSentence() {
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    sentenceElement.textContent = currentSentence;
}

// Function to start the typing test
function startTypingTest() {
    inputElement.value = ''; // Clear the input field
    resultsElement.textContent = ''; // Clear the results
    timerElement.textContent = '0'; // Reset the timer
    accuracyElement.textContent = '100'; // Reset the accuracy
    displayRandomSentence(); // Display a random sentence
    startTime = new Date().getTime(); // Record the start time
    timerInterval = setInterval(updateTimer, 1000); // Start the timer
    inputElement.disabled = false; // Enable the input field
    inputElement.focus(); // Focus on the input field
}

// Function to update the timer
function updateTimer() {
    const currentTime = new Date().getTime();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    timerElement.textContent = timeElapsed;
}

// Function to calculate the results
function calculateResults() {
    clearInterval(timerInterval); // Stop the timer
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000; // Calculate the time taken
    const typedText = inputElement.value;
    const accuracy = calculateAccuracy(typedText, currentSentence); // Calculate the accuracy

    const result = {
        name: participants[currentParticipantIndex].value,
        time: timeTaken.toFixed(2),
        accuracy: accuracy.toFixed(2),
        score: calculateScore(timeTaken, accuracy), // Calculate the final score
        category: getCategory(calculateScore(timeTaken, accuracy)) // Get the category based on the score
    };

    leaderboard.push(result); // Add the result to the leaderboard

    if (mode === 'individual') {
        displayResults(result); // Display the results
        inputElement.disabled = true; // Disable the input field
    } else if (currentParticipantIndex === participants.length - 1) {
        updateLeaderboard(); // Update the leaderboard
        displayResults(result); // Display the results
        inputElement.disabled = true; // Disable the input field
        displayResultsButton.style.display = 'block'; // Show the display results button
    } else {
        displayResults(result); // Display the results
        currentParticipantIndex++; // Move to the next participant
        inputElement.value = ''; // Clear the input field
        inputElement.disabled = true; // Disable the input field
        setTimeout(() => {
            nextParticipantName.textContent = participants[currentParticipantIndex].value;
            nextParticipantMessage.style.display = 'block'; // Show the next participant message
            setTimeout(() => {
                nextParticipantMessage.style.display = 'none'; // Hide the next participant message
                currentParticipantName.textContent = participants[currentParticipantIndex].value;
                currentParticipantDiv.style.display = 'block'; // Show the current participant div
                inputElement.disabled = false; // Enable the input field for the next participant
                inputElement.focus(); // Focus on the input field for the next participant
            }, 2000); // Display the message for 2 seconds
        }, 1000);
    }
}

// Function to calculate the accuracy
function calculateAccuracy(typedText, originalText) {
    // Trim extra spaces and make the comparison case-insensitive
    typedText = typedText.trim();
    originalText = originalText.trim();

    // Split the texts into words
    const typedWords = typedText.split(/\s+/);
    const originalWords = originalText.split(/\s+/);

    // Calculate word-level accuracy
    const maxLength = Math.max(typedWords.length, originalWords.length);
    let correctWords = 0;

    for (let i = 0; i < maxLength; i++) {
        if (typedWords[i] === originalWords[i]) {
            correctWords++;
        }
    }

    // Calculate space-level accuracy
    const typedSpaces = typedText.split('').filter(char => char === ' ').length;
    const originalSpaces = originalText.split('').filter(char => char === ' ').length;
    const correctSpaces = Math.min(typedSpaces, originalSpaces);

    // Calculate overall accuracy as the average of word and space accuracy
    const wordAccuracy = (correctWords / maxLength) * 100;
    const spaceAccuracy = (correctSpaces / originalSpaces) * 100;
    return (wordAccuracy + spaceAccuracy) / 2;
}

// Function to calculate the final score
function calculateScore(time, accuracy) {
    const timeScore = (1 / time) * 100; // Inverse of time to give higher score for lower time
    return (timeScore * 0.5) + (accuracy * 0.5); // 50% time and 50% accuracy
}

// Function to get the category based on the score
function getCategory(score) {
    if (score >= 90) {
        return 'Excellent';
    } else if (score >= 75) {
        return 'Good';
    } else if (score >= 50) {
        return 'Average';
    } else if (score >= 25) {
        return 'Poor';
    } else {
        return 'Bad';
    }
}

// Function to update the leaderboard
function updateLeaderboard() {
    leaderboardElement.innerHTML = ''; // Clear the leaderboard
    leaderboard.sort((a, b) => b.score - a.score); // Sort the leaderboard by score
    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score.toFixed(2)} points (Accuracy: ${entry.accuracy}%, Time: ${entry.time} seconds, Category: ${entry.category})`;
        leaderboardElement.appendChild(listItem);
    });
}

// Function to display the results
function displayResults(...results) {
    resultsElement.innerHTML = results.map(result => `
        <div class="alert alert-info">
            <p>${result.name}</p>
            <p>Time taken: ${result.time} seconds</p>
            <p>Accuracy: ${result.accuracy}%</p>
            <p>Score: ${result.score.toFixed(2)} points</p>
            <p>Category: ${result.category}</p>
        </div>
    `).join('');
}

// Function to generate input fields for participants
function generateParticipantFields(numParticipants) {
    participantsContainer.innerHTML = ''; // Clear the participants container
    for (let i = 1; i <= numParticipants; i++) {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'form-group';
        participantDiv.innerHTML = `<input type="text" class="form-control" id="username${i}" placeholder="Enter participant ${i}'s name" required>`;
        participantsContainer.appendChild(participantDiv);
    }
    participants = Array.from(participantsContainer.getElementsByTagName('input'));
}

// Function to display the winner
function displayWinner() {
    const winner = leaderboard[0];
    resultsElement.innerHTML = `
        <div class="alert alert-success">
            <h2>The winner is ${winner.name} with ${winner.score.toFixed(2)} points (Accuracy: ${winner.accuracy}%, Time: ${winner.time} seconds, Category: ${winner.category})!</h2>
        </div>
    `;
    startFireworks(); // Start the fireworks
}

// Function to start the fireworks
function startFireworks() {
    const fireworks = new Fireworks(fireworksContainer, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        trace: 3,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
            min: 0,
            max: 360
        },
        delay: {
            min: 30,
            max: 60
        },
        rocketsPoint: {
            min: 50,
            max: 50
        },
        lineWidth: {
            explosion: {
                min: 1,
                max: 3
            },
            trace: {
                min: 1,
                max: 2
            }
        },
        brightness: {
            min: 50,
            max: 80
        },
        decay: {
            min: 0.015,
            max: 0.03
        },
        mouse: {
            click: false,
            move: false,
            max: 1
        }
    });
    fireworks.start(); // Start the fireworks
    setTimeout(() => fireworks.stop(), 5000); // Stop the fireworks after 5 seconds
}

// Function to reset the state
function resetState() {
    clearInterval(timerInterval); // Clear the timer interval
    inputElement.value = ''; // Clear the input field
    resultsElement.textContent = ''; // Clear the results
    timerElement.textContent = '0'; // Reset the timer
    accuracyElement.textContent = '100'; // Reset the accuracy
    leaderboard = []; // Clear the leaderboard
    leaderboardElement.innerHTML = ''; // Clear the leaderboard display
    displayResultsButton.style.display = 'none'; // Hide the display results button
    currentParticipantDiv.style.display = 'none'; // Hide the current participant div
    nextParticipantMessage.style.display = 'none'; // Hide the next participant message
    inputElement.disabled = true; // Disable the input field
}

// Event listener for input field to update accuracy in real-time
inputElement.addEventListener('input', () => {
    const typedText = inputElement.value;
    const accuracy = calculateAccuracy(typedText, currentSentence);
    accuracyElement.textContent = accuracy.toFixed(2);
});

// Event listener for Enter key to calculate results
inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        calculateResults();
    }
});

// Event listener for form submission to start the test
userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    currentParticipantIndex = 0;
    currentParticipantName.textContent = participants[currentParticipantIndex].value;
    currentParticipantDiv.style.display = 'block';
});

// Event listener for start typing button to start the test
startTypingButton.addEventListener('click', () => {
    currentParticipantDiv.style.display = 'none';
    startTypingTest();
});

// Event listener for individual mode button
individualModeButton.addEventListener('click', () => {
    resetState(); // Reset the state
    mode = 'individual';
    userForm.style.display = 'block';
    numParticipantsGroup.style.display = 'none';
    generateParticipantFields(1);
});

// Event listener for competition mode button
competitionModeButton.addEventListener('click', () => {
    resetState(); // Reset the state
    mode = 'competition';
    userForm.style.display = 'block';
    numParticipantsGroup.style.display = 'block';
    generateParticipantFields(numParticipantsSelect.value);
});

// Event listener for number of participants dropdown
numParticipantsSelect.addEventListener('change', (event) => {
    generateParticipantFields(event.target.value);
});

// Event listener for display results button
displayResultsButton.addEventListener('click', displayWinner);

// Disable the input field on page load
window.onload = () => {
    inputElement.disabled = true;
};