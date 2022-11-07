const body = document.body;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Check if user preference is set, if not check value of body class for light or dark else it means that colorscheme = auto
if (localStorage.getItem("colorscheme")) {
    setTheme(localStorage.getItem("colorscheme"));
} else if (body.classList.contains('colorscheme-light') || body.classList.contains('colorscheme-dark')) {
    setTheme(body.classList.contains("colorscheme-dark") ? "dark" : "light");
} else {
    setTheme(darkModeMediaQuery.matches ? "dark" : "light");
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        let theme = body.classList.contains("colorscheme-dark") ? "light" : "dark";
        setTheme(theme);
        rememberTheme(theme);
    });
}

darkModeMediaQuery.addListener((event) => {
    setTheme(event.matches ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", function () {
    let node = document.querySelector('.preload-transitions');
    node.classList.remove('preload-transitions');
});

function setTheme(theme) {
    body.classList.remove('colorscheme-auto');
    let inverse = theme === 'dark' ? 'light' : 'dark';
    body.classList.remove('colorscheme-' + inverse);
    body.classList.add('colorscheme-' + theme);
    document.documentElement.style['color-scheme'] = theme;
}

function rememberTheme(theme) {
    localStorage.setItem('colorscheme', theme);
}



// My Player

// HTML5 audio player + playlist controls
var jsPlayer = document.querySelector('.player-wrap');
if (jsPlayer) {
	jsPlayer = {
		wrap: jsPlayer,
		player: jsPlayer.querySelector('audio'),
		wrapList: (document.querySelector('.playlist-wrap') || {}),
		currentTime: (jsPlayer.querySelector('.current-time') || {}),
		durationTime: (jsPlayer.querySelector('.duration-time') || {}),
		seekBar: (jsPlayer.querySelector('.seek-bar') || { style: {} }),
		bigPlayButton: (jsPlayer.querySelector('.big-play-button') || { style: {} }),
		bigPauseButton: (jsPlayer.querySelector('.big-pause-button') || { style: {} }),
		playButton: (jsPlayer.querySelector('.play-button') || { style: {} }),
		pauseButton: (jsPlayer.querySelector('.pause-button') || { style: {} }),
		prevButton: (jsPlayer.querySelector('.prev-button') || { style: {} }),
		nextButton: (jsPlayer.querySelector('.next-button') || { style: {} }),
		playlistButton: (jsPlayer.querySelector('.playlist-button') || { style: {} }),
		titleText: (jsPlayer.querySelector('.title-text') || { style: {} }),
		artistText: (jsPlayer.querySelector('.artist-text') || { style: {} }),
    seekInterval: null,
		trackCount: 0,
		playing: false,
    playlist: [],
		tracks: [],
		idx: 0
	};

	jsPlayer.playClicked = function jsPlayerPlayClicked(){
		jsPlayer.bigPauseButton.style.display = 'block';
		jsPlayer.bigPlayButton.style.display = 'none';
		jsPlayer.pauseButton.style.display = 'block';
		jsPlayer.playButton.style.display = 'none';
		jsPlayer.playing = true;
		jsPlayer.player.play();
		jsPlayer.seekInterval = setInterval(jsPlayer.updateSeek, 500);
	};
	jsPlayer.pauseClicked = function jsPlayerPauseClicked(){
		clearInterval(jsPlayer.seekInterval);
		jsPlayer.bigPlayButton.style.display = 'block';
		jsPlayer.bigPauseButton.style.display = 'none';
		jsPlayer.playButton.style.display = 'block';
		jsPlayer.pauseButton.style.display = 'none';
		jsPlayer.playing = false;
		jsPlayer.player.pause();
	};
  jsPlayer.mediaEnded = function jsPlayerMediaEnded(){
    if (jsPlayer.idx + 1 < jsPlayer.trackCount) {
      jsPlayer.idx++;
      jsPlayer.playTrack(jsPlayer.idx);
    } else {
      jsPlayer.pauseClicked();
      jsPlayer.idx = 0;
      jsPlayer.loadTrack(jsPlayer.idx);
    }
  };
	jsPlayer.loadTracklist = function jsPlayerLoadPlaylist(){
		jsPlayer.playlist = jsPlayer.wrapList.tagName ? jsPlayer.wrapList.querySelectorAll('ol > li') : [];
		var len = jsPlayer.playlist.length,
			tmp, i;
    if (len > 0) {
      jsPlayer.wrap.classList.add('list-view');
      for (i = jsPlayer.trackCount; i < len; i++) {
        if (!jsPlayer.playlist[i].dataset) {
          jsPlayer.playlist[i].dataset = {};
        }
        tmp = jsPlayer.playlist[i].querySelector('a');
        if (tmp.tagName && !jsPlayer.playlist[i].dataset.idx) {
          jsPlayer.playlist[i].dataset.idx = i;
          jsPlayer.trackCount++;
          jsPlayer.tracks.push({
            'file': tmp.href,
            'artist': tmp.dataset.artist ? 'by ' + decodeURIComponent(tmp.dataset.artist).replace(/^\s+|\s+$/g, '') : '&nbsp;',
            'name': decodeURIComponent(tmp.textContent || tmp.innerText).replace(/^\s+|\s+$/g, '')
          });
        }
      }
    }
	};
	jsPlayer.loadTrack = function jsPlayerLoadTrack(idx){
		var len = jsPlayer.playlist ? jsPlayer.playlist.length : 0,
			i;
		for (i=0; i < len; i++) {
			if (jsPlayer.playlist[i].classList) {
				if (i == idx) {
					jsPlayer.playlist[i].classList.add('sel');
				} else {
					jsPlayer.playlist[i].classList.remove('sel');
				}
			}
		}
		jsPlayer.titleText.innerHTML = jsPlayer.tracks[idx].name;
		jsPlayer.artistText.innerHTML = jsPlayer.tracks[idx].artist;
		jsPlayer.player.src = jsPlayer.tracks[idx].file;
    jsPlayer.idx = idx;
	};
	jsPlayer.playTrack = function jsPlayerPlayTrack(idx){
		jsPlayer.loadTrack(idx);
		jsPlayer.playClicked();
	};
  jsPlayer.listClicked = function jsPlayerListClicked(event){
    clearInterval(jsPlayer.seekInterval);
    var parent = event.target.parentNode;
    if (parent.parentNode.tagName.toLowerCase() === 'ol') {
      event.preventDefault();
      jsPlayer.playTrack(parent.dataset.idx);
    }
  };
  jsPlayer.setDuration = function jsPlayerSetDuration(){
    jsPlayer.durationTime.innerHTML = jsPlayer.formatTime(jsPlayer.player.duration);
    jsPlayer.currentTime.innerHTML = jsPlayer.formatTime(jsPlayer.player.currentTime);
    jsPlayer.seekBar.value = jsPlayer.player.currentTime / jsPlayer.player.duration;
  };
  jsPlayer.updateSeek = function jsPlayerUpdateSeek(){
    if (jsPlayer.player.duration > -1) {
      jsPlayer.seekBar.value = 100 * (jsPlayer.player.currentTime || 0) / jsPlayer.player.duration;
      jsPlayer.currentTime.innerHTML = jsPlayer.formatTime(jsPlayer.player.currentTime || 0);
    }
  };
  jsPlayer.seekHeld = function jsPlayerSeekHeld(){
    jsPlayer.seekBar.parentNode.classList.add('sel');
    clearInterval(jsPlayer.seekInterval);
    jsPlayer.player.pause();
  };
  jsPlayer.seekReleased = function jsPlayerSeekReleased(){
    if (jsPlayer.player.duration > -1) {
      jsPlayer.player.currentTime = jsPlayer.seekBar.value * jsPlayer.player.duration / 100;
      jsPlayer.seekBar.parentNode.classList.remove('sel');
      if (jsPlayer.playing) {
        jsPlayer.player.play();
        jsPlayer.seekInterval = setInterval(jsPlayer.updateSeek, 500);
      } else {
        jsPlayer.updateSeek();
      }
    }
  };
  jsPlayer.prevClicked = function jsPlayerPrevClicked(event){
    event.preventDefault();
    if (jsPlayer.idx - 1 > -1) {
      jsPlayer.idx--;
      if (jsPlayer.playing) {
        jsPlayer.playTrack(jsPlayer.idx);
      } else {
        jsPlayer.loadTrack(jsPlayer.idx);
      }
    } else {
      jsPlayer.pauseClicked();
      jsPlayer.idx = 0;
      jsPlayer.loadTrack(jsPlayer.idx);
    }
  };
  jsPlayer.nextClicked = function jsPlayerNextClicked(event){
    event.preventDefault();
    if (jsPlayer.idx + 1 < jsPlayer.trackCount) {
      jsPlayer.idx++;
      if (jsPlayer.playing) {
        jsPlayer.playTrack(jsPlayer.idx);
      } else {
        jsPlayer.loadTrack(jsPlayer.idx);
      }
    } else {
      jsPlayer.pauseClicked();
      jsPlayer.idx = 0;
      jsPlayer.loadTrack(jsPlayer.idx);
    }
  };
  jsPlayer.playlistButtonClicked = function jsPlayerPlaylistButtonClicked(){
    jsPlayer.wrap.classList.toggle('show-list');
    jsPlayer.playlistButton.style.backgroundImage = (jsPlayer.wrap.classList.contains('show-list') && jsPlayer.wrap.style.backgroundImage) ? jsPlayer.wrap.style.backgroundImage : '';
  };
  jsPlayer.formatTime = function jsPlayerFormatTime(val){
    var h = 0, m = 0, s;
    val = (parseInt(val, 10) || 0);
    if (val > 60 * 60) {
      h = parseInt(val / (60 * 60), 10);
      val -= h * 60 * 60;
    }
    if (val > 60) {
      m = parseInt(val / 60, 10);
      val -= m * 60;
    }
    s = val;
    val = (h > 0)? h + ':' : '';
    val += (m > 0)? ((m < 10 && h > 0)? '0' : '') + m + ':' : '0:';
    val += ((s < 10)? '0' : '') + s;
    return val;
  };
	jsPlayer.init = function jsPlayerInit(){
		if (!!document.createElement('audio').canPlayType('audio/mp3')) {
			if (jsPlayer.wrapList.tagName && jsPlayer.wrapList.querySelectorAll('ol > li').length > 0) {
				jsPlayer.loadTracklist();
			} else if (jsPlayer.wrap.tagName && jsPlayer.wrap.dataset.url) {
				jsPlayer.tracks = [{
					'file': jsPlayer.wrap.dataset.url,
          'artist': 'by-' + decodeURIComponent(jsPlayer.wrap.dataset.artist || 'unknown').replace(/^\s+|\s+$/g, ''),
					'name': decodeURIComponent(jsPlayer.wrap.dataset.title || '').replace(/^\s+|\s+$/g, '')
				}];
			}
			if (jsPlayer.tracks.length > 0 && jsPlayer.player) {
        jsPlayer.player.addEventListener('ended', jsPlayer.mediaEnded, true);
        jsPlayer.player.addEventListener('loadeddata', jsPlayer.setDuration, true);
				if (jsPlayer.wrapList.tagName) {
					jsPlayer.wrapList.addEventListener('click', jsPlayer.listClicked, true);
				}
				if (jsPlayer.bigPlayButton.tagName) {
					jsPlayer.bigPlayButton.addEventListener('click', jsPlayer.playClicked, true);
          if (jsPlayer.bigPauseButton.tagName) {
            jsPlayer.bigPauseButton.addEventListener('click', jsPlayer.pauseClicked, true);
          }
				}
				if (jsPlayer.playButton.tagName) {
					jsPlayer.playButton.addEventListener('click', jsPlayer.playClicked, true);
          if (jsPlayer.pauseButton.tagName) {
            jsPlayer.pauseButton.addEventListener('click', jsPlayer.pauseClicked, true);
          }
				}
				if (jsPlayer.prevButton.tagName) {
					jsPlayer.prevButton.addEventListener('click', jsPlayer.prevClicked, true);
				}
				if (jsPlayer.nextButton.tagName) {
					jsPlayer.nextButton.addEventListener('click', jsPlayer.nextClicked, true);
				}
				if (jsPlayer.playlistButton.tagName) {
					jsPlayer.playlistButton.addEventListener('click', jsPlayer.playlistButtonClicked, true);
				}
				if (jsPlayer.seekBar.tagName) {
					jsPlayer.seekBar.addEventListener('mousedown', jsPlayer.seekHeld, true);
					jsPlayer.seekBar.addEventListener('mouseup', jsPlayer.seekReleased, true);
				}
        jsPlayer.wrap.className += ' enabled';
        jsPlayer.loadTrack(jsPlayer.idx);
			}
		}
	};
	jsPlayer.init();
}

    // Playlist listeners
    simp_source.forEach(function(item, index) {
      if (item.classList.contains('simp-active')) simp_a_index = index; //playlist contains '.simp-active'
    item.addEventListener('click', function() {
        simp_audio.removeEventListener('timeupdate', simp_initTime);
        simp_a_index = index;
        simp_changeAudio(this.querySelector('.simp-source'));
        simp_setAlbum(simp_a_index);
    });
    });
    
    // FIRST AUDIO LOAD =======
    simp_changeAudio(simp_a_url[simp_a_index]);
    simp_setAlbum(simp_a_index);
    // FIRST AUDIO LOAD =======
    
    // Controls listeners
    simp_controls.querySelector('.simp-plauseward').addEventListener('click', function(e) {
    var eles = e.target.classList;
    if (eles.contains('simp-plause')) {
        if (simp_audio.paused) {
        if (!simp_isLoaded) simp_loadAudio(simp_a_url[simp_a_index]);
        simp_audio.play();
        simp_isPlaying = true;
        eles.remove('fa-play');
        eles.add('fa-pause');
        } else {
        simp_audio.pause();
        simp_isPlaying = false;
        eles.remove('fa-pause');
        eles.add('fa-play');
        }
    } else {
        if (eles.contains('simp-prev') && simp_a_index != 0) {
        simp_a_index = simp_a_index-1;
        e.target.disabled = simp_a_index == 0 ? true : false;
        } else if (eles.contains('simp-next') && simp_a_index != simp_a_url.length-1) {
        simp_a_index = simp_a_index+1;
        e.target.disabled = simp_a_index == simp_a_url.length-1 ? true : false;
        }
        simp_audio.removeEventListener('timeupdate', simp_initTime);
        simp_changeAudio(simp_a_url[simp_a_index]);
        simp_setAlbum(simp_a_index);
    }
    });
    
    // Audio volume
    simp_volume.addEventListener('click', function(e) {
    var eles = e.target.classList;
    if (eles.contains('simp-mute')) {
        if (eles.contains('fa-volume-up')) {
        eles.remove('fa-volume-up');
        eles.add('fa-volume-off');
        simp_v_slider.value = 0;
        } else {
        eles.remove('fa-volume-off');
        eles.add('fa-volume-up');
        simp_v_slider.value = simp_v_num;
        }
    } else {
        simp_v_num = simp_v_slider.value;
        if (simp_v_num != 0) {
        simp_controls.querySelector('.simp-mute').classList.remove('fa-volume-off');
        simp_controls.querySelector('.simp-mute').classList.add('fa-volume-up');
        }
    }
    simp_audio.volume = parseFloat(simp_v_slider.value / 100);
    });
    
    // Others
    simp_others.addEventListener('click', function(e) {
    var eles = e.target.classList;
    if (eles.contains('simp-plext')) {
        simp_isNext = simp_isNext && !simp_isRandom ? false : true;
        if (!simp_isRandom) simp_isRanext = simp_isRanext ? false : true;
        eles.contains('simp-active') && !simp_isRandom ? eles.remove('simp-active') : eles.add('simp-active');
    } else if (eles.contains('simp-random')) {
        simp_isRandom = simp_isRandom ? false : true;
        if (simp_isNext && !simp_isRanext) {
        simp_isNext = false;
        simp_others.querySelector('.simp-plext').classList.remove('simp-active');
        } else {
        simp_isNext = true;
        simp_others.querySelector('.simp-plext').classList.add('simp-active');
        }
        eles.contains('simp-active') ? eles.remove('simp-active') : eles.add('simp-active');
    } else if (eles.contains('simp-shide-top')) {
        simp_album.parentNode.classList.toggle('simp-hide');
    } else if (eles.contains('simp-shide-bottom')) {
        simp_playlist.classList.add('simp-display');
        simp_playlist.classList.toggle('simp-hide');
    }
    });

  // Start simple player
if (document.querySelector('#simp')) {
    var simp_auto_load, simp_audio, simp_album, simp_cover, simp_title, simp_artist, simp_controls, simp_progress, simp_volume, simp_v_slider, simp_v_num, simp_others;
    var ap_simp = document.querySelector('#simp');
    var simp_playlist = ap_simp.querySelector('.simp-playlist');
    var simp_source = simp_playlist.querySelectorAll('li');
    var simp_a_url = simp_playlist.querySelectorAll('[data-src]');
    var simp_a_index = 0;
    var simp_isPlaying = false;
    var simp_isNext = false; //auto play
    var simp_isRandom = false; //play random
    var simp_isRanext = false; //check if before random starts, simp_isNext value is true
    var simp_isStream = false; //radio streaming
    var simp_isLoaded = false; //audio file has loaded
    var simp_config = ap_simp.dataset.config ? JSON.parse(ap_simp.dataset.config) : {
      shide_top: false, //show/hide album
      shide_btm: false, //show/hide playlist
      auto_load: false //auto load audio file
    };
    
    var simp_elem = '';
    simp_elem += '<audio id="audio" preload><source src="" type="audio/mpeg"></audio>';
    simp_elem += '<div class="simp-display"><div class="simp-album w-full flex-wrap"><div class="simp-cover"><i class="fa fa-music fa-5x"></i></div><div class="simp-info"><div class="simp-title">Title</div><div class="simp-artist">Artist</div></div></div></div>';
    simp_elem += '<div class="simp-controls flex-wrap flex-align">';
    simp_elem += '<div class="simp-plauseward flex flex-align"><button type="button" class="simp-prev fa fa-backward" disabled></button><button type="button" class="simp-plause fa fa-play" disabled></button><button type="button" class="simp-next fa fa-forward" disabled></button></div>';
    simp_elem += '<div class="simp-tracker simp-load"><input class="simp-progress" type="range" min="0" max="100" value="0" disabled/><div class="simp-buffer"></div></div>';
    simp_elem += '<div class="simp-time flex flex-align"><span class="start-time">00:00</span><span class="simp-slash">&#160;/&#160;</span><span class="end-time">00:00</span></div>';
    simp_elem += '<div class="simp-volume flex flex-align"><button type="button" class="simp-mute fa fa-volume-up"></button><input class="simp-v-slider" type="range" min="0" max="100" value="100"/></div>';
    simp_elem += '<div class="simp-others flex flex-align"><button type="button" class="simp-plext fa fa-play-circle" title="Auto Play"></button><button type="button" class="simp-random fa fa-random" title="Random"></button><div class="simp-shide"><button type="button" class="simp-shide-top fa fa-caret-up" title="Show/Hide Album"></button><button type="button" class="simp-shide-bottom fa fa-caret-down" title="Show/Hide Playlist"></button></div></div>';
    simp_elem += '</div>'; //simp-controls
    
    var simp_player = document.createElement('div');
    simp_player.classList.add('simp-player');
    simp_player.innerHTML = simp_elem;
    ap_simp.insertBefore(simp_player, simp_playlist);
    simp_startScript();
}

// Mplayer
// Mplayer
let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let updateTimer;

const music_list = [
    {
        img : '/images/label1.jpg',
        name : 'So What',
        artist : 'Miles Davis',
        music : '/audio/01.so-what.mp3'
    },
    {
        img : '/images/label1.jpg',
        name : 'Blue In Green',
        artist : 'Miles Davies',
        music : '/audio/02.blue-in-green.mp3'
    },
    {
        img : '/images/label1.jpg',
        name : 'Freddie Freeloader',
        artist : 'Miles Davis',
        music : '/audio/03.freddie-freeloader.mp3'
    },
    {
        img : '/images/label2.jpg',
        name : 'All Blues',
        artist : 'Miles Davis',
        music : '/audio/04.all-blues.mp3'
    },
    {
      img : '/images/label2.jpg',
      name : 'Flamenco Sketches',
      artist : 'Miles Davis',
      music : '/audio/05.flamenco-sketches.mp3'
  }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    
}

function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    wave.classList.remove('loader');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(){
    if(track_index < music_list.length - 1 ){
        track_index += 1;
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume(){
    curr_track.volume = volume_slider.value / 100;
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationMinutes;
    }
}