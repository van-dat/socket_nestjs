# Cloudinary Setup Guide

This application now uses Cloudinary for image storage and processing. All uploaded images are automatically converted to WebP format for optimal performance.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## Getting Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your dashboard
3. Copy your cloud name, API key, and API secret
4. Add them to your `.env` file

## Features

- **Automatic WebP Conversion**: All uploaded images are converted to WebP format
- **Quality Optimization**: Images are optimized with 80% quality and auto settings
- **Cloud Storage**: Images are stored on Cloudinary's CDN for fast delivery
- **Multiple File Support**: Products can have multiple images
- **Error Handling**: Proper error handling for upload failures

## API Changes

### Products

- `POST /products` - Upload multiple images via `images` field
- `PUT /products/:id` - Update product with new images

### Blogs

- `POST /blogs` - Upload single image via `image` field
- `PUT /blogs/:id` - Update blog with new image

All images are now returned as Cloudinary URLs instead of local file paths.
