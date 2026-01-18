#!/bin/bash

# Script to update all SKILL.md files with AGENTS.md references
# Excludes performance/SKILL.md (already updated) and library root SKILL.md

# Find all SKILL.md files except performance and library root
find .claude/skills/library -name "SKILL.md" -type f | \
  grep -v "library/SKILL.md" | \
  grep -v "performance/SKILL.md" | \
while read -r file; do
  # Get the category from path (e.g., front-end, architecture, etc.)
  category=$(echo "$file" | sed 's|.claude/skills/library/||' | cut -d'/' -f1)

  # Get the skill name
  skill=$(echo "$file" | sed 's|.claude/skills/library/||' | cut -d'/' -f2)

  # Check if file has "Reference Documentation" section
  if grep -q "## Reference Documentation" "$file"; then
    echo "Updating $file (category: $category, skill: $skill)"

    # Create backup
    cp "$file" "${file}.bak"

    # Replace "## Reference Documentation" with new section
    # This is a bit complex, so we'll use a temporary file
    awk -v cat="$category" '
      /## Reference Documentation/ {
        print "## Full Compiled Guide"
        print ""
        print "**Category Guide**: [../" cat "/AGENTS.md](../" cat "/AGENTS.md) - Complete " cat " category with all patterns and examples"
        print ""
        print "**Individual AGENTS.md**: ⚠️ Coming Q1-Q2 2026 - Will include detailed implementation guide with complete code examples"
        print ""
        print "## Additional Resources"
        next
      }
      { print }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"

  else
    # If no "Reference Documentation" section, add before last section
    echo "Adding new section to $file (category: $category)"

    # Add section before "## Common Pitfalls" or "## Anti-Patterns" or end of file
    awk -v cat="$category" '
      /^## (Common Pitfalls|Anti-Patterns)/ && !added {
        print "## Full Compiled Guide"
        print ""
        print "**Category Guide**: [../" cat "/AGENTS.md](../" cat "/AGENTS.md) - Complete " cat " category with all patterns and examples"
        print ""
        print "**Individual AGENTS.md**: ⚠️ Coming Q1-Q2 2026 - Will include detailed implementation guide with complete code examples"
        print ""
        added=1
      }
      { print }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
  fi
done

echo "Done! Updated all SKILL.md files"
echo "Backups saved with .bak extension"
