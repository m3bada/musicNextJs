import { useState, useRef, useEffect } from "react";
import style from "../styles/AudioPlayer.module.css";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;

    setIsPlaying(!prevValue);

    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);

  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () =>{
    progressBar.current.value =Number(progressBar.current.value - 30 );
    changeRange();

  }
  const forwardThirty = () =>{
    progressBar.current.value =Number(progressBar.current.value + 30 );
    changeRange();

  }

  return (
    <div className={style.audioPlayer}>
      <audio
        ref={audioPlayer}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
        preload="metadata"
      />
      <button className={style.forwardBackward} onClick={backThirty}>Back 30s</button>

      <button onClick={togglePlayPause} className={style.playPause}>
        {isPlaying ? "pause" : "play"}
      </button>

      <button className={style.forwardBackward} onClick={forwardThirty} >30s Forward</button>

      <div className={style.currentTime}>{calculateTime(currentTime)}</div>

      <input
        type="range"
        className={style.progressBar}
        defaultValue="0"
        ref={progressBar}
        onChange={changeRange}
      />

      <div className={style.duration}>
        {duration && !isNaN(duration) && calculateTime(duration)}
      </div>
    </div>
  );
}
