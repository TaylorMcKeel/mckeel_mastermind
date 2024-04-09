# Mastermind Game

Thank you for playing Mastermind. The purpose of this app is to create a brain teaser game where the user plays against the computer, trying to guess a 4-6 digit number.

## How Do I play

- The game will begin on the homepage with the title of the game shown.

  - First you must select the difficulty you want to play.
  - When you are ready to start, click "Let's Begin."

- Once you click the link, the computer will automatically generate a 4-6 digit number, depending on the difficulty selected.

  - Each digit will be a number between 0-7.
    - The game will not let you select a number greater than 7, a letter/symbol, or allow you to type more numbers than are being played.
    - An error will generate, explaining why what you are typing is not rendering on the screen.

- After each guess, the computer will tell you if you are correct.

  - If you are not correct, the computer will tell you how many of your numbers were correct and how many were in the correct position (if any).

- You will have 10 tries to guess the correct series of numbers.

- If correct, you will be taken to a new screen showing you won.

- If you run out of tries, you will be taken to a new screen saying you lost.

## How can I run this app?

This app was built using React.

- Create a `.env` file. In it, you need to have the following keys: `PORT=5001` and `MONGO_URL = mongodb+srv://josephmckeel:t1a2y3@cluster0.rvutz9g.mongodb.net/?retryWrites=true&w=majority`

- Install the appropriate libraries by running npm i in the terminal.

- Run `npm run start-dev` in your terminal.

- Open your browser to `http://localhost:5001/`.

## How to Run Test

- There are a few test, that test the GET, POST, and DELETE requests on the backend.

- In order to run the tests run `npm test` in your console.

## Code Structure

### Backend

- To build this game, I decided to use a non-relational database since the only data being stored was in relation to one game (the numbers, number of plays, and previous plays). I designed my model using mongoose with MongoDB containing those three aspects.

- I decided that since only one game was running at a time, it was necessary to have 4 routes.

  - A GET all route since there would only be one game at a time.
  - A POST route to create a new game.
  - A PUT route to update the new game with each play.
  - A DELETE all route that cleared all games when a new one began.

- I used an express server to handle all of my backend routes.

### Frontend

- For the front end of my application I decided to use React components.

- There are two main components in my application:

  - The Home component is where the game begins. Since the game begins here when it is rendered, all games are deleted from the database, and when you click the begin button, a new game is created and posted to the database.

  - The Game component is where all of the gameplay takes place. This is where the user will enter each play, and it will compare their answer with the answer from the database, updating the database with all of their attempts so that they can be displayed as the user navigates through the game.

- I use Axios to make the API call to retrieve the random numbers, as well as to make GET, POST, PUT, and DELETE requests to the database.
