// Simple JS for navigation, image upload, and editable text tips
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        button.classList.add('active');
        const sectionId = button.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
        window.scrollTo(0, 0);
    });
});

document.documentElement.style.scrollBehavior = 'smooth';

const imageInputs = document.querySelectorAll('.image-input');
imageInputs.forEach(input => {
    input.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file) return;

        const targetId = input.dataset.target;
        const image = document.getElementById(targetId);
        if (!image) return;

        const reader = new FileReader();
        reader.onload = e => {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
});

const editableFields = document.querySelectorAll('[contenteditable="true"]');
editableFields.forEach(field => {
    field.addEventListener('focus', () => {
        field.dataset.original = field.innerText;
    });

    field.addEventListener('blur', () => {
        if (field.innerText.trim() === '') {
            field.innerText = field.dataset.original || 'Edit this text';
        }
    });
});

const backgroundMusic = document.getElementById('backgroundMusic');
const musicLibrary = document.querySelector('.music-library');
const musicUpload = document.getElementById('musicUpload');

function setTrack(src, item) {
    if (!src || !backgroundMusic) return;
    backgroundMusic.src = src;
    backgroundMusic.load();
    backgroundMusic.play().catch(() => {
        // Autoplay may be blocked; user can press play manually.
    });
    musicLibrary.querySelectorAll('.track-item').forEach(track => track.classList.remove('selected'));
    if (item) item.classList.add('selected');
}

if (musicLibrary) {
    musicLibrary.addEventListener('click', event => {
        const button = event.target.closest('.track-play');
        if (!button) return;
        const trackItem = button.closest('.track-item');
        if (!trackItem) return;
        setTrack(trackItem.dataset.src, trackItem);
    });
}

if (musicUpload) {
    musicUpload.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file) return;

        const audioUrl = URL.createObjectURL(file);
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.dataset.src = audioUrl;
        trackItem.innerHTML = `
            <span class="track-name">${file.name}</span>
            <div class="track-actions">
                <button class="track-play">Play</button>
                <button class="track-delete" title="Delete track">Delete</button>
            </div>
        `;

        musicLibrary.appendChild(trackItem);
        setTrack(audioUrl, trackItem);
    });
}

// Delegate delete and play actions for music library
if (musicLibrary) {
    musicLibrary.addEventListener('click', event => {
        const deleteBtn = event.target.closest('.track-delete');
        if (deleteBtn) {
            const trackItem = deleteBtn.closest('.track-item');
            if (!trackItem) return;
            const src = trackItem.dataset.src;
            // If the deleted track is currently loaded, stop playback and clear source
            if (backgroundMusic && backgroundMusic.src && backgroundMusic.src.includes(src)) {
                backgroundMusic.pause();
                backgroundMusic.removeAttribute('src');
                backgroundMusic.load();
            }
            // Revoke object URL if applicable
            try { if (src && src.startsWith('blob:')) URL.revokeObjectURL(src); } catch (e) {}
            trackItem.remove();
            return;
        }
        const playBtn = event.target.closest('.track-play');
        if (!playBtn) return;
        const trackItem = playBtn.closest('.track-item');
        if (!trackItem) return;
        setTrack(trackItem.dataset.src, trackItem);
    });
}

// Add delete buttons for images next to their upload controls
const imageInputsForDelete = document.querySelectorAll('.image-input');
imageInputsForDelete.forEach(input => {
    const targetId = input.dataset.target;
    if (!targetId) return;
    const fileUploadContainer = input.closest('.file-upload');
    if (!fileUploadContainer) return;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'img-delete';
    delBtn.title = 'Delete image';
    delBtn.innerText = 'Delete';
    fileUploadContainer.appendChild(delBtn);

    delBtn.addEventListener('click', () => {
        const img = document.getElementById(targetId);
        if (!img) return;
        // Clear input value
        try { input.value = ''; } catch (e) {}
        // Set a generic placeholder
        img.src = 'https://via.placeholder.com/400x300?text=No+Photo';
    });
});
