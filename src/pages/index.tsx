import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useScriptLoader from "../utils/useScriptLoader";
import { FaStar } from "react-icons/fa";

interface FormType {
  place: string;
  loading: boolean;
  result: google.maps.places.PlaceResult[];
}

const initialFormState: FormType = {
  place: "",
  loading: false,
  result: [],
};

export default function Home() {
  const { loaded } = useScriptLoader({
    src: `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_KEY}&libraries=places`,
    async: true,
  });

  const [form, setForm] = useState(initialFormState);

  const handleSearchPlace = () => {
    if (!loaded) return;
    if (!("geolocation" in navigator))
      return toast("Your navigator doesn't support geolocation", {
        type: "error",
      });

    setForm((prevState) => ({ ...prevState, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        const placesService = new google.maps.places.PlacesService(
          document.createElement("div")
        );

        placesService.textSearch(
          {
            query: form.place,
            location: { lat, lng },
            radius: 100,
          },
          (res, status, pagination) => {
            console.log(res);
            toast(`Found ${res.length} locations`, { type: "success" });

            let sanitizedResult = res
              .sort((a, b) => (a.rating > b.rating ? -1 : 1))
              .sort((a, b) =>
                a.opening_hours?.open_now && !b.opening_hours?.open_now ? -1 : 1
              );

            setForm((prevState) => ({
              ...prevState,
              loading: false,
              result: sanitizedResult,
            }));
          }
        );
      },
      (err) => {
        setForm((prevState) => ({
          ...prevState,
          loading: false,
        }));

        if (err.code == err.PERMISSION_DENIED)
          return toast("You need to allow location access", {
            type: "error",
          });

        if (err.code == err.POSITION_UNAVAILABLE)
          return toast("Unable to get your location", {
            type: "error",
          });

        return toast("Unable to get your location", { type: "error" });
      }
    );
  };

  return (
    <div>
      <Head>
        <title>SOSMe</title>
        <meta
          name="description"
          content="SOSMe te ajuda a encontrar os serviços mais próximos de você que podem te ajudar"
        />
      </Head>

      <header className="bg-blue-600 w-full p-12 text-white flex items-center justify-center flex-col">
        <strong className="text-5xl">SoSMe</strong>
        <span className="block border w-56 mb-4 mt-12"></span>
        <h1 className="text-3xl">
          Te ajudando a encontrar o serviço mais próximo
        </h1>
      </header>

      <main className="flex flex-col items-center p-12">
        <form onSubmit={(evt) => evt.preventDefault()}>
          <input
            placeholder="Buscar (Ex. pia, mecânico, ...)"
            value={form.place}
            onChange={(evt) =>
              setForm((prevState) => ({
                ...prevState,
                place: evt.target.value,
              }))
            }
            className="border rounded-full py-3 px-8 outline-none"
          />

          <input
            type="submit"
            value="Buscar"
            onClick={handleSearchPlace}
            disabled={form.loading || !loaded}
            className="border py-3 px-6 rounded-full bg-gray-50 text-gray-500 ml-4 hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
          />
        </form>

        <table className="mt-12">
          <thead>
            <tr>
              <th className="text-left"></th>
              <th className="text-left"></th>
              <th className="text-left"></th>
              <th className="text-left"></th>
              <th className="text-left"></th>
            </tr>
          </thead>
          <tbody>
            {form.result.map((place) => (
              <React.Fragment key={place.place_id}>
                <tr>
                  <td>
                    {place.photos &&
                      place.photos.length > 0 &&
                      place.photos[0].getUrl() && (
                        <Image
                          src={place.photos[0].getUrl()}
                          alt={place.name}
                          loading="lazy"
                          width={108}
                          height={108}
                        />
                      )}
                  </td>
                  <td className="p-4">{place.name}</td>
                  <td className="p-4">
                    {Array(Math.round(place.rating || 0))
                      .fill(1)
                      .map(() => (
                        <FaStar color="#ffea00" className="inline-block" />
                      ))}
                  </td>
                  <td className="p-4">{place.formatted_address}</td>
                  <td className="p-4">
                    <span
                      className={classNames({
                        "block w-4 h-4 rounded-full": true,
                        "bg-green-500": place.opening_hours?.open_now,
                        "bg-red-500": !place.opening_hours?.open_now,
                      })}
                    ></span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </main>

      <footer></footer>
    </div>
  );
}
