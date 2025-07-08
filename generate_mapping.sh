#\!/bin/bash

# Create the directory if it doesn't exist
mkdir -p src/assets/signs

# Start the TypeScript file
cat > src/assets/signs/jpgSignMapping.ts << 'TSEOF'
/**
 * Mapping of sign codes to their JPG file paths
 * Auto-generated from public/signs directory
 */

export const jpgSignMapping: Record<string, string> = {
TSEOF

# Find all JPG files and process them
declare -A seen_codes

find "public/signs" -type f \( -name "*.jpg" -o -name "*.JPG" \) | sort | while read -r file; do
    # Get the relative path from public/signs
    relative_path="${file#public/signs/}"
    
    # Extract the filename without path
    filename=$(basename "$file")
    
    # Extract the sign code (everything before .jpg or .JPG)
    code="${filename%.[jJ][pP][gG]}"
    
    # Skip if we've already seen this code (handle duplicates)
    if [[ -z "${seen_codes[$code]}" ]]; then
        seen_codes[$code]=1
        
        # Add to the mapping
        echo "  \"${code}\": \"/signs/${relative_path}\"," >> src/assets/signs/jpgSignMapping.ts
    fi
done

# Close the TypeScript object
echo "};" >> src/assets/signs/jpgSignMapping.ts

echo "Mapping file created at src/assets/signs/jpgSignMapping.ts"
