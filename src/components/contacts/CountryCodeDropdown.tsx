"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

interface CountryCodeDropdownProps {
  value?: Country;
  onChange: (country: Country | undefined) => void;
  defaultCountry?: Country;
}

export function CountryCodeDropdown({
  value,
  onChange,
  defaultCountry = "US",
}: CountryCodeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const countries = useMemo(() => {
    return getCountries().map((country) => ({
      code: country,
      callingCode: getCountryCallingCode(country),
      name: new Intl.DisplayNames(["en"], { type: "region" }).of(country) || country,
    }));
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.callingCode.includes(query)
    );
  }, [countries, searchQuery]);

  const selectedCountry = countries.find((c) => c.code === value) || 
    countries.find((c) => c.code === defaultCountry);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[140px] justify-between h-10 px-3"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm font-medium">
              +{selectedCountry?.callingCode}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedCountry?.code}
            </span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search country..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code} ${country.callingCode}`}
                  onSelect={() => {
                    onChange(country.code);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground w-8">
                        {country.code}
                      </span>
                      <span className="text-sm">{country.name}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      +{country.callingCode}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}



