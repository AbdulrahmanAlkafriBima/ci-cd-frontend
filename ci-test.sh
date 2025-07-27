#!/bin/bash

# Function to display success or failure with emojis
function display_result {
  if [ $1 -eq 0 ]; then
    echo -e "\n✅ $2 \033[0;32mSUCCESS\033[0m ✅"
  else
    echo -e "\n❌ $2 \033[0;31mFAILED\033[0m ❌"
    exit 1
  fi
}

echo -e "\n🚀 Running React CI Pipeline Checks...\n"

# Step 1: Install dependencies
echo "🔧 Installing dependencies..."
npm install
display_result $? "Dependency Installation"

# Step 2: Run tests
echo "🧪 Running tests..."
display_result $? "Test Suite"

# Step 3: Build the project
echo "🏗️ Building the project..."
npm run build
display_result $? "Project Build"

echo -e "\n🎉 \033[1;32mAll checks passed! Your React project is ready.\033[0m 🎉"
