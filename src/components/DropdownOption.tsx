import { Listbox } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import { Key } from "react";

const DropdownOption = ({
  key,
  value,
  label,
}: {
  key: Key;
  value: any;
  label: String;
}) => (
  <Listbox.Option
    key={key}
    className={({ active }) =>
      `${
        active ? "bg-indigo-600 text-white" : "text-gray-900"
      } relative cursor-default select-none py-2 pl-3 pr-9`
    }
    value={value}
  >
    {({ selected, active }) => (
      <>
        <div className="flex items-center">
          <span
            className={`${
              selected ? "font-semibold" : "font-normal"
            } ml-3 block truncate`}
          >
            {label}
          </span>
        </div>

        {selected ? (
          <span
            className={`${
              active ? "text-white" : "text-indigo-600"
            } absolute inset-y-0 right-0 flex items-center pr-4`}
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </>
    )}
  </Listbox.Option>
);
export { DropdownOption };
