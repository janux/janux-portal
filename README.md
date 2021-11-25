# Janux Portal

This project is still under construction.  If you are interested in learning more, please send an
email to pparavicini@janux.org, and come back soon.

**Requirements**

1.- Git.

2.- Node latest stable version.

3.- Bower and gulp installed globally.

4.- Optional: A running mongo database.

`npm install -g gulp`

`npm install -g bower`

This project depends on janux-persist , janux-people and janux-authorize. You need do the following.

*1.- Install janux-people.*

a.- Get janux-people at 'https://github.com/janux/janux-people.js.git'

b.- Checkout branch dev (`git fetch && git checkout develop`).

c.- Run 'npm install' and then run 'gulp'

*2.- Install janux-authorize.*

a.- Get janux-authorize at 'https://github.com/janux/janux-authorize.js.git'.

b.- Checkout branch develop (`git fetch && git checkout develop`)

c.- Run 'npm install' and then run 'gulp'

*3.- Install janux-persist.*

a.- Get janux-persist at 'https://github.com/janux/janux-persist.js.git'.

b.- Checkout branch dev (`git fetch && git checkout dev`)

c.- Create vendor directory (`mkdir -p $JANUX_PERSIST/vendor`)

d.- Create symlinks of janux-people and janux-authorize. Inside the vendor directory execute ...

`ln -s $PATH_JANUX_PEOPLE && ln -s $PATH_JANUX_AUTHORIZE`

For windows users you need to modify package.json and replace the path of janux-people and janux-persist with the correct paths.

e.-Run 'npm install and then run 'gulp'

*4.- *How to install Janux Portal *

a.- Clone the project at 'janux-portal.git'.

b.- Switch to branch develop ('git fetch && git checkout develop').

c.-  Create symlinks of janux-people, janux-authorize and janux-persist. Inside the server/vendor directory execute ...

`ln -s $PATH_JANUX_PEOPLE && ln -s $PATH_JANUX_AUTHORIZE $$ ln -s $PATH_JANUX-PERSIST`

For windows users you need to modify server/package.json and replace the path of janux-people and janux-persist with the correct paths.

d.- At the root of the directory run `npm install`.

**How to run the project.**

Run the following tasks.

1.- Create users sample data by running `npm run generate-demo-users`

2.- Create auth-context sample data by running `npm run generate-demo-auth`\

3.- Execute `gulp watch`.

At this moment there is a server running at http://localhost:9000.
