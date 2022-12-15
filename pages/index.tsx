import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { Label } from "../components/Label";
import { useForm } from "react-hook-form";
import axios from "axios";
import FeatherIcon from "feather-icons-react";

export default function Folders() {
  const [settings, setSettings] = React.useState({
    source: [],
    target: [],
    defaultGlob: null,
    runEvery: null,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
      });

    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }, []);

  const [tasks, setTasks] = React.useState([]);

  return (
    <>
      <Head>
        <title>Folders - Synology Glob File Sync</title>
      </Head>
      <div className="prose mb-6">
        <h1>New Sync task</h1>
      </div>
      {settings.defaultGlob && <TaskComponent key={-1} isNew settings={settings} setTasks={setTasks} />}

      <div className="prose mt-12 mb-6">
        <h1>All Sync Tasks</h1>
      </div>
      {tasks &&
        tasks.length > 0 &&
        tasks.map((task: any, index: number) => (
          <TaskComponent key={index} index={index} task={task} settings={settings} setTasks={setTasks} />
        ))}
    </>
  );
}

function TaskComponent({ settings, index, task, isNew, setTasks }: any) {
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [moving, setMoving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    setValue("defaultGlob", isNew ? settings.defaultGlob : task.defaultGlob);
    setValue("runEvery", isNew ? settings.runEvery : task.runEvery);
    setValue("source", isNew ? settings.source[0] : task.source);
    setValue("target", isNew ? settings.target[0] : task.target);
  }, []);

  const onSubmit = async (content: any) => {
    console.log("SuBMIT", content);

    if (isNew && setTasks) {
      const { data } = await axios.post("/api/tasks", content);
      console.log("RESULT", data);
      setTasks(data);

      reset({ keepDirty: false, keepValues: true });
    } else {
      const { data } = await axios.post(`/api/tasks/${index}`, content);
      console.log("UPDATED DATA", data);
      setValue("defaultGlob", data.defaultGlob);
      setValue("runEvery", data.runEvery);
      setValue("source", data.source);
      setValue("target", data.target);

      reset({ keepDirty: false, keepValues: true });
    }
  };

  const checkRun = useCallback(async () => {
    const { data } = await axios.get(`/api/run/${index}`);
    console.log("FILES", data);
    setFiles(data);
  }, [index]);

  const moveFile = useCallback(async () => {
    const { data } = await axios.post(`/api/run/${index}`);
    console.log("FILES", data);
    setFiles([]);
    setMoving(true);
  }, [index]);

  const deleteTask = useCallback(async () => {
    const { data } = await axios.delete(`/api/tasks/${index}`);
    console.log("AFTER DELETE", data);
    setTasks(data);
  }, [index]);

  return (
    <>
      <div className="card w-100 bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between gap-4">
              <h2 className="card-title mt-0 mb-3">{isNew ? "New Sync Task" : `Task #${index + 1}`}</h2>
              {!isNew && (
                <label htmlFor={`deleteModal${index}`} className="btn">
                  <FeatherIcon icon="trash-2" />
                </label>
              )}
            </div>

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

            <div className="card-actions justify-start align-center mt-4">
              {isNew && (
                <button disabled={!isDirty} className="btn btn-primary">
                  Add New Task
                </button>
              )}

              {!isNew && (
                <button disabled={!isDirty} className="btn btn-primary">
                  Update
                </button>
              )}

              {!isNew && (
                <label htmlFor={`runModal${index}`} disabled={isDirty} className="btn" onClick={checkRun}>
                  Run now
                </label>
              )}
            </div>
          </form>
        </div>
      </div>

      {/** RUN MODAL */}
      {!isNew && (
        <>
          <input type="checkbox" id={`runModal${index}`} className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <label htmlFor={`runModal${index}`} className="btn btn-sm btn-circle absolute right-2 top-2">
                ✕
              </label>
              <h3 className="font-bold text-lg">Confirm</h3>
              <p className="py-4">
                We found <b>{files.length} files</b> to transfer from <b>{task.source}</b> to <b>{task.target}</b>
              </p>
              <div className="modal-action">
                <label
                  htmlFor={`runModal${index}`}
                  className="btn btn-warning"
                  disabled={files.length === 0}
                  aria-disabled={files.length === 0}
                  onClick={moveFile}
                >
                  Start the transfer
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {!isNew && (
        <>
          <input type="checkbox" id={`deleteModal${index}`} className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <label htmlFor={`deleteModal${index}`} className="btn btn-sm btn-circle absolute right-2 top-2">
                ✕
              </label>
              <h3 className="font-bold text-lg">Confirm</h3>
              <p className="py-4">Are you sure you want to delete the task #{index + 1}?</p>
              <div className="modal-action">
                <label htmlFor={`deleteModal${index}`} className="btn btn-error" onClick={deleteTask}>
                  Delete
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
