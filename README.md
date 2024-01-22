# Employee Search

Welcome to my project! This repository contains the source code and documentation for [Employee Search].

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)

### Installing

1. Clone the repository:

   ```bash
   git clone git@github.com:justindarmawan/employee-search.git
   ```

2. Build the Docker Image:

   ```bash
   docker build -t employee-search-justin-image .
   ```

3. Run the Docker Container:

   ```bash
   docker run -p 3000:3000 -d employee-search-justin-image
   ```

4. Access the Application:

   Open your web browser and navigate to http://localhost:3000/employees to access the Employee Search App.
