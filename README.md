# Album Management Application

This is a Next.js application that provides a user interface to browse albums, view album details, and preview photos. It includes pagination for album listings and a responsive design.

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later) or Yarn
- Git (optional, for cloning the repository)

## Installation

1. **Clone the Repository**  
   If you have access to the repository, clone it to your local machine:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies**  
   Run the following command to install the required packages:
   ```bash
   npm install
   ```
   or, if using Yarn:
   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**  
   Create a `.env.local` file in the root directory and add the following (adjust as needed based on your API):
   ```
   NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
   ```
   Note: The current code uses JSONPlaceholder as a mock API. Replace the URL with your actual API endpoint if different.

## Running the Project

1. **Start the Development Server**  
   Run the following command to start the application in development mode:
   ```bash
   npm run dev
   ```
   or, if using Yarn:
   ```bash
   yarn dev
   ```

2. **Open the Application**  
   Open your browser and navigate to `http://localhost:3000`. You should see the album listing page.

## Project Structure

- `app/`: Contains the Next.js pages and components.
  - `albums/`: Directory for album-related pages.
    - `page.tsx`: Main albums listing page with pagination.
    - `[id]/page.tsx`: Detail page for individual albums.
- `public/`: Static assets (if any).
- `.env.local`: Environment variables (create as needed).

## Features

- Browse a paginated list of albums.
- View album details, including user information and photos.
- Preview photos in a modal with navigation (previous/next).
- Responsive design with sidebar and header layout.

## Development Notes

- **API**: The application currently uses `https://jsonplaceholder.typicode.com` for mock data. Update the fetch URLs in the code (e.g., `app/albums/page.tsx`, `app/albums/[id]/page.tsx`) to point to your API if using a different backend.
- **Dependencies**: Ensure `lucide-react` is installed for icons (`npm install lucide-react` or `yarn add lucide-react`).
- **Styling**: Uses Tailwind CSS. Customize styles in `tailwind.config.js` if needed.
- **Testing**: Test pagination, photo previews, and navigation. Adjust `total` in `app/albums/page.tsx` to match your API's total records.

## Contributing

Feel free to fork this repository, make improvements, and submit pull requests. Ensure you follow the existing code style and test your changes.

## License

[Add license information if applicable, e.g., MIT License]

## Contact

For questions or support, contact [your-email@example.com].