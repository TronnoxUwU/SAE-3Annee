import { useState } from 'react';
import Style from "./structure-Item.module.css"


interface ListItemProps {
  id: number;
  nom: string;
  date: Date;
  description: string;
  edit: boolean;
  role: string;
  etat: string;
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

const StructureItem = ({ id, nom, date, description, edit, role, etat }: ListItemProps) => {

    if(etat==="liste") {
        return (
            <li className={`card p-0 ${Style.item_bloc}`}>
            <div className={`${Style.struct_header} card-header fs-2`}>
                {nom}
                {/* btn acces structure */}
                <div className="btn-group btn-group-sm" role="group">

                <a
                    className={`${Style.btn_crud} btn btn-outline-success btn-sm px-3`}
                    title="Consulter"
                    href={`/structure/${id}`}
                >
                    Consulter
                    <i className="bi bi-eye fs-4"></i>
                </a>
                {
                    edit && (
                    <a 
                        className={`${Style.btn_crud} btn btn-outline-primary btn-sm px-3`}
                        title="Modifier"
                        href={`/structure/${id}/edit`}
                    >
                        Modifier
                        <i className="bi bi-pencil fs-5"></i>
                    </a>
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
    } 
    else {
        return (
                <div className={`${Style.structure_card} card shadow-sm`}>

                    {/* Image */}
                    <div className={`${Style.structure_img_wrapper} border-bottom`}>
                        <img
                            src="/images/default.jpg"
                            alt={nom}
                            className="card-img-top"
                        />
                    </div>

                    {/* Content */}
                    <div className="card-body">
                        <div className={`${Style.structure_title}`}>
                            <h5 className="card-title mb-2">{nom}</h5>
                        </div>

                        {/* Badges */}
                        <div className="mb-3">
                            {role && (
                                <span className="badge bg-light text-primary border border-primary mb-2 d-inline-block">
                                    {role}
                                </span>
                            )}

                            <div className="text-muted small d-flex align-items-center gap-1">
                                {/* <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h2A2.75 2.75 0 0119 6.75v8.5A2.75 2.75 0 0116.25 18H3.75A2.75 2.75 0 011 15.25v-8.5A2.75 2.75 0 013.75 4h2V2.75A.75.75 0 015.75 2zm9.5 5a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zm-7 0a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75z" clipRule="evenodd" />
                                </svg> */}
                                <i className="bi bi-calendar me-2"></i>{renderDate(date)}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex gap-2">
                            <a 
                                className={`${Style.btn_crud} btn btn-outline-success btn-sm flex-fill`}
                                title="Consulter"
                                href={`/structure/${id}`}
                            >
                                Consulter
                                <i className="bi bi-eye fs-4"></i>
                            </a>
                            {edit && (
                                <a
                                    className={`${Style.btn_crud} btn btn-outline-primary btn-sm flex-fill`}
                                    title="Modifier"
                                    href={`/structure/${id}/edit`}
                                >
                                    Modifier
                                    <i className="bi bi-pencil fs-5"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            // </div>

        );
    }
  
};

export default StructureItem;