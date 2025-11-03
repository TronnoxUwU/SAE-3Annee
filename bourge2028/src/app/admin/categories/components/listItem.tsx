import { useState } from 'react';
import Style from "./listItem.module.css"
import CatCrudModal from "./CRUDmodal"


interface ListItemProps {
  id: number;
  nom: string;
  parent: number | null;
  childrens: any[];
  onAdd: Function;
  onUpdate: Function;
  onDelete: Function;
}

const ListItem = ({ id, nom, parent, childrens, onAdd, onUpdate, onDelete }: ListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [typeCrud, setTypeCrud] = useState("");

  const hasChildren = childrens.length > 0;

  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      <div className="d-flex align-items-center p-2">
        {/* collapse */}
        {hasChildren ? (
          <button
            className="btn btn-link btn-sm p-0 me-2 text-decoration-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <i className={`bi bi-chevron-${isOpen ? 'down' : 'right'} fs-4`}></i>
          </button>
        ) : (
          <span className="me-2" style={{ width: '20px', display: 'inline-block' }}></span>
        )}

        {/* Nom categorie */}
        <span className={`flex-grow-1 ${Style.item_title}`}>{nom}</span>

        {/* btn crud */}
        <div className="btn-group btn-group-sm" role="group">

          <button
              className="btn btn-outline-success btn-sm"
              title="Ajouter"
              onClick={() => {setOpenAddModal(true), setTypeCrud("ADD")}}
          >
            <i className="bi bi-plus"></i>
          </button>

          <button 
              className="btn btn-outline-primary btn-sm"
              title="Modifier"
              onClick={() => {setOpenAddModal(true), setTypeCrud("UPDATE")}}
          >
            <i className="bi bi-pencil"></i>
          </button>

          <button 
              className="btn btn-outline-danger btn-sm"
              title="Supprimer"
              onClick={() => {setOpenAddModal(true), setTypeCrud("DELETE")}}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
          <CatCrudModal
            CRUD={typeCrud}
            isOpen={openAddModal}
            onClose={() => setOpenAddModal(false)}
            selfId={id}
            onAdd={onAdd}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
      </div>

      {/* collapse enfants */}
      {hasChildren && (
        <div className={`collapse ${isOpen ? 'show' : ''}`}>
          <ul className="list-group list-group-flush ms-4">
            {childrens.map((item) => (
              <ListItem
                key={item.id}
                id={item.id}
                nom={item.nom}
                parent={item.parentId}
                childrens={item.children}
                onAdd={onAdd}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ListItem;