import React from "react";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Head from "next/head";
import { Label } from "../components/Label";

export default function Folders() {
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
          <h2 className="card-title mt-0 mb-3">New Sync Task</h2>

          <div className="flex w-full align-top justify-between gap-4">
            <div className="w-full">
              <Label
                title="Source"
                tooltip="The folder where the files are located."
              />
              <select className="select select-bordered w-full">
                <option disabled selected>
                  Who shot first?
                </option>
                <option>Han Solo</option>
                <option>Greedo</option>
              </select>
            </div>
            <div className="w-full">
              <Label
                title="Destination"
                tooltip="The folder where the files will be transfered."
              />
              <select className="select select-bordered w-full">
                <option disabled selected>
                  Who shot first?
                </option>
                <option>Han Solo</option>
                <option>Greedo</option>
              </select>
            </div>
          </div>

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
            <button className="btn btn-primary">Add New Task</button>
          </div>
        </div>
      </div>
    </>
  );
}
