import Layout from "@/components/Layout";
import { Category } from "@/types";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  useCategoriesQuery,
  useCreateAdMutation,
} from "@/graphql/generated/schema";
import UploadImage from "@/components/UploadImage";

export async function uploadFile(file: File) {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("http://localhost:8000/uploads", {
    method: "POST",
    body: formData,
  });
  const { url } = await response?.json();
  return url;
}

export default function NewAd() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [createAd] = useCreateAdMutation();
  const { data } = useCategoriesQuery();
  const categories = data?.categories || [];
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (!inputFile) return;
    const url = await uploadFile(inputFile);
    formData.append("picture", url);

    const formJSON: any = Object.fromEntries(formData.entries());
    formJSON.price = parseFloat(formJSON.price);
    formJSON.category = { id: parseInt(formJSON.category) };
    const res = await createAd({ variables: { data: { ...formJSON } } });
    router.push(`/ads/${res.data?.createAd.id}`);
  };

  return (
    <Layout title="Creation d'une annonce">
      <h1 className="pt-6 pb-6 text-2xl">Creer une annonce</h1>

      <form onSubmit={handleSubmit} className="pb-12">
        <div className="flex flex-wrap gap-6 mb-3">
          <div className="w-full max-w-xs form-control">
            <label className="label" htmlFor="title">
              <span className="label-text">Titre</span>
            </label>
            <input
              required
              type="text"
              name="title"
              id="title"
              placeholder="Zelda : Ocarina of time"
              className="w-full max-w-xs input input-bordered"
            />
          </div>
          <UploadImage inputFile={inputFile} setInputFile={setInputFile} />
        </div>

        <div className="flex flex-wrap gap-6 mb-3">
          <div className="w-full max-w-xs form-control">
            <label className="label" htmlFor="location">
              <span className="label-text">Localisation</span>
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              placeholder="Paris"
              className="w-full max-w-xs input input-bordered"
            />
          </div>

          <div className="w-full max-w-xs form-control">
            <label className="label" htmlFor="owner">
              <span className="label-text">Auteur</span>
            </label>
            <input
              type="text"
              name="owner"
              id="owner"
              required
              placeholder="Link"
              className="w-full max-w-xs input input-bordered"
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">Description</span>
          </label>
          <textarea
            rows={5}
            className="textarea textarea-bordered"
            placeholder="The Legend of Zelda: Ocarina of Time est un jeu vidéo d'action-aventure développé par Nintendo EAD et édité par Nintendo sur Nintendo 64. Ocarina of Time raconte l'histoire de Link, un jeune garçon vivant dans un village perdu dans la forêt, qui parcourt le royaume d'Hyrule pour empêcher Ganondorf d'obtenir la Triforce, une relique sacrée partagée en trois : le courage (Link), la sagesse (Zelda) et la force (Ganondorf)."
            name="description"
            id="description"
            required
          ></textarea>
        </div>

        <div className="flex flex-wrap gap-6 mt-6 mb-3">
          <div className="w-full max-w-xs form-control">
            <label className="label" htmlFor="price">
              <span className="label-text">Prix</span>
            </label>
            <input
              required
              type="number"
              name="price"
              id="price"
              min={0}
              placeholder="30"
              className="w-full max-w-xs input input-bordered"
            />
          </div>

          <div className="w-full max-w-xs form-control">
            <label className="label" htmlFor="category">
              <span className="label-text">Catégorie</span>
            </label>
            <select
              className="select select-bordered"
              id="category"
              name="category"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="w-full mt-12 text-white btn btn-primary">
          Envoyer
        </button>
      </form>
    </Layout>
  );
}
