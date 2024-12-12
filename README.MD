# BookstoreApp

## Getting started 

To run this project locally, follow these steps:

### Prerequisites
- **Docker**: Make sure Docker and Docker Compose are installed on your machine.

### 1. Clone the Repository
First, clone this repository to your local machine:
```bash
git clone https://github.com/username/bookstore-app.git
cd bookstore-app 
```


### 2. Download Data Files
This project uses two datasets available at the following link: [Amazon Books Reviews](https://www.kaggle.com/datasets/mohamedbakhet/amazon-books-reviews). Due to size limitations, these datasets are not included within the repository. Download the datasets, rename them, and place them as follows:

- **Download and rename the datasets**:
  - `books_data.csv`
  - `Books_rating.csv`

- **Place these files in the following directory**:
  ```plaintext
  bookstore-app/
  └── preprocessing/
      └── data/
          ├── books_data.csv
          └── Books_rating.csv

### 3. Data preprocessing 
To prepare the data for use within the application, follow these steps:

1- Run the Preprocessing Notebook: Open and run the notebook `Preprocess_data.ipynb` located in the `preprocessing` directory. This notebook processes the raw data files and outputs the cleaned data to the `data_preprocessed directory`.

2- Check Output: After preprocessing, you should see the processed data in the following directory:
  ```plaintext
  bookstore-app/ 
  └── preprocessing/ 
      └── data_preprocessed/ 
          ├── preprocessed_books_data.csv
          └── preprocessed_books_ratings.csv


### 4. Load data into database (Optional)
For a more complete experience, load the preprocessed data into the database:

1- Use the DataLoader: Run `DataLoader.py` in the preprocessing directory. This script loads the preprocessed data into the database container to populate initial records.
```bash
python preprocessing/DataLoader.py
```

2- Verify Data Loading: Once completed, the database should contain the imported books and ratings data, ready to enhance the app experience.

### 5. Run the application 

With Docker Compose, you can now build and start all required containers
```bash
docker-compose up --build
```

## Usage Instructions

The app allows you to interact with the bookstore in two different modes:

### Admin mode:
- Access all functionalities for managing the bookstore’s collection of books.
- Add, edit, and delete books.

### User mode:
- Browse and review books.
- Receive personalized recommendations based on your ratings.

## Key Features

- *Item-based Recommendation*s: provides recommendations based on similar items (books) using collaborative filtering and SVD techniques.
- *User-based Recommendations*: generates personalized recommendations based on similar users' ratings using collaborative filtering and SVD for more accurate predictions.
- *Admin and User Interfaces*: Separate interfaces allow for tailored interactions.
- *REST API*: The backend offers REST endpoints for accessing books, reviews, and recommendations.
- *Dockerized Environmen*t: The application is containerized for ease of setup and deployment.

## Future Enhancements

Potential improvements to this project include:

- *User Authentication*: Adding a secure authentication system to allow individual user logins. This would improve data integrity and allow personalized experiences for authenticated users versus admins. 

- *Enhanced Recommendation Models*: Improve the recommendation system with advanced algorithms, such as deep learning-based models, and incorporate content-based or hybrid approaches to enhance recommendation accuracy and relevance.
