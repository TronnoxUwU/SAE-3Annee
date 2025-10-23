"use client";

import React from "react";

export default function ListItem({ id, nom, parent=null }) {

  return (
    <div className="list-group">
        <p className="list-group-item list-group-item-action active">{nom}</p>
    </div>
  );
}
