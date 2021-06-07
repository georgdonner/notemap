import { categories } from "../../categories";

const MarkerForm = ({
  content,
  onChange,
  addTag,
  deleteTag,
  onSave,
  onEdit,
  editMode,
}) => {
  return (
    <>
      <div style={{ marginBottom: "3px" }}>
        <label>
          Name: <br />
          <input
            style={{ marginLeft: "3px" }}
            type="text"
            name="name"
            value={content.name}
            onChange={onChange}
          />
        </label>
        <br />
      </div>
      <div style={{ marginBottom: "3px" }}>
        <label>
          Beschreibung: <br />
          <input
            style={{ marginLeft: "3px" }}
            type="text"
            name="description"
            value={content.description}
            onChange={onChange}
          />
        </label>
        <br />
      </div>
      <div style={{ marginBottom: "3px" }}>
        <label>
          Kategorie: <br />
          <select
            className="form-select"
            aria-label="Kategorie auswählen"
            name="category"
            value={content.category}
            onChange={onChange}
          >
            <option value="">Wähle eine Kategorie</option>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <br />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "3px",
        }}
      >
        <label>Tags:</label>
        <input
          style={{ marginLeft: "3px" }}
          type="text"
          name="tag"
          value={content.tag}
          onChange={onChange}
        />
        <div style={{ cursor: "pointer", marginLeft: "5px" }} onClick={addTag}>
          +
        </div>
      </div>
      {content.tags.map((tag) => (
        <div key={tag}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>{tag}</div>{" "}
            <div
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => {
                deleteTag(tag);
              }}
            >
              x
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginLeft: "3px" }}>
        <button onClick={editMode ? onEdit : onSave}>Speichern</button>
      </div>
    </>
  );
};

export default MarkerForm;
