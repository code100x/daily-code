FROM node:20-alpine

WORKDIR usr/src/app

#script to copy all package.json & yarn.lock file/s in docker image 
COPY copyalljson.sh .
RUN chmod +x copyalljson.sh 
RUN ./copyalljson.sh

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev:docker"]
