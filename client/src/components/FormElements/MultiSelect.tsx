"use client";
import React, { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  text: string;
  selected: boolean;
  element?: HTMLElement;
}

interface DropdownProps {
  id: string;
  onChange: (selectedValues: string[]) => void; // Fonction de rappel pour notifier le parent
}

const MultiSelect: React.FC<DropdownProps> = ({ id, onChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);

  const open = () => setShow(true);

  const close = () => setShow(false);

  useEffect(() => {
    fetch("http://localhost:8080/users/")
        .then((rawData) => rawData.json())
        .then((userList: { user_id: number; user_name: string }[]) => {
            const formattedData = userList.map((user: { user_id: number; user_name: string }) => ({
                text: user.user_name,
                value: user.user_id.toString(),
                selected: false
            }));
            setOptions(formattedData);
        });
  }, []);
  const select = (index: number, event: React.MouseEvent) => {
    const newOptions = [...options];
    if (!newOptions[index].selected) {
      newOptions[index].selected = true;
      newOptions[index].element = event.currentTarget as HTMLElement;

      // Mise à jour de l'état local de sélection
      const newSelected = [...selected, index]; // Ajouter l'index à la sélection
      setSelected(newSelected);

      // Notifier le parent après la mise à jour de l'état local
      onChange(newSelected.map((i) => options[i].value)); // Passer les valeurs correspondantes au parent
    }
    setOptions(newOptions); // Met à jour la liste des options
  };

  const remove = (index: number) => {
    const newOptions = [...options];
    const selectedIndex = selected.indexOf(index);
    if (selectedIndex !== -1) {
      newOptions[index].selected = false;
      const newSelected = selected.filter((i) => i !== index); // Supprimer l'index de la sélection
      setSelected(newSelected);
      setOptions(newOptions); // Met à jour la liste des options

      // Notifier le parent après la mise à jour de `selected`
      onChange(newSelected.map((i) => options[i].value)); // Passer les nouvelles valeurs au parent
    }
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (
        !dropdownRef.current ||
        dropdownRef.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) {
        return;
      }
      close(); // Fermer le dropdown si vous cliquez en dehors
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [show]);

  return (
    <div className="relative z-50">
      <input name="values" type="hidden" defaultValue={selected.join(",")} />
      <div className="flex flex-col items-center">
        <div className="relative z-20 inline-block w-full">
          <div ref={trigger} onClick={open} className="w-full">
            <div className="mb-2 flex rounded-[7px] border-[1.5px] border-stroke py-[9px] pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2">
              <div className="flex flex-auto flex-wrap gap-3">
                {selected.map((index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center rounded-[5px] border-[.5px] border-stroke bg-gray-2 px-2.5 py-[3px] text-body-sm font-medium dark:border-dark-3 dark:bg-dark"
                  >
                    <div className="max-w-full flex-initial">
                      {options[index].text}
                    </div>
                    <div className="flex flex-auto flex-row-reverse">
                      <div
                        onClick={() => remove(index)}
                        className="cursor-pointer pl-1 hover:text-red"
                      >
                        <svg
                          className="fill-current"
                          role="button"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                            fill=""
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
                {selected.length === 0 && (
                  <div className="flex-1">
                    <input
                      placeholder="Select an option"
                      className="h-full w-full appearance-none bg-transparent p-1 px-2 text-dark-5 outline-none dark:text-dark-6"
                      defaultValue={selected.join(",")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {show && (
            <div className="w-full px-4">
              <div
                className="absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow-1 dark:bg-dark-2 dark:shadow-card"
                ref={dropdownRef}
              >
                <div className="flex w-full flex-col">
                  {options.map((option, index) =>
                    !option.selected ? (
                      <div key={index} onClick={(event) => select(index, event)}>
                        <div className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-dark-3">
                          <div className="relative flex w-full items-center border-l-2 border-transparent p-2 pl-2">
                            <div className="flex w-full items-center">
                              <div className="mx-2 leading-6">{option.text}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;


