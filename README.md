# React Project Setup Instructions

## Prerequisites
- Node.js 
- npm 

## Getting Started

1. **Extract the ZIP File:**
   Extract the contents of the ZIP file to a desired location on your machine.

2. **Open a Terminal:**
   Open a terminal window and navigate to the project directory.

3. **Install Dependencies:**
   Run the following command to install the required dependencies:
   npm install

   this will install the dependencies that exist in the package.json file 

if you prefer to open the project from github you can make a git clone from this link: https://github.com/yazanateer/librarian-app



4- to run the project, run the following command:
    npm run start

because we use three mini apps each one in a differnet web page, so every mini app run on different PORT , this miniapp run on PORT:3001
if it doesnt work because using a differnt system ( not using the windows system) you must change in:
package.json: line 16 - script -> start -> "start": "react-scripts start", 
