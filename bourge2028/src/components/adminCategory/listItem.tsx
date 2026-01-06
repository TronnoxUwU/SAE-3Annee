import { useState } from 'react';
import Style from "./listItem.module.css";
import CatCrudModal from "./CRUDmodal";
import { children } from 'cheerio/dist/commonjs/api/traversing';

interface ListItemProps {
  id: number;
  nom: string;
  parent: number | null;
  childrens: any[];
  countStructure: number | 0;
  onAdd: Function;
  onUpdate: Function;
  onDelete: Function;
}

const ListItem = ({ id, nom, parent, childrens, countStructure, onAdd, onUpdate, onDelete }: ListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [typeCrud, setTypeCrud] = useState("");

  const hasChildren = Array.isArray(childrens) && childrens.length > 0;

  return (
    <li className={`card p-0 ${Style.item_bloc}`}>
      <div className={`${Style.item_bloc_content} p-2`}>
        {/* Collapse */}
        <div className={`d-flex align-items-center ${Style.item_bloc_left}`}>
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

          {/* Nom catégorie */}
          <span className={`flex-grow-1 ${Style.item_title}`}>{nom}</span>

        </div>

        <div className={Style.item_value_s}>
          <p>Nombre de structures liées : {countStructure}</p>
        </div>

        {/* Boutons CRUD */}
        <div className="btn-group btn-group-sm" role="group">
          <button
            className="btn btn-outline-success btn-sm px-3"
            title="Ajouter"
            onClick={() => { setOpenModal(true); setTypeCrud("ADD"); }}
          >
            <i className="bi bi-plus fs-4"></i>
          </button>

          <button
            className="btn btn-outline-primary btn-sm px-3"
            title="Modifier"
            onClick={() => { setOpenModal(true); setTypeCrud("UPDATE"); }}
          >
            <i className="bi bi-pencil fs-5"></i>
          </button>

          <button
            className="btn btn-outline-danger btn-sm px-3"
            title="Supprimer"
            onClick={() => { setOpenModal(true); setTypeCrud("DELETE"); }}
          >
            <i className="bi bi-trash fs-5"></i>
          </button>
        </div>

        {/* Modal */}
        <CatCrudModal
          CRUD={typeCrud}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          selfId={id}
          name={nom}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>

      {/* Collapse enfants */}
      {hasChildren && (
        <div className={`collapse ${isOpen ? 'show' : ''}`}>
          <ul className="list-group list-group-flush ms-4">
            {childrens.map(child => (
              <ListItem
                key={child.id}
                id={child.id}
                nom={child.nom}
                parent={child.parentId}
                childrens={child.children || []}
                countStructure={child.totalStructures}
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
