import style from "./personne-Item.module.css";

function renderDate(date: Date | number | string) {
  if (!date) return "Date inconnue";

  let d: Date | null = null;
  if (date instanceof Date && !isNaN(date.getTime())) {
    d = date;
    console.log("instance date" + date)
  }

  // Nombre
  else if (typeof date === "number") {
    const str = date.toString();

    // Format YYYYMMDDHHmmss
    if (str.length === 14) {
      const year = Number(str.slice(0, 4));
      const month = Number(str.slice(4, 6)) - 1;
      const day = Number(str.slice(6, 8));
      // const hour = Number(str.slice(8, 10));
      // const min = Number(str.slice(10, 12));
      // const sec = Number(str.slice(12, 14));

      d = new Date(year, month, day);
      console.log("reel date" + date)
    } 
    // via Timestamp
    else {
      d = new Date(date);
    }
  }

  else if (typeof date === "string") {
    const numeric = Number(date);
    console.log("string date" + date)

    if (!isNaN(numeric)) {
      return renderDate(numeric);
    }

    d = new Date(date);
  }

  if (!d || isNaN(d.getTime())) return "Date invalide";

  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface PersonneItemProps {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel?: string;
  description?: string;
  role: string;
  date: Date;
  photo?: string;
  edit: boolean;
}

const PersonneItem = ({
  id,
  nom,
  prenom,
  email,
  tel,
  description,
  role,
  date,
  photo,
  edit,
}: PersonneItemProps) => {
  return (
    <li className={`card p-0 ${style.item_bloc}`}>
      <div className={`${style.person_header} card-header fs-3`}>
        {prenom} {nom}

        <div className="btn-group btn-group-sm">
          <button
            className={`${style.btn_crud} btn btn-outline-success`}
            title="Consulter"
            onClick={() => (window.location.href = `/account/${id}`)}
          >
            Consulter
            <i className="bi bi-eye fs-5"></i>
          </button>

          
          <button
            className={`${style.btn_crud} btn btn-outline-danger`}
            title="Supprimer"
            onClick={async () => {
              const confirmDelete = confirm(
                "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
              );

              if (!confirmDelete) return;

              const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
              });

              if (res.ok) {
                alert("Utilisateur supprimé");
                window.location.reload(); // ou mise à jour du state
              } else {
                const data = await res.json();
                alert(data.error || "Erreur lors de la suppression");
              }
            }}
          >
            Supprimer
            <i className="bi bi-trash fs-5"></i>
          </button>
          
        </div>
      </div>

      <div className={`${style.person_card} card-body p-2`}>
        <div className={style.defaultAvatar}>
          {prenom?.[0]}
          {nom?.[0]}
        </div>

        <div className={style.person_content}>
          <div className={style.person_info}>
            <p className={style.person_role}>
              <i className="bi bi-shield-lock me-2"></i>
              {role}
            </p>
            <p className={style.person_date}>
              <i className="bi bi-calendar me-2"></i>
              Compte créé le {renderDate(date)}
            </p>
          </div>

          <div className={style.person_contact}>
            <p>
              <i className="bi bi-envelope me-2"></i>
              {email}
            </p>
            {tel && (
              <p>
                <i className="bi bi-telephone me-2"></i>
                {tel}
              </p>
            )}
          </div>

          <p className={style.person_desc}>
            <u>description</u> : {description || "Aucune description"}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PersonneItem;
