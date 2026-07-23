# Kingfisher Church website scaffold

Static first-pass scaffold for Kingfisher Church.

## Pages

- `index.html` - home page with clear Sunday service times
- `about.html` - mission, values, and story placeholders
- `ministries.html` - ministry cards driven from `assets/js/content.js`
- `posts.html` - news and daily devotional cards driven from `assets/js/content.js`
- `get-involved.html` - connect groups, serving, and giving pathways
- `contact.html` - contact details and OpenStreetMap embed
- `events.html` - ChurchSuite event feed concept using sample data
- `groups.html` - searchable ChurchSuite Connect Groups concept using sample data

## Future WordPress plan

The current scaffold keeps repeatable content in `assets/js/content.js`.
When the headless WordPress site is ready, replace those local arrays with API calls:

- `posts` maps naturally to WordPress posts or a `devotional` custom post type.
- `ministries` maps to a `ministry` custom post type.
- Site-wide links and service times can later come from WordPress options, ACF, or a small settings endpoint.

For now, the site can be opened directly from `index.html` without a build step.

## ChurchSuite integration concept

The event, group and enquiry experiences currently use clearly labelled sample data from
`assets/js/churchsuite-demo-data.js`. The rendering and filtering live separately in
`assets/js/churchsuite-demo.js`, so the sample source can later be replaced with the public
ChurchSuite Embed API while keeping the same page design. Forms are demonstrations only and
do not currently transmit or store personal data.
