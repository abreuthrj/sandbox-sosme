import { useEffect, useState } from "react";

const initialState = {
  loaded: false,
};

interface useScriptLoaderProps {
  src: string;
  async?: boolean;
}

export default function useScriptLoader({ src, async }: useScriptLoaderProps) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const loadedScript = document.querySelector("#googlemaps-places");

    if (!loadedScript) {
      const script = document.createElement("script");
      script.id = "googlemaps-places";
      script.src = src;
      script.async = async;

      script.onload = () => {
        setState((prevState) => ({ ...prevState, loaded: true }));
      };

      document.body.appendChild(script);
    }
  }, [async, src]);

  return {
    loaded: state.loaded,
  };
}
