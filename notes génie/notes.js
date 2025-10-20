const matiereSelect = document.getElementById('matiere');
const partieInput = document.getElementById('partieInput');
const addPartieBtn = document.getElementById('addPartieBtn');
const partieSelect = document.getElementById('partieSelect');
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');

let allNotes = JSON.parse(localStorage.getItem('notes') || '{}');

// Sauvegarder dans LocalStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(allNotes));
}

// Mettre à jour la liste des parties dans le select
function updatePartieSelect() {
    partieSelect.innerHTML = '';
    const matiere = matiereSelect.value;
    if(allNotes[matiere]) {
        Object.keys(allNotes[matiere]).forEach(partie => {
            const option = document.createElement('option');
            option.value = partie;
            option.textContent = partie;
            partieSelect.appendChild(option);
        });
    }
    displayNotes();
}

// Afficher toutes les notes
function displayNotes() {
    notesContainer.innerHTML = '';
    const matiere = matiereSelect.value;
    if(!allNotes[matiere]) return;

    for(let partie in allNotes[matiere]) {
        const divPartie = document.createElement('div');
        divPartie.className = 'partie-title';

        const h3 = document.createElement('h3');
        h3.textContent = partie;
        divPartie.appendChild(h3);

        const deletePartieBtn = document.createElement('button');
        deletePartieBtn.textContent = 'Supprimer partie';
        deletePartieBtn.onclick = () => {
            if(confirm(`Supprimer la partie "${partie}" ?`)) {
                delete allNotes[matiere][partie];
                saveNotes();
                updatePartieSelect();
            }
        };
        divPartie.appendChild(deletePartieBtn);
        notesContainer.appendChild(divPartie);

        const ul = document.createElement('ul');
        allNotes[matiere][partie].forEach((note, idx) => {
            const li = document.createElement('li');
            li.className = 'note-item';
            li.textContent = note;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.onclick = () => {
                allNotes[matiere][partie].splice(idx, 1);
                saveNotes();
                displayNotes();
            };

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Modifier';
            editBtn.onclick = () => {
                const newNote = prompt('Modifier la note :', note);
                if(newNote !== null && newNote.trim() !== '') {
                    allNotes[matiere][partie][idx] = newNote.trim();
                    saveNotes();
                    displayNotes();
                }
            };

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });
        notesContainer.appendChild(ul);
    }
}

// Ajouter une partie
addPartieBtn.addEventListener('click', () => {
    const matiere = matiereSelect.value;
    const partie = partieInput.value.trim();
    if(!partie) return alert("Nom de partie vide");
    if(!allNotes[matiere]) allNotes[matiere] = {};
    if(allNotes[matiere][partie]) return alert("Cette partie existe déjà !");
    allNotes[matiere][partie] = [];
    saveNotes();
    partieInput.value = '';
    updatePartieSelect();
});

// Ajouter une note
addNoteBtn.addEventListener('click', () => {
    const matiere = matiereSelect.value;
    const partie = partieSelect.value;
    const note = noteInput.value.trim();
    if(!note) return alert("La note est vide");
    if(!allNotes[matiere][partie]) allNotes[matiere][partie] = [];
    allNotes[matiere][partie].push(note);
    saveNotes();
    noteInput.value = '';
    displayNotes();
});

// Changement de matière
matiereSelect.addEventListener('change', updatePartieSelect);

// Initialisation
updatePartieSelect();
