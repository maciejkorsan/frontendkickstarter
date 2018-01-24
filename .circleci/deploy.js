version: 2
jobs:
  build_deploy:
    docker:
      - image: circleci/node:latest
    steps:
      - checkout
      - run: npm install
      - run: npx gulp build
      - run: node .circleci/deploy.js
      - run: echo "WE'RE ONLINE"

workflows:
  version: 2
  deploy:
    jobs:
      - build_deploy:
        filters:
          branches:
            only:
              - master