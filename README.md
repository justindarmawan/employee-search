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

## Using the Application

### Choose JSON File and Upload

1. Locate the sources folder:

   Navigate to the sources folder in the project directory.

2. Choose a JSON File:

   Inside the sources folder, select a JSON file that contains the employee data.

3. Upload the JSON File:

   Use the application's upload functionality to upload the selected JSON file.
   This step may involve clicking an "Upload" button or using a file input form.

4. Done!

   App has successfully created an employee hierarchy based on the provided JSON file.

### Search Employee

1. Find Employee:

   Find the name of an employee based on the hierarchy.

2. View Employee Details:

   Click on the name of the employee you found.
   View detailed information about the employee, including their manager and the number of direct and indirect reports.

### Additional Information

1. Reset Search Employee:

   Click on the "Employee Hierarchy" text.

2. Change JSON file:

   Repeat step "Choose JSON File and Upload".
