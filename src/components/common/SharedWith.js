const SharedWith = ({ members = {}, emptyState, ...props }) => {
  const memberNames = Object.values(members).map((member) => member.name);
  if (!memberNames.length) {
    if (emptyState) {
      console.log(props);
      return <p {...props}>{emptyState}</p>;
    }
    return null;
  }

  if (memberNames.length > 3) {
    return (
      <p className="fs-5 mt-3 mb-0">
        Geteilt mit {memberNames.length} Freund:innen
      </p>
    );
  }

  let membersString = "";
  if (memberNames.length > 2) {
    membersString = `${memberNames.slice(0, -1).join(", ")} und ${
      memberNames[memberNames.length - 1]
    }`;
  } else {
    membersString = memberNames.join(" und ");
  }

  return <p {...props}>Geteilt mit {membersString}</p>;
};

export default SharedWith;
