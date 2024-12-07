# Top Stocks Search

Top Stocks Search is a React-based web application designed to allow users to search for stock information based on their input. It uses embeddings to find similar items from Pinecone, providing a dynamic user experience where stock details such as industry, sector, and ticker symbol are displayed.

## Features

- **Stock Search**: Enter a query to find similar stocks based on embeddings.
- **Loading State**: Skeleton loading cards show while the data is being fetched.
- **Dynamic Display**: Displays search results with detailed stock information including industry, location, ticker, and founded year.
- **Responsive Design**: The app adjusts its layout depending on the device screen size.
- **Real-Time Search**: Uses a backend API to fetch embeddings and query Pinecone for similar items in real time.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Pinecone for vector search
- **Icons**: React Icons for UI elements
- **Styling**: Tailwind CSS for responsive design
- **API**: Custom backend API for fetching stock embeddings

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/top-stocks-search.git
   ```

2. Install the dependencies:

   ```bash
   cd top-stocks-search
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file at the root of the project and add your Pinecone API key:

   ```
   PINECONE_API_KEY=your-pinecone-api-key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

1. Type your stock query into the text area.
2. Press the "Send" button (or hit Enter) to fetch matching stocks.
3. Results are displayed dynamically with information such as industry, ticker symbol, location, and key markets.

## UI/UX Design

The design is minimalistic and responsive:

- The main area shows a search input and a dynamic list of stock results.
- While data is loading, skeleton cards are shown.
- Stock data includes key details about each stock, such as:
  - **Name**
  - **Industry/Sector**
  - **Location**
  - **Ticker Symbol**
  - **Founded Year**
  - **Key Markets/Segments**

## Environment Variables

- `PINECONE_API_KEY`: Your Pinecone API key for querying stock embeddings.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Pinecone for vector search capabilities.
- Next.js and Tailwind CSS for building the user interface.
- React Icons for useful icons.
