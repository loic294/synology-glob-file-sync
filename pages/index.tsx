import React, { useEffect } from "react";
import Head from "next/head";
import { Label } from "../components/Label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { defaultConfig } from "next/dist/server/config-shared";

export default function Folders() {
  const [settings, setSettings] = React.useState({
    source: [],
    target: [],
  });

  const [tasks, setTasks] = React.useState([]);

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
        setValue("source", data.source[0]);
        setValue("target", data.target[0]);
        setSettings(data);
      });

    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }, []);

  const onSubmit = async (data: any) => {
    console.log("SuBMIT", data);

    const result = await axios.post("/api/tasks", data);
    console.log("RESULT", result);
    setTasks(result.data);
  };

  return (
    <>
      <Head>
        <title>Folders - Synology Glob File Sync</title>
      </Head>

      <div className="prose mb-6">
        <h1>Sync Folders</h1>
      </div>

      <div className="card w-100 bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="card-title mt-0 mb-3">New Sync Task</h2>

            <div className="flex w-full align-top justify-between gap-4">
              <div className="w-full">
                <Label title="Source" tooltip="The folder where the files are located." />
                <select className="select select-bordered w-full" {...register("source")}>
                  {settings?.source?.map((source: string) => (
                    <option>{source}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <Label title="Destination" tooltip="The folder where the files will be transfered." />
                <select className="select select-bordered w-full" {...register("target")}>
                  {settings?.target?.map((target: string) => (
                    <option>{target}</option>
                  ))}
                </select>
              </div>
            </div>

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

            <div className="card-actions justify-start mt-4">
              <button className="btn btn-primary">Add New Task</button>
            </div>
          </form>
        </div>
      </div>

      {tasks.map((task: any, index: number) => (
        <TaskComponent key={index} {...task} />
      ))}
    </>
  );
}

function TaskComponent({ source, target, defaultGlob, runEvery, key }: any) {
  return (
    <div className="card w-100 bg-base-100 shadow-xl mt-8">
      <div className="card-body">
        <h2 className="card-title mt-0 mb-3">Task {key}</h2>

        <div className="flex w-full align-top justify-between gap-4">
          <div className="w-full">
            <Label title="Source" tooltip="The folder where the files are located." />
            <select className="select select-bordered w-full">
              <option>{source}</option>
            </select>
          </div>
          <div className="w-full">
            <Label title="Destination" tooltip="The folder where the files will be transfered." />
            <select className="select select-bordered w-full">
              <option>{target}</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <Label title="Matching Pattern" tooltip="Comma seperated list of file extensions to match." />
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
              defaultValue={defaultGlob}
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
                defaultValue={runEvery}
              />
              <span>min</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
