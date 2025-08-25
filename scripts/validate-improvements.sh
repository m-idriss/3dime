#!/bin/bash

# Validation script for the screenshot workflow
echo "🔍 Validating screenshot workflow improvements..."

# Check if required files exist
echo "📁 Checking required files..."
required_files=(
    "scripts/take-screenshots.js"
    "scripts/package.json"
    ".github/workflows/update-screenshot.yml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Validate script contains required wait conditions
echo ""
echo "🔍 Validating wait conditions in script..."
script_file="scripts/take-screenshots.js"

required_patterns=(
    "networkidle2"
    "waitForSelector.*footer"
    "waitForSelector.*cards-container"
    "waitForFunction"
)

for pattern in "${required_patterns[@]}"; do
    if grep -q "$pattern" "$script_file"; then
        echo "✅ Found: $pattern"
    else
        echo "❌ Missing: $pattern"
        exit 1
    fi
done

# Validate workflow uses new script
echo ""
echo "🔍 Validating workflow configuration..."
workflow_file=".github/workflows/update-screenshot.yml"

if grep -q "take-screenshots.js" "$workflow_file"; then
    echo "✅ Workflow uses new screenshot script"
else
    echo "❌ Workflow not updated to use new script"
    exit 1
fi

if grep -q "SCREENSHOT_URL" "$workflow_file"; then
    echo "✅ Workflow configures URL environment variable"
else
    echo "❌ Workflow missing URL configuration"
    exit 1
fi

echo ""
echo "🎉 All validations passed! Screenshot workflow improvements are ready."
echo ""
echo "📋 Summary of improvements:"
echo "   • Network idle waiting (networkidle2)"
echo "   • Stable element waiting (footer)"
echo "   • Animation completion detection"
echo "   • Dynamic content loading detection"
echo "   • Better error handling and logging"