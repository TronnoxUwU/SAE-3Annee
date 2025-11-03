import { useState } from 'react';
import Style from "./structure-Item.module.css"


interface ListItemProps {
  id: number;
  nom: string;
  date: Date;
}

const StructureItem = ({ id, nom, date, }: ListItemProps) => {

  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      <div className="struct-card align-items-center p-2">
        <h2>{nom}</h2>
        <p>{date.toString()}</p>
      </div>
    </li>
  );
};

export default StructureItem;