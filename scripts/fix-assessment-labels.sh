#!/bin/bash

# Script to fix incorrect Khmer assessment labels across the codebase
# This script replaces old labels with correct TaRL terminology

echo "🔧 Fixing Assessment Labels - TaRL Pratham Project"
echo "=================================================="
echo ""

# Backup confirmation
echo "⚠️  This script will modify multiple files."
echo "   Make sure you have committed your current changes."
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Creating backup..."
BACKUP_DIR="backups/label-fix-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Find all .tsx and .ts files (excluding node_modules, .next, etc.)
FILES=$(find app components lib -type f \( -name "*.tsx" -o -name "*.ts" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.next/*" \
  ! -path "*/dist/*")

# Count files
FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
echo "Found $FILE_COUNT files to process"
echo ""

# Backup files that will be modified
echo "Backing up files..."
for file in $FILES; do
  # Check if file contains any of the old labels
  if grep -q "មូលដ្ឋាន\|កុលសនភាព\|បញ្ចប់.*Baseline\|បញ្ចប់.*Midline\|បញ្ចប់.*Endline" "$file" 2>/dev/null; then
    # Create backup directory structure
    BACKUP_FILE="$BACKUP_DIR/$file"
    mkdir -p "$(dirname "$BACKUP_FILE")"
    cp "$file" "$BACKUP_FILE"
  fi
done

echo "Backup created in: $BACKUP_DIR"
echo ""

# Function to replace labels carefully
fix_labels() {
  local file="$1"
  local tmp_file="${file}.tmp"

  # Use sed to replace labels
  # We need to be careful not to replace words in other contexts

  # Replace assessment type labels (with context checking)
  sed -e "s/'baseline'.*?.*'មូលដ្ឋាន'/'baseline' ? 'តេស្តដើមគ្រា'/g" \
      -e "s/'midline'.*?.*'កុលសនភាព'/'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា'/g" \
      -e "s/'endline'.*?.*'បញ្ចប់'/'endline' ? 'តេស្តចុងក្រោយគ្រា'/g" \
      -e "s/value=\"baseline\">មូលដ្ឋាន/value=\"baseline\">តេស្តដើមគ្រា/g" \
      -e "s/value=\"midline\">កុលសនភាព/value=\"midline\">តេស្តពាក់កណ្ដាលគ្រា/g" \
      -e "s/value=\"endline\">បញ្ចប់/value=\"endline\">តេស្តចុងក្រោយគ្រា/g" \
      -e "s/baseline:.*'មូលដ្ឋាន'/baseline: 'តេស្តដើមគ្រា'/g" \
      -e "s/midline:.*'កុលសនភាព'/midline: 'តេស្តពាក់កណ្ដាលគ្រា'/g" \
      -e "s/endline:.*'បញ្ចប់'/endline: 'តេស្តចុងក្រោយគ្រា'/g" \
      -e "s/មូលដ្ឋាន (Baseline)/តេស្តដើមគ្រា (Baseline)/g" \
      -e "s/កណ្តាល (Midline)/តេស្តពាក់កណ្ដាលគ្រា (Midline)/g" \
      -e "s/កុលសនភាព (Midline)/តេស្តពាក់កណ្ដាលគ្រា (Midline)/g" \
      -e "s/ពាក់កណ្តាល (Midline)/តេស្តពាក់កណ្ដាលគ្រា (Midline)/g" \
      -e "s/បញ្ចប់ (Endline)/តេស្តចុងក្រោយគ្រា (Endline)/g" \
      "$file" > "$tmp_file"

  # Only replace if changes were made
  if ! cmp -s "$file" "$tmp_file"; then
    mv "$tmp_file" "$file"
    return 0
  else
    rm "$tmp_file"
    return 1
  fi
}

# Process files
echo "Processing files..."
MODIFIED_COUNT=0

for file in $FILES; do
  if grep -q "មូលដ្ឋាន\|កុលសនភាព\|កណ្តាល.*Midline\|ពាក់កណ្តាល" "$file" 2>/dev/null; then
    if fix_labels "$file"; then
      echo "  ✓ $file"
      ((MODIFIED_COUNT++))
    fi
  fi
done

echo ""
echo "=================================================="
echo "✅ Fix Complete!"
echo "   Files modified: $MODIFIED_COUNT"
echo "   Backup location: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test the application"
echo "3. If issues occur, restore from backup:"
echo "   cp -r $BACKUP_DIR/* ."
echo ""
