// ===== DYNAMIC HEADER SPACING =====
function updateHeaderSpacing() {
    const header = document.getElementById('main-header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
}

// ===== AUDIO ENGINE (TONE.JS) =====
const AudioEngine = {
    sampler: null,
    isReady: false,
    isStarted: false,

    // Note frequencies for C major scale (one octave)
    noteFrequencies: {
        'C': 'C4',
        'D': 'D4',
        'E': 'E4',
        'F': 'F4',
        'G': 'G4',
        'A': 'A4',
        'B': 'B4',
        'C2': 'C5'
    },

    // Start Tone.js context (must be called from user gesture)
    async start() {
        if (this.isStarted) return true;
        try {
            await Tone.start();
            this.isStarted = true;
            console.log('🎵 Tone.js started!');
            return true;
        } catch (err) {
            console.error('Tone.js start failed:', err);
            return false;
        }
    },

    // Initialize - load the sampler
    async init() {
        if (this.isReady) return true;

        try {
            // Start audio context first
            await this.start();

            // Create a sampler with the pad sound mapped to C4
            this.sampler = new Tone.Sampler({
                'C4': 'static/audio/pads/Pad_02.mp3'
            }, {
                release: 1,
                onload: () => {
                    console.log('🎵 Tone.js sampler loaded!');
                }
            }).toDestination();

            // Wait for the sampler to load
            await Tone.loaded();
            this.isReady = true;
            console.log('🎵 Audio ready!');
            return true;
        } catch (err) {
            console.error('Audio init failed:', err);
            return false;
        }
    },

    // Play note
    play(note) {
        // Ensure Tone is started (handles mobile unlock)
        if (!this.isStarted) {
            this.init().then(() => this.play(note));
            return;
        }

        if (!this.isReady || !this.sampler) {
            this.init().then(() => {
                if (this.isReady) this.play(note);
            });
            return;
        }

        const freq = this.noteFrequencies[note] || 'C4';
        this.sampler.triggerAttackRelease(freq, '0.8');
    }
};

// Play note and show photo - SYNCHRONOUS (no async/await)
function playNote(note) {
    AudioEngine.play(note);
    showRandomPhoto();
}

// ===== PHOTO HANDLING =====
let photoList = [];

// Discover photos dynamically
async function discoverPhotos() {
    // For static hosting, we'll try loading photos sequentially
    const photos = [];
    let i = 1;

    while (true) {
        const img = new Image();
        const path = `static/img/photos/foto${i}.jpeg`;

        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = path;
            });
            photos.push(path);
            i++;
        } catch {
            break;
        }

        // Safety limit
        if (i > 50) break;
    }

    photoList = photos;
    return photos;
}

// Show random photo in synth output
function showRandomPhoto() {
    if (photoList.length === 0) return;

    const output = document.getElementById('synth-output');
    const randomIndex = Math.floor(Math.random() * photoList.length);
    const randomRotation = (Math.random() - 0.5) * 10; // -5 to 5 degrees

    output.innerHTML = `<img src="${photoList[randomIndex]}" alt="nohub live" style="--rotation: ${randomRotation}deg">`;
}

// Build photo gallery
function buildGallery() {
    const collage = document.getElementById('photo-collage');
    if (!collage || photoList.length === 0) return;

    collage.innerHTML = '';

    photoList.forEach((photo, index) => {
        const rotation = (Math.random() - 0.5) * 16; // -8 to 8 degrees
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.style.setProperty('--rotation', `${rotation}deg`);
        item.innerHTML = `<img src="${photo}" alt="nohub photo ${index + 1}" loading="lazy">`;

        // Click to trigger sound
        item.addEventListener('click', () => {
            const notes = Object.keys(AudioEngine.noteRatios);
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            playNote(randomNote);
        });

        collage.appendChild(item);
    });
}

// ===== VIDEO HANDLING =====
async function discoverVideos() {
    // For static hosting, we'll try known video files
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    // Try to load all videos from a manifest (generated from /static/video/snippets)
    const manifestPath = 'static/video/snippets/manifest.json';
    let manifestVideos = [];

    try {
        const response = await fetch(manifestPath, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                manifestVideos = data;
            } else if (Array.isArray(data.videos)) {
                manifestVideos = data.videos;
            }
        }
    } catch {
        // Manifest missing or invalid
    }

    const knownVideos = [
        'static/video/snippets/17928417269449838.mp4',
        'static/video/snippets/17950885012914153.mp4'
    ];

    const normalizePath = (p) => {
        if (!p) return null;
        if (p.startsWith('static/')) return p;
        return `static/video/snippets/${p}`;
    };

    const candidates = (manifestVideos.length ? manifestVideos : knownVideos)
        .map(normalizePath)
        .filter((p) => p && p.endsWith('.mp4'));

    let validVideos = [];

    if (manifestVideos.length) {
        validVideos = candidates;
    } else {
        for (const videoPath of candidates) {
            try {
                const response = await fetch(videoPath, { method: 'HEAD' });
                if (response.ok) {
                    validVideos.push(videoPath);
                }
            } catch {
                // Video doesn't exist
            }
        }
    }

    if (validVideos.length === 0) {
        videoGrid.innerHTML = '<p style="opacity: 0.5">Video snippets coming soon...</p>';
        return;
    }

    videoGrid.innerHTML = '';

    validVideos.forEach((videoPath, index) => {
        const rotation = (Math.random() - 0.5) * 6; // -3 to 3 degrees
        const item = document.createElement('div');
        item.className = 'video-item';
        item.style.setProperty('--rotation', `${rotation}deg`);

        const video = document.createElement('video');
        video.src = videoPath;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';

        // Generate thumbnail from first frame
        video.addEventListener('loadeddata', () => {
            video.currentTime = 0.5; // Seek to 0.5s for better thumbnail
        });
        video.addEventListener('seeked', () => {
            // Create canvas to capture frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            video.poster = canvas.toDataURL('image/jpeg', 0.8);
            video.currentTime = 0; // Reset to start
        }, { once: true });

        // Unmute button
        const unmuteBtn = document.createElement('button');
        unmuteBtn.className = 'unmute-btn';
        unmuteBtn.innerHTML = '🔇';
        unmuteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            unmuteBtn.innerHTML = video.muted ? '🔇' : '🔊';
        });

        // Play on hover
        item.addEventListener('mouseenter', () => video.play());
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

        // Click for fullscreen with sound
        video.addEventListener('click', () => {
            video.muted = false;
            unmuteBtn.innerHTML = '🔊';
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        });

        item.appendChild(video);
        item.appendChild(unmuteBtn);
        videoGrid.appendChild(item);
    });

    setupVideoCarousel();
}

// ===== DATES HANDLING =====
async function discoverDates() {
    const list = document.getElementById('dates-list');
    if (!list) return;

    const manifestPath = 'dates/manifest.json';
    let files = [];

    try {
        const response = await fetch(manifestPath, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                files = data;
            } else if (Array.isArray(data.dates)) {
                files = data.dates;
            }
        }
    } catch {
        // Manifest missing or invalid
    }

    if (!files.length) return;

    const entries = [];

    for (const file of files) {
        const path = file.startsWith('dates/') ? file : `dates/${file}`;
        try {
            const response = await fetch(path, { cache: 'no-store' });
            if (!response.ok) continue;
            const data = await response.json();
            entries.push(data);
        } catch {
            // Skip invalid entry
        }
    }

    if (!entries.length) return;

    entries.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    list.innerHTML = '';

    entries.forEach((entry) => {
        const item = document.createElement('li');
        const when = entry.when || entry.date || 'TBA';
        const where = entry.where || entry.city || entry.location || '';
        const floor = entry.floor || entry.venue || '';
        const time = entry.time || entry.note || '';

        const parts = [
            when ? `When: ${when}` : '',
            where ? `Where: ${where}` : '',
            floor ? `Floor: ${floor}` : '',
            time ? `Time: ${time}` : ''
        ].filter(Boolean).join(' · ');

        if (entry.link) {
            item.innerHTML = `<a href="${entry.link}" target="_blank" rel="noopener">${parts}</a>`;
        } else {
            item.textContent = parts;
        }

        list.appendChild(item);
    });
}


function setupVideoCarousel() {
    const grid = document.getElementById('video-grid');
    const prev = document.querySelector('.carousel-arrow.prev');
    const next = document.querySelector('.carousel-arrow.next');
    if (!grid || !prev || !next) return;

    const scrollToItem = (direction) => {
        const items = Array.from(grid.querySelectorAll('.video-item'));
        if (!items.length) return;

        const gridRect = grid.getBoundingClientRect();
        const center = grid.scrollLeft + gridRect.width / 2;

        let currentIndex = 0;
        let minDist = Infinity;

        items.forEach((item, idx) => {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const dist = Math.abs(itemCenter - center);
            if (dist < minDist) {
                minDist = dist;
                currentIndex = idx;
            }
        });

        const targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
        const target = items[targetIndex];
        const left = target.offsetLeft - (gridRect.width - target.offsetWidth) / 2;

        grid.scrollTo({ left, behavior: 'smooth' });
    };

    prev.onclick = () => scrollToItem(-1);
    next.onclick = () => scrollToItem(1);
}

// ===== KEYBOARD SETUP =====
function setupKeyboard() {
    const bars = document.querySelectorAll('.bar');

    bars.forEach(bar => {
        const note = bar.dataset.note;

        // Click - SYNCHRONOUS (no async)
        bar.addEventListener('click', () => {
            playNote(note);
            bar.classList.add('pressed');
            setTimeout(() => bar.classList.remove('pressed'), 150);
        });

        // Touch - SYNCHRONOUS (no async)
        bar.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playNote(note);
            bar.classList.add('pressed');
        }, { passive: false });

        bar.addEventListener('touchend', () => {
            bar.classList.remove('pressed');
        });
    });

    // Computer keyboard support (C major scale)
    const keyMap = {
        'a': 'C', 's': 'D', 'd': 'E', 'f': 'F',
        'g': 'G', 'h': 'A', 'j': 'B', 'k': 'C2'
    };

    document.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        const note = keyMap[e.key.toLowerCase()];
        if (note) {
            playNote(note);
            const barEl = document.querySelector(`[data-note="${note}"]`);
            if (barEl) {
                barEl.classList.add('pressed');
                setTimeout(() => barEl.classList.remove('pressed'), 150);
            }
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    // Update header spacing
    updateHeaderSpacing();

    // Setup synth keyboard
    setupKeyboard();

    // Discover and display photos
    await discoverPhotos();
    buildGallery();

    // Discover and display videos
    await discoverVideos();

    // Discover and display dates
    await discoverDates();

    // Initialize audio on first user interaction (required by browsers)
    // After this, all subsequent plays are instant (synchronous)
    const initAudio = () => {
        AudioEngine.init();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
        document.removeEventListener('keydown', initAudio);
    };
    document.addEventListener('click', initAudio, { once: false });
    document.addEventListener('touchstart', initAudio, { once: false });
    document.addEventListener('keydown', initAudio, { once: false });
});

// Update header spacing on window resize
window.addEventListener('resize', updateHeaderSpacing);
