chrome.runtime.onMessage.addListener((request) => {
    if (!request.activate) return;

    document.addEventListener('DOMContentLoaded', startExtension());
});

function startExtension() {
  setTimeout(() => {
    const videoContainer = document.querySelector('.html5-video-container');
    const video = videoContainer.querySelector('video');
  
    const volumeSlider = createSlider();

    volumeSlider.addEventListener('input', function() {
      // Normalize the slider value to be between 0 and 1
      const normalizedValue = volumeSlider.value / volumeSlider.max;

      // Set the video volume
      video.volume = normalizedValue;
    });

    videoContainer.appendChild(volumeSlider);

    function createSlider() {
      const volumeSlider = document.createElement('input');
      volumeSlider.type = 'range';
      volumeSlider.id = 'volumeSlider';
      volumeSlider.min = '0';
      volumeSlider.max = '100';
      volumeSlider.step = '1';
      volumeSlider.value = '50';

      return volumeSlider;
    }
  }, 2000);
} 