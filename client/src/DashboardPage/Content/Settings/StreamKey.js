import React from "react";

export const StreamKey = (props) => {
  const { streamKey } = props;
  return (
    <div className="settings-stream-key-container">
      <span>{streamKey}</span>
    </div>
  );
};
