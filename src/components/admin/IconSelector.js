import PropTypes from "prop-types";

import { ALL_ICONS, ICON_PATHS } from "../../constants/icons";

import Select from "react-select";
import { useMemo } from "react";

export default function IconSelector({ updateEntry, value }) {
  const selectorOptions = useMemo(
    () =>
      Object.keys(ALL_ICONS)
        .sort((a, b) => {
          const aText = ALL_ICONS[a].text;
          const bText = ALL_ICONS[b].text;
          if (aText < bText) {
            return -1;
          }
          if (aText > bText) {
            return 1;
          }
          return 0;
        })
        .reduce((acc, key) => {
          acc.push({ 
            value: key, 
            label: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {ALL_ICONS[key].type === "img" ? (
                  <img 
                    src={`/icons/${ICON_PATHS[ALL_ICONS[key].value]}`}
                    alt=""
                    style={{ width: '16px', height: '16px', marginRight: '8px' }}
                  />
                ) : (
                  <i 
                    className={`${ALL_ICONS[key].type === "fab" ? "fab" : "fas"} fa-${ALL_ICONS[key].value}`} 
                    style={{ marginRight: '8px', color: '#E67E63' }}
                  ></i>
                )}
                <span>{ALL_ICONS[key].text}</span>
              </div>
            ),
            data: ALL_ICONS[key]
          });
          return acc;
        }, []),
    []
  );

  const onChange = ({ value }) => {
    const selectedIcon = ALL_ICONS[value];
    if (selectedIcon.type === "img") {
      updateEntry({ icon: selectedIcon.value, faicon: "" });
    } else {
      updateEntry({ faicon: value, icon: "" });
    }
  };

  // Check if the value exists in ALL_ICONS before trying to access its properties
  const getSelectValue = () => {
    if (!value) return null;
    if (!ALL_ICONS[value]) return null;
    return { 
      value, 
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {ALL_ICONS[value].type === "img" ? (
            <img 
              src={`/icons/${ICON_PATHS[ALL_ICONS[value].value]}`}
              alt=""
              style={{ width: '16px', height: '16px', marginRight: '8px' }}
            />
          ) : (
            <i 
              className={`${ALL_ICONS[value].type === "fab" ? "fab" : "fas"} fa-${ALL_ICONS[value].value}`} 
              style={{ marginRight: '8px', color: '#E67E63' }}
            ></i>
          )}
          <span>{ALL_ICONS[value].text}</span>
        </div>
      ),
      data: ALL_ICONS[value]
    };
  };

  return (
    <Select
      instanceId="iconSelector"
      options={selectorOptions}
      placeholder="Icon"
      onChange={onChange}
      value={getSelectValue()}
    />
  );
}

IconSelector.propTypes = {
  updateEntry: PropTypes.func.isRequired,
  value: PropTypes.string,
};
