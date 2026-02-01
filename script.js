// ===== AUDIO ENGINE (INSTANT PLAYBACK) =====
const AudioEngine = {
    context: null,
    buffer: null,
    isReady: false,
    initPromise: null,

    // Semitone ratios for pitch shifting (C major scale)
    noteRatios: {
        'C': 1.0,
        'D': 1.122,
        'E': 1.26,
        'F': 1.335,
        'G': 1.498,
        'A': 1.682,
        'B': 1.888,
        'C2': 2.0
    },

    // Initialize everything - call on first user interaction
    init() {
        if (this.initPromise) return this.initPromise;
        
        this.initPromise = (async () => {
            try {
                // Create audio context
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) {
                    console.error('Web Audio API not supported');
                    return false;
                }
                
                this.context = new AudioContextClass();
                
                // Resume if suspended (required on iOS/Safari)
                if (this.context.state === 'suspended') {
                    await this.context.resume();
                }

                // Fetch and decode audio
                const response = await fetch('static/audio/pads/Pad_02.mp3');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const arrayBuffer = await response.arrayBuffer();
                this.buffer = await this.context.decodeAudioData(arrayBuffer);
                
                this.isReady = true;
                console.log('🎵 Audio ready!');
                return true;
            } catch (err) {
                console.error('Audio init failed:', err);
                this.initPromise = null; // Allow retry
                return false;
            }
        })();
        
        return this.initPromise;
    },

    // Play note - SYNCHRONOUS when ready (no async overhead)
    play(note) {
        if (!this.isReady || !this.buffer || !this.context) {
            // Not ready yet - initialize and play after
            this.init().then(() => this.play(note));
            return;
        }

        // Resume context if it got suspended (e.g., tab backgrounded)
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        try {
            const source = this.context.createBufferSource();
            const gain = this.context.createGain();

            source.buffer = this.buffer;
            source.playbackRate.value = this.noteRatios[note] || 1.0;

            source.connect(gain);
            gain.connect(this.context.destination);

            // Envelope for smooth attack/release
            const now = this.context.currentTime;
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            source.start(0);
            source.stop(now + 0.9);
        } catch (err) {
            console.error('Playback error:', err);
        }
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

    // Try to load videos from snippets folder
    const knownVideos = [
        'static/video/snippets/17928417269449838.mp4',
        'static/video/snippets/17950885012914153.mp4'
    ];

    const validVideos = [];

    for (const videoPath of knownVideos) {
        try {
            const response = await fetch(videoPath, { method: 'HEAD' });
            if (response.ok) {
                validVideos.push(videoPath);
            }
        } catch {
            // Video doesn't exist
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
    // Setup synth keyboard
    setupKeyboard();

    // Discover and display photos
    await discoverPhotos();
    buildGallery();

    // Discover and display videos
    await discoverVideos();

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
