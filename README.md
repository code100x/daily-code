
<h1 align="center">🎯DailyCode🎯</h1>

DailyCode is the learning platform for Developers and here they can choose there respective tracks
and start there learning journey. This platform is designed to help developers enhance their skills set.

## 🖱️Live Demo

Here is the live view of this website. It is Hosted on https://projects.100xdevs.com/


## 📦️Building up the project.


1. Install up the Dependencies. 
```markdown
    yarn install
```
2. Copy the env example to .env .
```markdown
    cd /packages/db
    cp .env.example .env
```
3. Update the .env file with the database url.

4.  Migrate up the Database and Seed the database.
```markdown
    npx prisma migrate dev
    npx prisma db seed
```
5. Or all these Database Steps(2-4) can be run up by a single bash script file .(but git bash is required)
```markdown
    cd packages/db
    chmod +x ./setupDB.sh
    ./setupDB.sh
```

5. Finally Run Up locally By
```markdown
    cd ../..
    yarn run dev
```
### 🐬Building up the project with Docker

1. Build the Docker Image
```markdown
    docker-compose up
```

## How to Contribute to this repository

1. Fork the repository (Click the Fork button in the top right of this page,
   click your Profile Image)

2. Clone the forked repository to your local machine.

```markdown
    git clone https://github.com/<username>/daily-code.git
```

4. change the present working directory to

```markdown
    cd daily-code
```

5. Create a new branch

```markdown
    git checkout -b branch-name
```

6. Make your changes

```markdown
    git add .
```
7. Commit up the Code. 
```markdown
    git commit -s -m "Your commit Message" 
```
8. Push the changes to your branch.

```markdown
    git push origin branch-name
```

9. If you go to your repository on GitHub, you'll see a Compare & pull request button. Click on that button.

10. Now submit the pull request.
### 🗒️NOTE

- Make Sure you commit your changes in a new branch.
- Make Sure you Give a proper name to your files describing the addition.
- Also Make Sure you comment on your code wherever necessary.

## 💻Technology Stack


[![My Skills](https://skillicons.dev/icons?i=nextjs,ts,prisma,tailwind,notion)](https://skillicons.dev)
<img height="50" src="https://user-images.githubusercontent.com/4060187/196936104-5797972c-ab10-4834-bd61-0d1e5f442c9c.png">




## 🤝Our Contributors

<a href="https://github.com/hkirat/daily-code/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hkirat/daily-code" />
</a>



