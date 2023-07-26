let isExtensionActive = false;

chrome.runtime.onMessage.addListener((request) => {
  if (isExtensionActive && request.activate) {
    const video = document.querySelector('.html5-video-container').querySelector('video');
    const volumeSlider = document.getElementById('volumeSlider');
    setVideoVolume(video, volumeSlider);
  }

  if (!request.activate || isExtensionActive) return;


  const trackedElement = document.getElementById('shorts-container');
  const config = { childList: true, subtree: true };

  const callback = (mutationList, observer) => {
    const isVideoMutated = mutationList.some(mutation =>
      mutation.target.id === 'shorts-player'
    );
  
    if (isVideoMutated) {
      startExtension();
      observer.disconnect();
    }
  }

  const observer = new MutationObserver(callback);
  observer.observe(trackedElement, config);
});

function startExtension() {
  isExtensionActive = true;
  const videoContainer = document.getElementById('player').querySelector('#container');
  const video = document.querySelector('.html5-video-container').querySelector('video');

  const volumeSlider = createSlider();

  volumeSlider.addEventListener('input', function() {
    setVideoVolume(video, volumeSlider);
  });

  videoContainer.appendChild(volumeSlider);

  function createSlider() {
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.id = 'volumeSlider';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.step = '1';

    getVolumeFromStorage()
      .then(volume => {
        if (volume === undefined || volume === null) {
          volumeSlider.value = '50';
          setVideoVolume(video, volumeSlider);
        } else {
          volumeSlider.value = volume * 100;
          video.volume = volume;
        }
      })
      .catch(error => {
        console.error(error);
      });

    return volumeSlider;
  }
}

function setVideoVolume(video, volumeSlider) {
  const normalizedValue = volumeSlider.value / volumeSlider.max;

  saveVolume(normalizedValue);

  video.volume = normalizedValue;
}

function saveVolume(value) {
  chrome.storage.local.set({ volume: value }, function() {
  });
}

function getVolumeFromStorage() {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(['volume'], function(result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.volume);
      }
    });
  });
}