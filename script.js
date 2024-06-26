const board = document.getElementById('board');
const rollDiceButton = document.getElementById('rollDice');
const diceResultDisplay = document.getElementById('diceResult');
const currentPlayerDisplay = document.getElementById('currentPlayer');

let currentPlayer = 1;
let positions = [0, 0, 0, 0];

// Create the board
for (let i = 100; i > 0; i--) {
    const cell = document.createElement('div');
    cell.id = `cell-${i}`;
    cell.textContent = i;
    board.appendChild(cell);
}

const players = [
    { id: 1, class: 'player1' },
    { id: 2, class: 'player2' },
    { id: 3, class: 'player3' },
    { id: 4, class: 'player4' }
];

// Initialize player pieces
players.forEach(player => {
    const piece = document.createElement('div');
    piece.id = `player${player.id}`;
    piece.classList.add('player', player.class);
    document.getElementById('cell-1').appendChild(piece);
});

const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

// Add ladders and snakes to the board
function addSnakesAndLadders() {
    Object.keys(snakes).forEach(start => {
        const snake = document.createElement('div');
        snake.classList.add('snake');
        const startCell = document.getElementById(`cell-${start}`);
        const endCell = document.getElementById(`cell-${snakes[start]}`);
        board.appendChild(snake);
        positionElement(snake, startCell, endCell);
    });

    Object.keys(ladders).forEach(start => {
        const ladder = document.createElement('div');
        ladder.classList.add('ladder');
        const startCell = document.getElementById(`cell-${start}`);
        const endCell = document.getElementById(`cell-${ladders[start]}`);
        board.appendChild(ladder);
        positionElement(ladder, startCell, endCell);
    });
}

function positionElement(element, startCell, endCell) {
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const width = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    element.style.width = `${width}px`;
    element.style.transform = `rotate(${angle}deg)`;
    element.style.transformOrigin = '0 0';
    element.style.position = 'absolute';
    element.style.left = `${startX - board.getBoundingClientRect().left}px`;
    element.style.top = `${startY - board.getBoundingClientRect().top}px`;
}

addSnakesAndLadders();

function movePlayer(player, steps) {
    let newPosition = positions[player - 1] + steps;
    if (newPosition > 100) newPosition = 100;
    if (snakes[newPosition]) {
        newPosition = snakes[newPosition];
    } else if (ladders[newPosition]) {
        newPosition = ladders[newPosition];
    }
    positions[player - 1] = newPosition;

    document.getElementById(`cell-${positions[player - 1]}`).appendChild(document.getElementById(`player${player}`));
}

function nextPlayer() {
    currentPlayer = (currentPlayer % 4) + 1;
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

rollDiceButton.addEventListener('click', () => {
    const dice = Math.floor(Math.random() * 6) + 1;
    diceResultDisplay.textContent = `Dice: ${dice}`;
    movePlayer(currentPlayer, dice);

    if (positions[currentPlayer - 1] === 100) {
        alert(`Player ${currentPlayer} wins!`);
        positions = [0, 0, 0, 0];
        players.forEach(player => {
            document.getElementById('cell-1').appendChild(document.getElementById(`player${player.id}`));
        });
    } else {
        nextPlayer();
    }
});
