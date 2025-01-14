import React from "react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import FilterCheckbox from "./filterCheckbox";
import clsx from "clsx";
import c from "./styles/checkboxGroup.module.scss";

// for a given object returns, depending on the state of its children, recursively:
// 0 - all unchecked
// 1 - mixed (indeterminate)
// 2 - all checked
const areChildrenChecked = (children) => {
  let prev, checked;
  for (const value of Object.values(children)) {
    if (typeof value === "boolean") {
      checked = value;
    } else {
      const childrenChecked = areChildrenChecked(value);
      if (childrenChecked === 1) return 1;
      checked = childrenChecked === 2;
    }

    if (prev === undefined) {
      prev = checked;
    } else if (checked !== prev) {
      return 1;
    }
  }
  return prev ? 2 : 0;
};

// children must be an object
// path - path in the state object, not template
// state - sub state of a nested state
export default React.memo(function CheckboxGroup({
  name,
  state,
  onChange,
  path,
  children,
  wrapperClassName,
}) {
  const [expanded, setExpanded] = React.useState(
    () => localStorage.getItem("checkboxGroup_" + path) === "true",
  );

  const childrenChecked = areChildrenChecked(state);

  const recursiveGroupOrLeafs = Object.entries(children).map(([key, value]) => {
    const finalPath = path ? path + "." + key : key;
    // Leaf Checkbox
    // both of these ↓      ↓ should provide the same result
    if (typeof (/*value*/ state[key]) === "boolean" || value.value !== undefined) {
      return (
        <FilterCheckbox
          key={finalPath}
          name={value.name || key}
          value={state[key]}
          onChange={onChange}
          path={finalPath}
          wrapperClassName={wrapperClassName}
        />
      );
    }
    // Recursive group
    else {
      return (
        <CheckboxGroup
          key={finalPath}
          name={value.name !== undefined ? value.name : key}
          state={state[key]}
          onChange={onChange}
          path={finalPath}
          wrapperClassName={wrapperClassName}
        >
          {value.children || value}
        </CheckboxGroup>
      );
    }
  });

  // If name was not passed or is null, just recurse without creating the outer divs.
  if (!name) return recursiveGroupOrLeafs;

  const grouping = path.split(".").length % 2 !== 0,
    additionalClass = "";

  return (
    <div>
      {/* group checkbox */}
      <div>
        {grouping ? (
          <div className={c.groupingTitle}>{name}</div>
        ) : (
          <FilterCheckbox
            name={name}
            value={childrenChecked === 2}
            indeterminate={childrenChecked === 1}
            onChange={onChange}
            path={path}
            icon={expanded ? mdiChevronUp : mdiChevronDown}
            iconOnClick={() =>
              setExpanded((prev) => {
                localStorage.setItem("checkboxGroup_" + path, !prev);
                return !prev;
              })
            }
            wrapperClassName={wrapperClassName}
          />
        )}
      </div>

      {/* leaf checkboxes or recursive contents of a group */}
      {(expanded || grouping) && (
        <div className={clsx(grouping && c.checkboxGroupContents)}>{recursiveGroupOrLeafs}</div>
      )}
    </div>
  );
});
