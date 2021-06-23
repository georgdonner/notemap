import { categories } from "../../categories";

const MarkerForm = ({
  content,
  maps,
  editMode,
  onChange,
  inputErrors,
  addTag,
  deleteTag,
  onSave,
  onEdit,
}) => {
  return (
    <>
      <form style={{ width: "200px" }}>
        {maps?.length ? (
          <div className="form-group" style={{ marginBottom: "3px" }}>
            <label>
              Karte*
              <select
                aria-label="Karte auswählen"
                className={
                  inputErrors.map
                    ? "form-select border-danger textAreaDescription"
                    : "form-select textAreaDescription"
                }
                name="map"
                value={content.map}
                onChange={onChange}
              >
                <option value="">Karte wählen</option>
                {maps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
        <div className="form-group" style={{ marginBottom: "3px" }}>
          <label htmlFor="inputName">Name*</label>
          <input
            value={content.name}
            onChange={onChange}
            type="text"
            name="name"
            className={
              inputErrors.name ? "form-control border-danger" : "form-control"
            }
            id="inputName"
            aria-describedby="name"
            placeholder="Namen eingeben"
          />
        </div>
        <div className="form-group" style={{ marginBottom: "3px" }}>
          <label htmlFor="inputDescription">Beschreibung</label>
          <textarea
            value={content.description}
            onChange={onChange}
            name="description"
            className="form-control textAreaDescription"
            id="inputDescription"
            aria-describedby="description"
            placeholder="Beschreibung eingeben"
          />
        </div>
        <div className="form-group" style={{ marginBottom: "3px" }}>
          <label>
            Kategorie*
            <select
              aria-label="Kategorie auswählen"
              className={
                inputErrors.category
                  ? "form-select border-danger textAreaDescription"
                  : "form-select textAreaDescription"
              }
              name="category"
              value={content.category}
              onChange={onChange}
            >
              <option value="">Kategorie wählen</option>
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div
          className="form-group"
          style={{
            marginBottom: "3px",
          }}
        >
          <label htmlFor="inputTag">Tags</label>
          <div className="input-group mb-3">
            <input
              value={content.tag}
              onChange={onChange}
              type="text"
              className="form-control"
              id="inputTag"
              aria-describedby="tag"
              placeholder="Tag eingeben"
              name="tag"
            />
            <div className="input-group-append">
              <span
                style={{ cursor: "pointer" }}
                onClick={addTag}
                className="input-group-text glyphicon glyphicon-plus"
                id="add-button"
              >
                +
              </span>
            </div>
          </div>
        </div>
        {content.tags.map((tag) => (
          <span
            key={tag}
            style={{ fontSize: "14px", margin: "1px" }}
            className="badge rounded-pill bg-light text-dark"
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              {tag}
              <div
                style={{ cursor: "pointer", marginLeft: "2px" }}
                onClick={() => {
                  deleteTag(tag);
                }}
              >
                x
              </div>
            </div>
          </span>
        ))}
        <div
          style={{ marginTop: "10px" }}
          className=" d-flex justify-content-end"
        >
          <button
            onClick={editMode ? onEdit : onSave}
            type="button"
            className="btn btn-success"
          >
            Speichern
          </button>
        </div>
      </form>
    </>
  );
};

export default MarkerForm;
