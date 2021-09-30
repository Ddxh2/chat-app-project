import { Howl } from "howler";

const useSound = (soundFileName) => {
  const sound = new Howl({ src: [`/sounds/${soundFileName}`], volume: 0.5 });

  return () => sound.play();
};

export default useSound;
