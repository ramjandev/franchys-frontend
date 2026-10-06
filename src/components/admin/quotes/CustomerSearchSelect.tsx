import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
} from "@/store/Customer/customerAPI";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface CustomerSearchSelectProps {
  value: string | undefined;
  onValueChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}
const CustomerSearchSelect: React.FC<CustomerSearchSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select a customer",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isFetching } = useGetAllCustomersQuery({
    search: debouncedSearch || undefined,
    limit: 20,
  });

  const options = useMemo(
    () =>
      data?.data.map((customer) => ({
        label: `${customer.firstName} ${customer.lastName || ""}`.trim(),
        value: customer.id,
      })) ?? [],
    [data],
  );

  const { data: selectedCustomerData } = useGetCustomerByIdQuery(value!, {
    skip: !value,
  });

  const selectedLabel = useMemo(() => {
    const fromResults = options.find((o) => o.value === value)?.label;
    if (fromResults) return fromResults;
    if (selectedCustomerData?.data) {
      const c = selectedCustomerData.data;
      return `${c.firstName} ${c.lastName || ""}`.trim();
    }
    return undefined;
  }, [options, value, selectedCustomerData]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "bg-background border border-border! px-3 py-3 cursor-pointer rounded-md text-sm transition-all duration-200 flex items-center justify-between w-full",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          <span className={value ? "" : "text-muted-foreground"}>
            {value ? (selectedLabel ?? "Selected customer") : placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 bg-white border rounded-md shadow-md w-[--radix-popover-trigger-width]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search customers..."
            value={searchInput}
            onValueChange={setSearchInput}
          />
          <CommandList>
            {isFetching ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : (
              <>
                <CommandEmpty>No customer found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onValueChange(option.value);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerSearchSelect;
