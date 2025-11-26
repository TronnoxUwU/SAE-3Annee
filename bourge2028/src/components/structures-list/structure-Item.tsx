import { useState } from 'react';
import Style from "./structure-Item.module.css"


interface ListItemProps {
  id: number;
  nom: string;
  date: Date;
  description: string;
  edit: boolean;
  role: string;
}

function renderDate(date){
  if (!date) return "Date de fondation inconnue";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Date invalide";

  return `${d.toLocaleDateString('fr-FR', {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}`;
}

const StructureItem = ({ id, nom, date, description, edit, role }: ListItemProps) => {

  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      <div className={`${Style.struct_header} card-header fs-2`}>
        {nom}
        {/* btn acces structure */}
        <div className="btn-group btn-group-sm" role="group">

          <button
              className={`${Style.btn_crud} btn btn-outline-success btn-sm px-3`}
              title="Consulter"
              onClick={() => {window.location.href = `/structure/${id}`;}}
          >
            Consulter
            <i className="bi bi-eye fs-4"></i>
          </button>
          {
            edit && (
              <button 
                className={`${Style.btn_crud} btn btn-outline-primary btn-sm px-3`}
                title="Modifier"
                onClick={() => {window.location.href = `/structure/${id}/edit`;}}
              >
                Modifier
                <i className="bi bi-pencil fs-5"></i>
              </button>
            )
          }
          
        </div>
      </div>
      <div className={`${Style.struct_card} card-body p-2`}>
        <img src={"/images/default.jpg"}/>
        <div className={`${Style.struct_content}`}>
          <div className={Style.struct_info}>
            {role && (<p className={`${Style.struct_top} ${Style.struct_role}`}>{role}</p>)}
            <p className={`${Style.struct_top} ${Style.struct_date}`}>
              <i className="bi bi-calendar me-2"></i>{renderDate(date)}
            </p>
          </div>
          
          <p className={Style.struct_desc}>{description}</p>
        </div>
        
      </div>
    </li>
  );
};

export default StructureItem;