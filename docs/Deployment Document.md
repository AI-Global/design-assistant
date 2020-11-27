# Deployment Document

## Installing Node and npm

```
sudo apt update
sudo apt-get install -y nodejs
sudo apt install -y npm
sudo npm install -g n stable
sudo n stable
```

Node.JS and npm are both required to run this app. Restart your terminal after running these commands.

## Environment Variables
There are two .env files that you'll need to enter information into before running the app.

### backend/.env

```
DB_CONNECTION = "Enter your MongoDB conncetion string here"
TEST_DB_CONNECTION = "Enter your testing MongoDB conncetion string here"
PORT = "Enter the port number you want the backend server to use"
JWT_SECRET = "Enter a secret string here"
SESSION_TIMEOUT = "Set this to 30d or however long you want sessions to last if users select remember me when logging in"
MAILSERVICE_USERNAME = "Mailing service email"
MAILSERVICE_PASSWORD = "Mailing service password"
```

### frontend/.env

```
REACT_APP_SERVER_ADDR = "http://{BACK_END_SERVER_ADDRESS}:{BACKEND_SERVER_PORT} Address to your back end server"
REACT_APP_GAID = "UA-XXXXXXXXX-X replace this with your google analytics UA id"
REACT_APP_TESTING_ADDR = "http://URLtoRunTestsOn.com Address to your front end app"
```


## Installing Node modules


```
cd frontend/ && sudo npm install  && cd ../backend/ && sudo npm install && cd ../
```

This command will install the required frontend and backend node modules.

## Run

### Backend server

#### This command will start your backend server

```
cd backend/
sudo npm start
```

### Frontend App (Developement)

#### This command will start your frontend app on port 3000

```
cd frontend/
sudo npm start
```
#### Use this command if you want to specify a different port to run your frontend app on

```
cd frontend/
sudo PORT=80 npm run start
```

### Frontend App (Production)

#### Create production build

```
cd frontend/
sudo npm run build
```

#### Run this if you don't have npm serve installed

```
sudo npm install -g serve
```

#### Deploy production build on port 80

```
sudo serve -s build -l 80
```
