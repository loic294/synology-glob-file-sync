import Head from "next/head";
import { Label } from "../components/Label";
import styles from "../styles/Home.module.css";

export default function Settings() {
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
          <h2 className="card-title mt-0 mb-3">Default Values</h2>
          <div className="flex gap-4">
            <div className="w-full">
              <Label
                title="Matching Pattern"
                tooltip="Comma seperated list of file extensions to match."
              />
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <Label
                title="Run task every"
                tooltip="Run task at each interval (in minutes)"
              />
              <label className="input-group">
                <input
                  type="number"
                  min="1"
                  max="10080"
                  placeholder="5"
                  className="input input-bordered w-32"
                />
                <span>min</span>
              </label>
            </div>
          </div>
          <div className="card-actions justify-start mt-4">
            <button className="btn btn-primary">Save Defaults</button>
          </div>
        </div>
      </div>
    </>
  );
}
