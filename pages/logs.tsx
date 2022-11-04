import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Logs() {
  return (
    <div>
      <Head>
        <title>Logs - Synology Glob File Sync</title>
      </Head>

      <div className="prose mb-6">
        <h1>Logs</h1>
      </div>

      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mt-0 mb-3">Last 1000 entries</h2>
          <div className="mockup-code max-h-96">
            <pre data-prefix="$">
              <code>npm i daisyui</code>
            </pre>
            <pre data-prefix="$">
              <code>line 2</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
