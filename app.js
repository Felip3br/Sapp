let squads = [];

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    fetch('players.json')
        .then(response => response.json())
        .then(players => loadPlayers(players));
});

function loadPlayers(players) {
    const container = document.getElementById('players');
    players.forEach(player => {
        const div = document.createElement('div');
        div.className = 'player';
        div.draggable = true;
        div.textContent = player.name;
        div.id = `player-${player.id}`;
        
        div.addEventListener('dragstart', dragStart);
        container.appendChild(div);
    });
}

// Drag and Drop functionality
let draggedItem = null;

function dragStart(e) {
    draggedItem = e.target;
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (e.target.classList.contains('squad')) {
        e.target.appendChild(draggedItem);
    }
}

// Squad management
function addSquad() {
    const squadId = Date.now();
    const squad = {
        id: squadId,
        name: `Squad ${squads.length + 1}`,
        players: []
    };
    squads.push(squad);

    const squadDiv = document.createElement('div');
    squadDiv.className = 'squad';
    squadDiv.innerHTML = `
        <div class="squad-header">
            <input type="text" value="${squad.name}" 
                   onchange="updateSquadName(${squadId}, this.value)">
        </div>
    `;
    squadDiv.addEventListener('dragover', allowDrop);
    squadDiv.addEventListener('drop', drop);
    
    document.getElementById('squads').appendChild(squadDiv);
}

function updateSquadName(id, newName) {
    const squad = squads.find(s => s.id === id);
    if (squad) squad.name = newName;
}

// Export function
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    let yPosition = 20;
    squads.forEach((squad, index) => {
        const players = Array.from(document.querySelectorAll(`#squad-${squad.id} .player`))
                            .map(p => p.textContent);
        
        doc.text(`Squad ${index + 1}: ${squad.name}`, 20, yPosition);
        doc.text(players.join(', '), 20, yPosition + 10);
        yPosition += 30;
    });

    doc.save('squads-export.pdf');
}
