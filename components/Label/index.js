import FeatherIcon from "feather-icons-react";
import React from "react";
export const Label = ({ title, tooltip }) => {
    return (<label className="label">
      <span className="label-text flex align-middle gap-2">
        <b>{title}</b>{" "}
        {tooltip && (<div className="tooltip" data-tip={tooltip}>
            <FeatherIcon icon="alert-circle" size="20" className="text-primary tool"/>
          </div>)}
      </span>
    </label>);
};
