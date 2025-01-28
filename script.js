// Initial Workout Program Data Structure
const initialWorkoutProgram = {
    Monday: [],
    Tuesday: [
        { name: "Incline Dumbbell Chest Press", reps: [8, 5, 2, 2], muscleGroup: "Chest/Shoulder", weight: '' },
        { name: "Barbell Squats", reps: [8, 5, 2, 2], muscleGroup: "Legs", weight: '' },
        { name: "Machine Barbell Row", reps: [8, 5, 2, 2], muscleGroup: "Back", weight: '' },
        { name: "Overhead Tricep Curl", reps: [8, 5, 2, 2], muscleGroup: "Triceps", weight: '' },
        { name: "Behind-the-Body Cable Biceps Curl", reps: [8, 5, 2, 2], muscleGroup: "Biceps", weight: '' }
    ],
    Wednesday: [],
    Thursday: [
        { name: "Flat Dumbbell Chest Press", reps: [8, 6, 6, 6], muscleGroup: "Chest", weight: '' },
        { name: "Romanian Deadlift", reps: [8, 6, 6, 6], muscleGroup: "Legs/Back", weight: '' },
        { name: "Wide-Bar Cable Lat Pulldown", reps: [8, 6, 6, 6], muscleGroup: "Back", weight: '' },
        { name: "Rear Shoulder Delt Cable Raise", reps: [8, 6, 6, 6], muscleGroup: "Shoulders", weight: '' },
        { name: "Machine Squat", reps: [8, 6, 6, 6], muscleGroup: "Legs", weight: '' }
    ],
    Friday: [],
    Saturday: [
        { name: "Overhead Dumbbell Shoulder Press", reps: [8, 6, 6, 6], muscleGroup: "Shoulders", weight: '' },
        { name: "Dumbbell Lat Row", reps: [8, 6, 6, 6], muscleGroup: "Back", weight: '' },
        { name: "Chest Machine Flys", reps: [8, 6, 6, 6], muscleGroup: "Chest", weight: '' },
        { name: "Overhead Tricep Curl", reps: [8, 5, 2, 2], muscleGroup: "Triceps", weight: '' },
        { name: "Behind-the-Body Cable Biceps Curl", reps: [8, 5, 2, 2], muscleGroup: "Biceps", weight: '' }
    ],
    Sunday: [
        { name: "Incline Dumbbell Chest Press", reps: [8, 5, 2, 2], muscleGroup: "Chest/Shoulder", optional: true, weight: '' },
        { name: "Seated Leg Extension", reps: [8, 6, 6, 6], muscleGroup: "Legs", weight: '' },
        { name: "Calf Raises", reps: [8, 6, 6, 6], muscleGroup: "Legs", weight: '' },
        { name: "Rear Machine Flys", reps: [8, 6, 6, 6], muscleGroup: "Shoulders/Back", weight: '' }
    ]
};

let workoutProgram = JSON.parse(JSON.stringify(initialWorkoutProgram));
let savedPlans = {};
let editMode = false;

// Handle keyboard visibility
function handleKeyboard() {
    // Add blur event listeners to all input fields
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            // Small delay to ensure the keyboard has time to hide
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        });

        // Handle keyboard done/return button
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    });
}

// Mobile-friendly modal handling
function handleModalTouch(e) {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        e.preventDefault();
        modal.style.display = 'none';
    }
}

// Update the modal handling
function handleModalOpen() {
    const modal = document.getElementById('editModal');
    const modalContent = modal.querySelector('.modal-content');

    // Scroll to top when modal opens
    modal.style.display = 'block';
    modalContent.scrollTop = 0;

    // Focus on first input after modal animation
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

// Touch-optimized exercise item handling
function handleExerciseTouch(e) {
    if (!editMode) return;

    const exerciseItem = e.target.closest('.exercise-item.edit-mode');
    const deleteBtn = e.target.closest('.delete-exercise');

    if (exerciseItem && !deleteBtn) {
        e.preventDefault();
        openEditModal(exerciseItem);
    }
}

// Modal functions
window.openEditModal = function(element) {
    const day = element.dataset.day;
    const index = parseInt(element.dataset.index);
    const exercise = workoutProgram[day][index];

    document.getElementById('exerciseName').value = exercise.name;
    document.getElementById('muscleGroup').value = exercise.muscleGroup;
    document.getElementById('repScheme').value = exercise.reps.join(',');
    document.getElementById('exerciseWeight').value = exercise.weight;
    document.getElementById('editDay').value = day;
    document.getElementById('editIndex').value = index;

    handleModalOpen();
};

window.openAddModal = function(day) {
    document.getElementById('exerciseName').value = '';
    document.getElementById('muscleGroup').value = '';
    document.getElementById('repScheme').value = '';
    document.getElementById('exerciseWeight').value = '';
    document.getElementById('editDay').value = day;
    document.getElementById('editIndex').value = -1;

    handleModalOpen();
};

// Modernized render function
function renderWorkouts() {
    const workoutGrid = document.querySelector('.workout-grid');
    workoutGrid.innerHTML = '';

    Object.entries(workoutProgram).forEach(([day, exercises]) => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        dayCard.innerHTML = `
            <div class="day-header">
                <h2>${day}</h2>
                ${
                    editMode
                        ? `<button class="icon-button" onclick="openAddModal('${day}')">
                            <i class="fas fa-plus"></i>
                            <span>Add</span>
                           </button>`
                        : ''
                }
            </div>
            <div class="exercise-list">
                ${
                    exercises.length
                        ? exercises
                            .map((exercise, index) => `
                                <div class="exercise-item
                                    ${editMode ? 'edit-mode' : ''}
                                    ${exercise.optional ? 'optional' : ''}"
                                    data-day="${day}"
                                    data-index="${index}">
                                    ${editMode ? `<button class="delete-exercise">&times;</button>` : ''}
                                    <div class="exercise-name">${exercise.name}</div>
                                    <div class="exercise-details">
                                        <span>${exercise.muscleGroup}</span>
                                        <span>${exercise.reps.join('-')}</span>
                                        ${
                                            exercise.weight
                                                ? `<span>${exercise.weight} kg</span>`
                                                : ''
                                        }
                                    </div>
                                </div>
                            `)
                            .join('')
                        : `<div class="empty-state">
                            ${editMode ? 'Tap + to add exercise' : 'No exercises'}
                           </div>`
                }
            </div>
        `;

        workoutGrid.appendChild(dayCard);
    });
}

function updateSavedPlansDisplay() {
    const loadPlanSelect = document.getElementById('loadPlan');
    loadPlanSelect.innerHTML = '<option value="">Select a plan</option>';
    Object.keys(savedPlans).forEach(planName => {
        const option = document.createElement('option');
        option.value = planName;
        option.textContent = planName;
        loadPlanSelect.appendChild(option);
    });
}

function deletePlan() {
    const loadPlanSelect = document.getElementById('loadPlan');
    const planName = loadPlanSelect.value;
    if (planName && savedPlans[planName]) {
        if (confirm(`Are you sure you want to delete the plan "${planName}"?`)) {
            delete savedPlans[planName];
            localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
            updateSavedPlansDisplay();
            loadPlanSelect.value = '';
        }
    }
}

// Initialize with touch event listeners
function init() {
    const modal = document.getElementById('editModal');
    const editModeToggle = document.getElementById('editModeToggle');
    const closeModal = document.querySelector('.close-modal');
    const editForm = document.getElementById('editForm');
    const resetButton = document.getElementById('resetWorkouts');
    const savePlanName = document.getElementById('savePlanName');
    const savePlanBtn = document.getElementById('savePlan');
    const loadPlanSelect = document.getElementById('loadPlan');
    const deletePlanBtn = document.getElementById('deletePlan');
    const workoutGrid = document.querySelector('.workout-grid');

    // Load saved data
    if (localStorage.getItem('workoutProgram')) {
        workoutProgram = JSON.parse(localStorage.getItem('workoutProgram'));
    }
    if (localStorage.getItem('savedPlans')) {
        savedPlans = JSON.parse(localStorage.getItem('savedPlans'));
        updateSavedPlansDisplay();
    }

    // Initialize keyboard handling
    handleKeyboard();

    // Add touch and click event listeners
    document.addEventListener('touchstart', handleExerciseTouch);
    document.addEventListener('click', handleExerciseTouch);
    modal.addEventListener('touchstart', handleModalTouch);
    modal.addEventListener('click', handleModalTouch);

    editModeToggle.addEventListener('click', function() {
        editMode = !editMode;
        this.classList.toggle('active');
        renderWorkouts();
    });

    workoutGrid.addEventListener('click', function(e) {
        if (!editMode) return;

        const deleteBtn = e.target.closest('.delete-exercise');
        if (deleteBtn) {
            const item = deleteBtn.closest('.exercise-item');
            const day = item.dataset.day;
            const index = parseInt(item.dataset.index);
            workoutProgram[day].splice(index, 1);
            localStorage.setItem('workoutProgram', JSON.stringify(workoutProgram));
            renderWorkouts();
        }
    });

    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset to the default workout program?')) {
            workoutProgram = JSON.parse(JSON.stringify(initialWorkoutProgram));
            localStorage.setItem('workoutProgram', JSON.stringify(workoutProgram));
            renderWorkouts();
        }
    });

    savePlanBtn.addEventListener('click', () => {
        const planName = savePlanName.value.trim();
        if (planName) {
            if (savedPlans[planName] && !confirm(
                `A plan named "${planName}" already exists. Overwrite it?`
            )) {
                return;
            }
            savedPlans[planName] = JSON.parse(JSON.stringify(workoutProgram));
            localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
            savePlanName.value = '';
            updateSavedPlansDisplay();
            savePlanName.blur(); // Hide keyboard after saving
        }
    });

    loadPlanSelect.addEventListener('change', (e) => {
        const planName = e.target.value;
        if (planName && savedPlans[planName]) {
            workoutProgram = JSON.parse(JSON.stringify(savedPlans[planName]));
            localStorage.setItem('workoutProgram', JSON.stringify(workoutProgram));
            renderWorkouts();
            loadPlanSelect.blur(); // Hide keyboard after loading
        }
    });

    deletePlanBtn.addEventListener('click', deletePlan);

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        // Ensure keyboard is hidden when closing modal
        document.activeElement.blur();
    });

    editForm.addEventListener('submit', e => {
        e.preventDefault();

        const day = document.getElementById('editDay').value;
        const index = parseInt(document.getElementById('editIndex').value);
        const exercise = {
            name: document.getElementById('exerciseName').value,
            muscleGroup: document.getElementById('muscleGroup').value,
            reps: document
                .getElementById('repScheme')
                .value.split(',')
                .map(Number),
            weight: document.getElementById('exerciseWeight').value.trim(),
            optional: false
        };

        if (index === -1) {
            workoutProgram[day].push(exercise);
        } else {
            // Preserve the "optional" status if it existed
            exercise.optional = workoutProgram[day][index].optional;
            workoutProgram[day][index] = exercise;
        }

        localStorage.setItem('workoutProgram', JSON.stringify(workoutProgram));
        renderWorkouts();
        
        // Hide keyboard and modal
        document.activeElement.blur();
        modal.style.display = 'none';
        window.scrollTo(0, 0);
    });

    renderWorkouts();
}

document.addEventListener('DOMContentLoaded', init);