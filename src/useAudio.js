import { useMemo, useEffect, useState } from "react";
import mintSound from "./media/audio/soundNew.mp3";

const useAudio = () => {
  const audio = useMemo(() => new Audio(mintSound), []);
  const [playing, setPlaying] = useState(false);
  const togglePlaying = () => setPlaying(!playing);

  useEffect(() => {
    playing ? (audio.loop = true) : (audio.loop = false);
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
      // audio.pause();
    };
  }, []);

  return [playing, togglePlaying];
};

export default useAudio;
