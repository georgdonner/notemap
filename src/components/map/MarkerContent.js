import { categories } from "../../categories";

const MarkerContent = ({ marker, onDelete, onEdit }) => {
  const category = categories.find((ctg) => ctg.key === marker.category);

  return (
    <div>
      <div style={{ marginBottom: "3px" }}>
        <label style={{ fontSize: "20px" }}>
          <b>{marker.name}</b>
        </label>
        <div>
          <label style={{ fontSize: "14px" }}>{category.name}</label>
        </div>
      </div>
      {marker.description ? (
        <div style={{ marginBottom: "3px" }}>
          <label style={{ fontSize: "16px" }}>{marker.description}</label>
          <br />
        </div>
      ) : null}
      {marker.tags?.length ? (
        <div style={{ marginBottom: "3px" }}>
          {marker.tags.map((tag) => (
            <span
              key={tag}
              style={{ fontSize: "14px", margin: "1px" }}
              className="badge rounded-pill bg-light text-dark"
            >
              {tag}
            </span>
          ))}
          <br />
        </div>
      ) : null}
      <div className="buttonArea d-flex justify-content-end">
        <button
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            onDelete(marker);
          }}
          type="button"
          className="btn btn-danger m-1"
        >
          Löschen
        </button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            onEdit(marker);
          }}
          type="button"
          className="btn btn-info m-1"
        >
          Anpassen
        </button>
      </div>
    </div>
  );
};

export default MarkerContent;
