#!/bin/bash

# Script to convert @mastra package names to mastra-browser format
# Usage: ./to-browser-names.sh

set -e

# Function to find all package.json files
find_package_jsons() {
  find . -name "package.json" -type f | grep -v "node_modules"
}

# Function to update dependencies in package.json
update_dependencies() {
  local file="$1"
  
  # Check if the package name in this file is @mastra/
  package_name=$(jq -r .name "$file")
  if [[ "$package_name" == @mastra/* ]]; then
    # Extract the package name without the @mastra/ prefix
    name_part=${package_name#@mastra/}
    
    # Update the package name to mastra-browser format
    new_name="mastra-browser-$name_part"
    sed -i '' "s|\"name\": \"@mastra/$name_part\"|\"name\": \"$new_name\"|g" "$file"
    echo "Updated package name in $file from @mastra/$name_part to $new_name"
  fi
  
  # Update any @mastra dependencies to use npm aliases
  # if grep -q "\"@mastra/" "$file"; then
  #   # Find all @mastra dependencies and update them
  #   for dep in $(grep -o "\"@mastra/[^\"]*\"" "$file" | sed 's/"//g'); do
  #     dep_name=${dep#@mastra/}
  #     browser_name="mastra-browser-$dep_name"
      
  #     # Replace the dependency with npm alias format
  #     sed -i '' "s|\"$dep\": \"\\([^\"]*\\)\"|\"$dep\": \"npm:$browser_name@\\1\"|g" "$file"
  #     echo "Updated dependency $dep to use npm:$browser_name in $file"
  #   done
  # fi
}

# Main execution
echo "Converting @mastra packages to mastra-browser format..."
for pkg_json in $(find_package_jsons); do
  update_dependencies "$pkg_json"
done

echo "Conversion complete!"