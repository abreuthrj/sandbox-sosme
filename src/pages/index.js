import axios from "axios";
import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const apiKey = "AIzaSyBWjIzix23ZVeB14oaXKFNoBFzpsArwmaM";
    const dataType = "json";
    const baseURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/${dataType}?`;
    const query = new URLSearchParams({
      key: apiKey,
      input: "mecanico",
      inputtype: "textquery",
      fields: [
        "address_component",
        "adr_address",
        "business_status",
        "formatted_address",
        "geometry",
        "icon",
        "icon_mask_base_uri",
        "icon_background_color",
        "name",
        "photo",
        "place_id",
        "plus_code",
        "type",
        "url",
        "utc_offset",
        "vicinity",
      ],
    });

    axios
      .get(`${baseURL}${query.toString()}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Head>
        <title>SOSMe</title>
        <meta
          name="description"
          content="SOSMe te ajuda a encontrar os serviços mais próximos de você que podem te ajudar"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <header className="bg-blue-600 w-full p-12 text-white flex items-center justify-center flex-col">
        <strong className="text-5xl">SoSMe</strong>
        <span className="block border w-56 mb-4 mt-12"></span>
        <h1 className="text-3xl">
          Te ajudando a encontrar o serviço mais próximo
        </h1>
      </header>

      <main className="flex justify-center p-12 flex-wrap">
        <form onSubmit={(evt) => evt.preventDefault()}>
          <input
            placeholder="Buscar (Ex. pia, mecânico, ...)"
            className="border rounded-full py-3 px-8 outline-none"
          />

          <input
            type="submit"
            value="Buscar"
            className="border py-3 px-6 rounded-full bg-gray-50 text-gray-500 ml-4 hover:bg-gray-100 active:bg-gray-200"
          />
        </form>
      </main>

      <footer></footer>
    </div>
  );
}
