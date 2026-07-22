# Kingfisher Church website scaffold

Static first-pass scaffold for Kingfisher Church.

## Pages

- `index.html` - home page with clear Sunday service times
- `about.html` - mission, values, and story placeholders
- `ministries.html` - ministry cards driven from `assets/js/content.js`
- `posts.html` - news and daily devotional cards driven from `assets/js/content.js`
- `get-involved.html` - connect groups, serving, and giving pathways
- `contact.html` - contact details and OpenStreetMap embed

## Future WordPress plan

The current scaffold keeps repeatable content in `assets/js/content.js`.
When the headless WordPress site is ready, replace those local arrays with API calls:

- `posts` maps naturally to WordPress posts or a `devotional` custom post type.
- `ministries` maps to a `ministry` custom post type.
- Site-wide links and service times can later come from WordPress options, ACF, or a small settings endpoint.

For now, the site can be opened directly from `index.html` without a build step.
