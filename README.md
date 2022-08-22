This is a project to help users to find the nearest open places with best rating so they can easily and quickly pick them.

You can view the result by [accessing the page](https://sandbox-sosme.vercel.app).

## Screenshots



## Configuration

<table>
  <tr>
    <td>Framework</td>
    <td>
      <a href="https://nextjs.org/">Next</a>
    </td>
  </tr>
  <tr>
    <td>Styling</td>
    <td>
      <a href="https://tailwindcss.com">Tailwind</a>
    </td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>
      <a href="https://vercel.com">Vercel</a>
    </td>
  </tr>
</table>

## Environment

This project counts on a `.env` file that should be based on `.env.example`, containing a google Places API key.

## Running locally

```bash
yarn
yarn dev
```

## Package.json

```json
{
  "name": "sandbox-sosme",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "classnames": "^2.3.1",
    "next": "12.2.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-icons": "^4.4.0",
    "react-toastify": "^9.0.8"
  },
  "devDependencies": {
    "@types/classnames": "^2.3.1",
    "@types/google.maps": "^3.49.2",
    "@types/node": "^18.6.3",
    "@types/react": "^18.0.15",
    "@types/react-toastify": "^4.1.0",
    "autoprefixer": "^10.4.8",
    "eslint": "8.21.0",
    "eslint-config-next": "12.2.3",
    "postcss": "^8.4.14",
    "tailwindcss": "^3.1.7",
    "typescript": "^4.7.4"
  }
}
```