// import { useState } from 'react';
import Style from "./show-localisation.module.css"
// import CatCrudModal from "./CRUDmodal"


interface ListItemProps {
  id: number;
  nomDepartement: string;
}

const ListLocalisation = ({ id, nomDepartement }: ListItemProps) => {

  console.log("feur");
  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      <div className="d-flex align-items-center p-2">

        {/* departement */}
        <i className="bi bi-geo-alt fs-5"></i>
        <h2 className={`mb-0 flex-grow-1 ${Style.item_title}`}>{nomDepartement}</h2>

        
      </div>
    </li>
  );
};

export default ListLocalisation;