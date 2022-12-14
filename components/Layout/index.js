import React from "react";
import FeatherIcon from "feather-icons-react";
import cx from "classnames";
import { useRouter } from "next/router";
export const Layout = function ({ children }) {
    const router = useRouter();
    console.log(router.pathname);
    return (<div className="bg-slate-100 min-h-screen">
      <div className="navbar bg-primary text-primary-content px-8">
        <div className="flex-1">
          <FeatherIcon icon="refresh-cw"/>
          <a className="btn btn-ghost normal-case text-xl">
            Synology File Sync
          </a>
        </div>
        <div className="flex-none">
          <a href="https://github.com/loic294/synology-glob-file-sync" target="_blank">
            <FeatherIcon icon="github"/>
          </a>
        </div>
      </div>
      <div className="bg-white px-8 py-8 flex justify-center">
        <div className="tabs  tabs-boxed">
          <a href="/" className={cx("tab tab-md", router.pathname === "/" && "tab-active")}>
            Folders
          </a>
          <a href="/settings" className={cx("tab tab-md", router.pathname === "/settings" && "tab-active")}>
            Sync Settings
          </a>
          <a href="/logs" className={cx("tab tab-md", router.pathname === "/logs" && "tab-active")}>
            Logs
          </a>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-20">{children}</div>
    </div>);
};
