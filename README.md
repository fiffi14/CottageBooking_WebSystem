# Steps in order to run the project
- Run command, if possible, from terminal (Command Prompt) in VS Code:\
  \
    git clone https://github.com/fiffi14/CottageBooking_WebSystem.git

- If not download as ZIP and export it into desired root folder.

- Position to backend_Node in terminal, then run commands:\
  \
      npm install\
      tsc\
      npm run serve\
\
*"npm install" is necessary when seting up the project, "tsc" with every change in the backend source code, and "npm run serve" every time you want to start backend* 

- In separate terminal, position to frontend folder, and run commands:\
  \
      npm install\
      ng serve
  
- Then open the given link in the terminal:\
          http://localhost:4200 (e.g.)

# BEFORE SEARCHING ANYTHING -> SETUP THE DATABASE
- Install MongoDB Compass if not already:
  https://www.mongodb.com/try/download/compass

- Open MongoDB Compass app and make a new connection => +
=> URI: *mongodb://localhost:MONGODB_PORT* => Save & Connect

- the port number MONGODB_PORT can be changed (e.g. 27017) !!!

- The database and collections should appear automatically after the first search being finished.

- If previous bullet doesn't happen, in that new connection add a database strictly named *vikendica* with new collections, again, strictly named:
    - *vikendice*,
    - *rezervacije*,
    - *korisnici*.
