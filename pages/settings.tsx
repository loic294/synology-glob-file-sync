import Head from "next/head";
import React from "react";
import { useEffect } from "react";
import { Label } from "../components/Label";
import { useForm } from "react-hook-form";

import styles from "../styles/Home.module.css";
import axios from "axios";

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setValue("defaultGlob", data.defaultGlob);
        setValue("runEvery", data.runEvery);
        setValue("excludeFolders", data.excludeFolders);
      });
  }, []);

  const onSubmit = async (data: any) => {
    console.log("SuBMIT", data);

    const result = await axios.post("/api/settings", data);
    console.log("RESULT", result);
  };

  return (
    <>
      <Head>
        <title>Settings - Synology Glob File Sync</title>
      </Head>
      <div className="prose mb-6">
        <h1>Settings</h1>
      </div>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="card-title mt-0 mb-3">Default Values</h2>
            <div className="flex gap-4">
              <div className="w-full">
                <Label title="Matching Pattern" tooltip="Comma seperated list of file extensions to match." />
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                  {...register("defaultGlob")}
                />
              </div>
              <div>
                <Label title="Run task every" tooltip="Run task at each interval (in minutes)" />
                <label className="input-group">
                  <input
                    type="number"
                    min="1"
                    max="10080"
                    placeholder="5"
                    className="input input-bordered w-32"
                    {...register("runEvery")}
                  />
                  <span>min</span>
                </label>
              </div>
            </div>
            <div className="w-full">
              <Label title="Matching Pattern" tooltip="Regex of folders to exclude from search" />
              <input
                type="text"
                placeholder="Enter regex to exclude folders"
                className="input input-bordered w-full"
                {...register("excludeFolders")}
              />
            </div>
            <div className="card-actions justify-start mt-4">
              <button className="btn btn-primary">Save Defaults</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
