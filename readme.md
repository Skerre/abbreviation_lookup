# UNDP Abbreviation Lookup Tool

A simple web application that allows users to look up the definitions of UNDP-related abbreviations and acronyms.

## Features

- Search for specific abbreviations
- View all abbreviations in a modal overlay
- Responsive design for desktop and mobile devices
- Fast and lightweight

## Tech Stack

- React (via Vite)
- CSS for styling
- GitHub Pages for hosting

## Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/skerre/abbreviation_lookup.git
cd abbreviation_lookup
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

This will create a `dist` folder with the compiled application.

### Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch using GitHub Actions.

To manually deploy:

```bash
npm run deploy
```

## File Structure

- `public/` - Static assets and JSON data
  - `abbreviations_cleaned.json` - The main data file with all abbreviations
- `src/` - Source code
  - `AbbreviationLookup.jsx` - Main component for the lookup tool
  - `App.jsx` - Root component
  - `index.css` - Global styles
  - `main.jsx` - Application entry point
- `.github/workflows/` - GitHub Actions workflows for CI/CD
- `vite.config.ts` - Vite configuration

## Updating Abbreviations

To update the list of abbreviations, edit the `public/abbreviations_cleaned.json` file. The format is:

```json
{
  "ABBR": "Definition",
  "ABBR2": ["Multiple Definition 1", "Multiple Definition 2"]
}
```

## Troubleshooting

### Module Loading Issues
If you encounter MIME type errors, ensure:
- The `.nojekyll` file exists in the root and is copied to the dist folder
- The `base` path in `vite.config.ts` matches your GitHub repository name
- The JSON file is being correctly loaded with the proper base path

### Missing Files
If files are missing in the deployed site:
- Check the GitHub Actions workflow logs
- Verify that static assets are properly copied to the dist folder
- Ensure paths in the fetch requests include the base URL

## License

This project is maintained by UNDP. All rights reserved.

## Contact

For issues or questions, contact: martin.szigeti@undp.org
