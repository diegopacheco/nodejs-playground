document.addEventListener('DOMContentLoaded', () => {
  const audio = document.querySelector('audio');
  const button = document.querySelector('button');
  const volumeSlider = document.querySelector('.volume');
  const spaceImage = document.getElementById('spaceImage');

  let imageInterval;
  let isAudioReady = false;

  if (!audio || !button || !volumeSlider || !spaceImage) {
      console.error("Initialization Error: One or more HTML elements are missing.");
      alert("Error: Essential page elements are missing. Check the console.");
      return;
  }

  function generateSpaceImage() {
      try {
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          const spaceColors = [
              ['#0a0a23', '#1a1a3e'], ['#1e3c72', '#2a5298'], ['#4b0082', '#8a2be2'],
              ['#000000', '#434343'], ['#2c1810', '#8b4513']
          ];
          const colorPair = spaceColors[Math.floor(Math.random() * spaceColors.length)];
          const gradient = ctx.createLinearGradient(0, 0, 400, 300);
          gradient.addColorStop(0, colorPair[0]);
          gradient.addColorStop(1, colorPair[1]);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 300);
          ctx.fillStyle = 'white';
          for (let i = 0; i < 50; i++) {
              const x = Math.random() * 400; const y = Math.random() * 300;
              const size = Math.random() * 2 + 0.5;
              ctx.beginPath(); ctx.arc(x, y, size, 0, 2 * Math.PI); ctx.fill();
          }
          const planetCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < planetCount; i++) {
              const x = Math.random() * 400; const y = Math.random() * 300;
              const radius = Math.random() * 30 + 10;
              const planetColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
              ctx.fillStyle = planetColors[Math.floor(Math.random() * planetColors.length)];
              ctx.beginPath(); ctx.arc(x, y, radius, 0, 2 * Math.PI); ctx.fill();
          }
          return canvas.toDataURL();
      } catch (error) {
          console.error('Error generating image:', error);
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      }
  }

  function changeImage() {
      spaceImage.style.opacity = '0';
      setTimeout(() => {
          spaceImage.src = generateSpaceImage();
          spaceImage.style.opacity = '1';
      }, 250);
  }

  audio.addEventListener('canplay', () => {
      console.log('Audio is ready to play.');
      isAudioReady = true;
      button.disabled = false;
      button.textContent = 'Play';
  });

  audio.addEventListener('error', (e) => {
      console.error('Audio Error:', e);
      let errorMsg = "Failed to load audio. Ensure 'sound.mp3' is valid and in the correct path.";
      if (audio.error) {
          switch (audio.error.code) {
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: errorMsg = "Audio format or source not supported."; break;
              case MediaError.MEDIA_ERR_NETWORK: errorMsg = "Network error loading audio."; break;
              case MediaError.MEDIA_ERR_DECODE: errorMsg = "Error decoding audio file."; break;
          }
      }
      alert(`Audio Error: ${errorMsg}`);
      button.textContent = 'Audio Error';
      button.disabled = true;
      isAudioReady = false;
  });

  audio.addEventListener('ended', () => {
      console.log('Audio playback ended.');
      button.textContent = 'Play';
      button.className = 'paused';
      if (imageInterval) clearInterval(imageInterval);
  });

  button.addEventListener('click', () => {
      if (!isAudioReady) {
          alert('Audio is not ready. Please wait or check for errors in the console.');
          if (audio.src && audio.networkState === HTMLMediaElement.NETWORK_IDLE && audio.readyState < HTMLMediaElement.HAVE_METADATA) {
              audio.load();
          }
          return;
      }

      if (audio.paused) {
          audio.play()
              .then(() => {
                  console.log('Audio playing.');
                  button.textContent = 'Pause';
                  button.className = 'playing';
                  if (imageInterval) clearInterval(imageInterval);
                  imageInterval = setInterval(changeImage, 3000);
              })
              .catch(error => {
                  console.error('Error attempting to play audio:', error);
                  alert(`Could not play audio: ${error.message}. Check browser console.`);
              });
      } else {
          audio.pause();
          console.log('Audio paused.');
          button.textContent = 'Play';
          button.className = 'paused';
          if (imageInterval) clearInterval(imageInterval);
      }
  });

  volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
  });

  button.disabled = true; 
  button.textContent = 'Loading Audio...';
  changeImage();

  // Ensure the browser attempts to load the audio.
  // If <audio src="sound.mp3" preload="auto"> or preload="metadata" is in HTML, this is often automatic.
  // If preload="none", or to be explicit:
  if (audio.src && audio.readyState < HTMLMediaElement.HAVE_METADATA) {
       console.log("Attempting to load audio as it's not ready yet.");
       audio.load();
  } else if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      // If already loaded (e.g. from cache or fast load)
      isAudioReady = true;
      button.disabled = false;
      button.textContent = 'Play';
  }

});