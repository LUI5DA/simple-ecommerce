#!/bin/bash

# Set your DockerHub username
DOCKERHUB_USER="lui5da"

# Services and their paths
declare -A SERVICES=(
  [authservice]="AuthService"
  [coreapi]="CoreApi"
  [frontend]="frontend"
)

for SERVICE in "${!SERVICES[@]}"; do
  DIR=${SERVICES[$SERVICE]}
  IMAGE_NAME="$DOCKERHUB_USER/ecommerce-$SERVICE:latest"

  echo "🔨 Building $SERVICE..."
  docker build -t $IMAGE_NAME ./$DIR

  if [ $? -ne 0 ]; then
    echo "❌ Failed to build $SERVICE. Exiting."
    exit 1
  fi

  echo "📤 Pushing $IMAGE_NAME to DockerHub..."
  docker push $IMAGE_NAME

  if [ $? -ne 0 ]; then
    echo "❌ Failed to push $SERVICE. Exiting."
    exit 1
  fi

  echo "✅ $SERVICE pushed successfully."
done

echo "🚀 All images built and pushed successfully!"
