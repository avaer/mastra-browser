#!/bin/bash

# Script to convert mastra-browser package names back to @mastra format
# Usage: ./to-mastra-names.sh

set -e

# Function to find all package.json files
find_package_jsons() {
  find . -name "package.json" -type f | grep -v "node_modules"
}

# Function to update dependencies in package.json
update_dependencies() {
  local file="$1"
  
  # Check if the package name in this file is mastra-browser-
  package_name=$(jq -r .name "$file")
  if [[ "$package_name" == mastra-browser-* ]]; then
    # Extract the package name without the mastra-browser- prefix
    name_part=${package_name#mastra-browser-}
    
    # Update the package name to @mastra format
    new_name="@mastra/$name_part"
    sed -i '' "s|\"name\": \"mastra-browser-$name_part\"|\"name\": \"$new_name\"|g" "$file"
    echo "Updated package name in $file from mastra-browser-$name_part to $new_name"
  fi
  
  # Update any npm aliases back to @mastra dependencies
  # if grep -q "\"npm:mastra-browser-" "$file"; then
  #   while IFS= read -r line; do
  #     if [[ "$line" =~ \"@mastra/([^\"]*)\"\:\ \"npm:mastra-browser- ]]; then
  #       dep_name="${BASH_REMATCH[1]}"
  #       # Replace the npm alias with @mastra format
  #       sed -i '' "s|\"@mastra/$dep_name\": \"npm:mastra-browser-$dep_name@\\([^\"]*\\)\"|\"@mastra/$dep_name\": \"\\1\"|g" "$file"
  #       echo "Updated dependency @mastra/$dep_name from npm:mastra-browser-$dep_name in $file"
  #     fi
  #   done < <(grep -n "\"npm:mastra-browser-" "$file")
  # fi
}

# Main execution
echo "Converting mastra-browser packages back to @mastra format..."
for pkg_json in $(find_package_jsons); do
  update_dependencies "$pkg_json"
done

echo "Conversion complete!"