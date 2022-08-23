import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import React, { FormEventHandler, useState } from "react";
import { toast } from "react-toastify";
import useScriptLoader from "../utils/useScriptLoader";
import { FaExternalLinkAlt, FaStar } from "react-icons/fa";
import { GetStaticProps } from "next";
import useLanguage from "../utils/useLanguage";

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

interface StaticHomeProps {
  keywords: string[];
}

export default function Home({ keywords }: StaticHomeProps) {
  const { loaded } = useScriptLoader({
    src: `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_KEY}&libraries=places`,
    async: true,
  });
  const langs = useLanguage();

  const [form, setForm] = useState(initialFormState);

  // Handle data fetch from google api
  const handleSearchPlace = (place: string) => {
    // Check if script is loaded in DOM
    if (!loaded) return;

    // Check if geolocation access is allowed
    if (!("geolocation" in navigator))
      return toast("Your navigator doesn't support geolocation", {
        type: "error",
      });

    setForm((prevState) => ({ ...prevState, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Get geolocation coords
        const { latitude: lat, longitude: lng } = pos.coords;

        // Start google maps places service
        const placesService = new google.maps.places.PlacesService(
          document.createElement("div")
        );

        // Request text search based on current coords
        placesService.textSearch(
          {
            query: place,
            location: { lat, lng },
            radius: 100,
          },
          (res, status, pagination) => {
            console.log(res);

            // Check if status is different from OK and case yes, send a custom toast
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              setForm((prevState) => ({
                ...prevState,
                loading: false,
              }));

              if (
                status ==
                google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
              )
                return toast("You can only make two searches per minute", {
                  type: "info",
                });

              return toast("Something went wrong, try again", {
                type: "error",
              });
            }

            toast(`Found ${res.length} locations`, { type: "success" });

            // Sort result by best rate and opened first
            let sanitizedResult = res
              .filter((a) => a.opening_hours?.open_now)
              .sort((a, b) => (a.rating > b.rating ? -1 : 1));

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

  const handleSelectKeyword = (kw: string) => {
    setForm((prevState) => ({ ...prevState, place: kw }));
    handleSearchPlace(kw);
  };

  const handleFormSubmit: FormEventHandler = (evt) => {
    evt.preventDefault();

    handleSearchPlace(form.place);
  };

  return (
    <div>
      <Head>
        <title>SOSMe</title>
        <meta name="description" content={langs.metaDescription} />
      </Head>

      <header className="bg-blue-600 w-full p-12 text-white flex items-center justify-center flex-col">
        <strong className="text-5xl">SOSME</strong>

        <span className="block border w-56 mb-4 mt-12 bg-white border-white"></span>

        <h1 className="text-3xl text-center">{langs.headerText}</h1>
      </header>

      <main className="flex flex-col items-center p-12">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-wrap justify-center gap-y-4"
        >
          <input
            placeholder={langs.searchPlaceholder}
            value={form.place}
            onChange={(evt) =>
              setForm((prevState) => ({
                ...prevState,
                place: evt.target.value,
              }))
            }
            className="rounded-full py-3 px-8 outline-none shadow-md border"
          />

          <input
            type="submit"
            value={
              form.loading ? langs.searchButtonLoading : langs.searchButton
            }
            disabled={form.loading || !loaded}
            className={classNames({
              "py-3 px-6 ml-4 rounded-full text-gray-500 shadow-md border":
                true,
              "bg-gray-50 hover:bg-gray-100 active:bg-gray-200 cursor-pointer":
                !form.loading && loaded,
              "bg-gray-50": form.loading || !loaded,
            })}
          />
        </form>

        <div className="flex gap-2 my-12 flex-wrap">
          {langs.keywords.map((kw) => (
            <span
              key={kw}
              onClick={() => handleSelectKeyword(kw)}
              className="px-4 bg-gray-100 rounded-full text-gray-500 cursor-pointer border transition-colors hover:bg-gray-50"
            >
              {kw}
            </span>
          ))}
        </div>

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
                          objectFit="cover"
                          width={108}
                          height={108}
                        />
                      )}
                  </td>
                  <td className="p-4">
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noreferrer"
                      className={classNames({
                        "flex items-center gap-1": true,
                        "text-blue-600": !!place.website,
                      })}
                    >
                      {place.name}
                      {place.website && <FaExternalLinkAlt />}
                    </a>
                  </td>
                  <td className="p-4">
                    {Array(Math.round(place.rating || 0))
                      .fill(1)
                      .map((_, i) => (
                        <FaStar
                          key={`${place.place_id}-${place.rating}-${i}`}
                          color="#ffea00"
                          className="inline-block"
                        />
                      ))}
                  </td>
                  <td className="p-4">
                    {place.formatted_address}
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps/place/${place.formatted_address}`}
                      className="text-blue-500 flex items-center gap-2"
                    >
                      Open in Maps <FaExternalLinkAlt />
                    </a>
                  </td>
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

      <footer className="text-gray-400 text-xs text-center">
        <p>
          {langs.footerCredits}{" "}
          <a
            href="https://github.com/abreuthrj"
            rel="noreferrer"
            target="_blank"
            className="text-blue-400"
          >
            abreuthrj
          </a>
        </p>
        <p>{langs.footerText}</p>
        <p>{langs.footerPrivacy}</p>
      </footer>
    </div>
  );
}
