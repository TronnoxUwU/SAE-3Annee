import { useState } from 'react';
import Style from "./structure-Item.module.css"


const PASTEL_COLORS = [
  "#E9D5FF", // violet
  "#FCE7F3", // rose
  "#DBEAFE", // bleu
  "#DCFCE7", // vert
  "#FEF3C7", // jaune
  "#FFE4E6", // rouge clair
  "#E0F2FE", // cyan
  "#F1F5F9", // gris clair
];

function getPastelColor(seed: string | number) {
  let hash = 0;
  const str = seed.toString();

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
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


interface Category {
  id: number;
  nom: string;
}

interface ListItemProps {
  id: number;
  nom: string;
  date: Date;
  description: string;
  categories: Category[];
  edit: boolean;
  role: string;
  validate?: boolean;
  onValidate?: (id: number) => void;
  onRefuse?: (id: number) => void;
}

const StructureItem = ({ id, nom, date, description, categories, edit, role, validate, onValidate, onRefuse }: ListItemProps) => {

  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      <div className={`${Style.struct_header} card-header fs-2`}>
        {nom}

        <div>
          <div className="btn-group btn-group-sm me-4" role="group">
            {/* VALIDATION */}
            {validate && (
              <button
                className={`${Style.btn_crud} btn btn-outline-warning text-dark btn-sm px-3`}
                title="Valider la structure"
                onClick={() => onValidate?.(id)}
              >
                Valider
                <i className="bi bi-check-lg fs-5"></i>
              </button>
            )}

            {/* REFUS */}
            {validate && (
              <button
                className={`${Style.btn_crud} btn btn-outline-danger text-dark btn-sm px-3`}
                title="Refuser la structure"
                onClick={() => onRefuse?.(id)}
              >
                Refuser
                <i className="bi bi-x-lg fs-6"></i>
              </button>
            )}
          </div>

          {/* btn acces structure */}
          <div className="btn-group btn-group-sm" role="group">

            <button
              className={`${Style.btn_crud} btn btn-outline-success btn-sm px-3`}
              title="Consulter"
              onClick={() => { window.location.href = `/structure/${id}`; }}
            >
              Consulter
              <i className="bi bi-eye fs-4"></i>
            </button>

            {edit && (
              <button 
                className={`${Style.btn_crud} btn btn-outline-primary btn-sm px-3`}
                title="Modifier"
                onClick={() => { window.location.href = `/structure/${id}/edit`; }}
              >
                Modifier
                <i className="bi bi-pencil fs-5"></i>
              </button>
            )}

          </div>
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
        <div className={Style.struct_category}>
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <span
                key={cat.id}
                className={Style.struct_category_badge}
                style={{
                  backgroundColor: getPastelColor(cat.id),
                }}
              >
                {cat.nom}
              </span>
            ))
          ) : (
            <span className={Style.struct_category_empty}>
              Aucune catégorie
            </span>
          )}
        </div>


        
      </div>
    </li>
  );
};

export default StructureItem;