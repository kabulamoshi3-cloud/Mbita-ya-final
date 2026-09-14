#!/bin/bash

echo "🚀 Pushing to GitHub..."
echo ""
echo "Repository: https://github.com/masalagosimon442-dotcom/Mbita-emmanuel"
echo ""
echo "📦 Commits to push:"
git log origin/main..HEAD --oneline
echo ""
echo "Pushing..."
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
else
  echo ""
  echo "❌ Push failed. Please check your credentials."
  echo ""
  echo "To push manually, run:"
  echo "  cd Mbita-emmanuel"
  echo "  git push origin main"
fi
