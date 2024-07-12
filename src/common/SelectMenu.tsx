import { Fragment, forwardRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, TickIcon } from "./icons";
import { cn } from "../utils/cn";

type Props = {
  options: SelectOption[];
  value: string;
  label?: string;
  onChange: (option: string) => void;
};

export type SelectOption = {
  value: string;
  id: string;
};

function Component(
  { options, value, onChange, label }: Props,
  ref: React.Ref<HTMLButtonElement>
) {
  const selected = options.find(option => option.id === value);
  const handleChange = (option: SelectOption) => {
    onChange(option.id);
  };
  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-medium leading-6 text-zinc-300">
              {label}
            </Listbox.Label>
          )}
          <div className="relative mt-2">
            <Listbox.Button
              ref={ref}
              className={cn(
                "relative w-full cursor-default rounded-lg bg-white ring-1 ring-inset ring-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-700 h-10 pl-6 pr-10 text-left shadow-sm focus:outline-none text-lg sm:leading-6 border-0 focus-within:ring-zinc-200 py-0",
                open && "ring-2 ring-zinc-200"
              )}
            >
              <span className="block truncate">{selected?.value}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-zinc-400 fill-zinc-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-zinc-400 ring-opacity-30 focus:outline-none sm:text-sm">
                {options.map(option => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      cn(
                        active ? "bg-indigo-600 text-white" : "text-zinc-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cn(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option.value}
                        </span>

                        {selected ? (
                          <span
                            className={cn(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <TickIcon className="h-5 w-5 fill-white" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

const SelectMenu = forwardRef(Component);

export default SelectMenu;
