import { useState } from 'react';
import Style from "./structure-Item.module.css"


interface ListItemProps {
  id: number;
  nom: string;
  date: Date;
  description: string;
}

function renderDate(date){
  if (!date) return "Date de fondation inconnue";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Date invalide";

  return `Cette structure a été fondée le ${d.toLocaleDateString('fr-FR', {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}`;
}

const StructureItem = ({ id, nom, date, description }: ListItemProps) => {

  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      <div className={`${Style.struct_header} card-header fs-2`}>
        {nom}
        {/* btn crud */}
        <div className="btn-group btn-group-sm" role="group">

          <button
              className={`${Style.btn_crud} btn btn-outline-success btn-sm px-3`}
              title="Consulter"
              onClick={() => {window.location.href = `/structure/${id}`;}}
          >
            Consulter
            <i className="bi bi-eye fs-4"></i>
          </button>

          <button 
              className={`${Style.btn_crud} btn btn-outline-primary btn-sm px-3`}
              title="Modifier"
              onClick={() => {}}
          >
            Modifier
            <i className="bi bi-pencil fs-5"></i>
          </button>
        </div>
      </div>
      <div className={`${Style.struct_card} card-body p-2`}>
        <img src={"/images/map-replacement-opti.jpg"}/>
        <div className={`${Style.struct_content}`}>
          <p className={`${Style.struct_date}`}>{renderDate(date)}</p>
          <p>{description}</p>
        </div>
        
      </div>
    </li>
  );
};

export default StructureItem;