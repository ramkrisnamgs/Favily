// Client/src/components/shopping-view/filter.jsx

import { filterOptions } from "@/config"; // Importing filter options from configuration
import { Fragment } from "react"; // Importing Fragment from React for grouping elements
import { Label } from "../ui/label"; // Importing Label component for filter options
import { Checkbox } from "../ui/checkbox"; // Importing Checkbox component for user selection
import { Separator } from "../ui/separator"; // Importing Separator component for visual separation

/**
 ** ProductFilter Component
 * 
 * Renders a filter section for products, allowing users to select various 
 * filter options based on categories and attributes.
 * 
 * Props:
 * - filters (object): Current selected filters.
 * - handleFilter (function): Function to handle filter changes.
 */
function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm"> {/* Container for the filter section */}
      <div className="p-4 border-b"> {/* Header section */}
        <h2 className="text-lg font-semibold">Filters</h2> {/* Title for the filter section */}
      </div>
      <div className="p-4 space-y-4"> {/* Container for filter items */}
        {/* Mapping through filter options to create filter items */}
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}> {/* Fragment to group filter items */}
            <div>
              <h3 className="text-base font-medium">{keyItem}</h3> {/* Filter category title */}
              <div className="grid gap-2 mt-2"> {/* Container for individual filter options */}
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-2"> {/* Label for each filter option */}
                    <Checkbox
                      checked={
                        filters && // Check if filters exist
                        Object.keys(filters).length > 0 && // Ensure filters are not empty
                        filters[keyItem] && // Check if the current keyItem has filters
                        filters[keyItem].indexOf(option.id) > -1 // Check if the option is selected
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)} // Handle filter change
                    />
                    <span>{option.label}</span> {/* Display the label for the filter option */}
                  </Label>
                ))}
              </div>
            </div>
            <Separator /> {/* Separator between filter categories */}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter; // Exporting the ProductFilter component