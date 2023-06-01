# Project management app

This is a repo of full-stack app crafted for the needs of my client's company.

## Why?

One of my clients was using internal applications to manage his company's projects. I had to use this app very often due to our close cooperation.

The app was written years ago in bare PHP 5. Most of its business logic was built on complicated raw SQL queries; the front-end was JQuery heavy. While it mostly served its purpose, the technical debt began to show. It was often *very slow*. Rendering some pages would take almost a minute! It was also tedious to navigate, search, or filter the data.

## The goal

The goal was to create a new version of the application with an emphasis on speed and a great user experience.
## Main challenges

It was the biggest app I'd created up to that point and the first full-stack one. I also had no previous experience with any back-end framework.

The database structure was quite messy and hardly normalized, with inconsistent naming. I took the legacy database as a starting point and gradually migrated it into better shape.

The backend is built on Laravel, which provides a robust, future-proof solution. The database is plain-old MySQL.

The front-end is a single-page app built with React. Since it's for logged-in users only, I didn't care much about SSR. The codebase was initially written in JavaScript, but I've since migrated it to TypeScript. State management is done by the Redux toolkit.

Because of the focus on speed, the code is being pretty aggressively code-splitted and preloaded. For a production build, React is being aliased to Preact, which results in a much smaller bundle size overall.

Styling is being done using twin.macro, which is basically Tailwind but used as css-in-js.

Because of the stack, the application is very easy to deploy. I use AWS Lightsail's VPS for hosting.

## TODO

- [ ] The frontend file structure is really messy. Needs to be tidied up ASAP!
- [ ] The database still isn't fully normalized; there are some duplications.
- [ ] The names of many tables and rows are still mainly in Czech and are often confusing or inconsistent.
- [ ] File upload won't handle extra-large files. This can be handled either by adding resumability or using an external service (S3?).
- [ ] Some features (not vital ones) are still to be added.
